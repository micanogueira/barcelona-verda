#!/usr/bin/env node
// Import real Barcelona green-space data (urban gardens + parks) from the
// Ajuntament's public ArcGIS feature service (Observatori d'Agricultura Urbana)
// and write a full-refresh SQL file for Supabase.
//
//   Usage:  node scripts/import-bcn-data.mjs
//   Output: supabase/import-real-data.sql  (paste into the Supabase SQL editor)
//
// The generated file replaces the whole 'ajuntament' set in one transaction
// (DELETE + INSERT), so re-running is idempotent and removes rows that dropped
// out of the source. Curated demo rows (source 'example') are never touched.
//
// School gardens (horts escolars) are excluded: they are internal to schools
// (students/teachers), not open community-participation spaces. Each hort is
// tagged with a `subtype` derived from the ArcGIS ORIGEN field
// (municipal / comunitari / social); municipal ones map to the XHM program.

import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const BASE = 'https://services2.arcgis.com/KlzkV0ROO8BmwwDe/arcgis/rest/services/Servidor_horts2026_WFL1/FeatureServer'
const SOURCE = 'ajuntament'
const PAGE = 1000

const esc = (v) => (v == null || String(v).trim() === '') ? 'NULL' : `'${String(v).trim().replace(/'/g, "''")}'`
const finite = (n) => typeof n === 'number' && Number.isFinite(n)

// A hort is a school garden if ORIGEN/TIPUS mentions "escolar" (or "Educatiu").
const isSchoolGarden = (p) => {
  const o = (p.ORIGEN || '').toLowerCase()
  const t = (p.TIPUS || '').toLowerCase()
  return o.includes('escolar') || o === 'educatiu' || t.includes('escolar')
}

// Map the ArcGIS ORIGEN field to our hort subtype (label + program tag driver).
// Only ORIGEN exactly 'Municipal' is the real XHM network — cross-checked
// against the city directory (GuiaBCN "Horts Urbans" category), which matches
// these ~15 one-to-one. Other municipally-originated horts (Pla Buits, Dte,
// IMPD…) are NOT part of XHM, so they stay a plain "Hort urbà" and get no badge.
// Comunitari / Social keep their own label; everything else is a plain hort.
const hortSubtype = (origen) => {
  const o = (origen || '').trim().toLowerCase()
  if (o === 'municipal') return 'municipal'
  if (o === 'comunitari') return 'comunitari'
  if (o === 'social') return 'social'
  return null
}

async function fetchPaged(layer, { outFields, geojson }) {
  const out = []
  for (let offset = 0; ; offset += PAGE) {
    const common = `where=1%3D1&outFields=${encodeURIComponent(outFields)}&outSR=4326&resultOffset=${offset}&resultRecordCount=${PAGE}`
    const url = geojson
      ? `${BASE}/${layer}/query?${common}&f=geojson`
      : `${BASE}/${layer}/query?${common}&returnGeometry=false&returnCentroid=true&f=json`
    const data = await (await fetch(url)).json()
    const feats = data.features || []
    out.push(...feats)
    if (feats.length < PAGE) break
  }
  return out
}

// (name, type, address, district, neighborhood, location, source, external_id, subtype)
const row = (r) =>
  `  (${esc(r.name)}, '${r.type}', ${esc(r.address)}, ${esc(r.district)}, ${esc(r.neighborhood)}, st_point(${r.lng}, ${r.lat}), '${SOURCE}', ${esc(r.extId)}, ${esc(r.subtype)})`

function insertRows(label, rows) {
  if (!rows.length) return `-- ${label}: no rows\n`
  return (
    `-- ${label}: ${rows.length} rows\n` +
    'INSERT INTO public.green_spaces\n' +
    '  (name, type, address, district, neighborhood, location, source, external_id, subtype)\nVALUES\n' +
    rows.map(row).join(',\n') + ';\n'
  )
}

async function main() {
  // OBJECTID is unique per layer; ID_EXCEL / Codi have nulls and duplicates in the
  // source, so we key on OBJECTID and guard against any residual duplicates.
  const seen = new Set()
  const keep = (extId) => (seen.has(extId) ? false : (seen.add(extId), true))

  // --- Horts (layer 1, points) ---
  const hortFeats = await fetchPaged(1, { outFields: 'NOM,ADRECA,Districte,Barri,ESTAT,ORIGEN,TIPUS,OBJECTID', geojson: true })
  const horts = []
  let schoolsSkipped = 0
  for (const f of hortFeats) {
    const p = f.properties || {}
    if (p.ESTAT === 'Baixa') continue     // removed gardens
    if (isSchoolGarden(p)) { schoolsSkipped++; continue } // school gardens excluded
    const [lng, lat] = f.geometry?.coordinates || []
    if (!finite(lng) || !finite(lat)) continue
    const extId = `hort-${p.OBJECTID}`
    if (!keep(extId)) continue
    horts.push({
      name: p.NOM || 'Hort urbà',
      type: 'hort',
      address: p.ADRECA,
      district: p.Districte,
      neighborhood: p.Barri,
      subtype: hortSubtype(p.ORIGEN),
      lng, lat, extId,
    })
  }

  // --- Parcs (layer 4, polygons → centroid) ---
  const parkFeats = await fetchPaged(4, { outFields: 'Nom,Codi,OBJECTID', geojson: false })
  const parks = []
  for (const f of parkFeats) {
    const a = f.attributes || {}
    const lng = f.centroid?.x, lat = f.centroid?.y
    if (!finite(lng) || !finite(lat)) continue
    const extId = `parc-${a.OBJECTID}`
    if (!keep(extId)) continue
    parks.push({
      name: a.Nom || 'Parc',
      type: 'park',
      address: null, district: null, neighborhood: null,
      subtype: null,
      lng, lat, extId,
    })
  }

  const header =
    `-- import-real-data.sql — GENERATED by scripts/import-bcn-data.mjs on ${new Date().toISOString()}\n` +
    `-- Source: Ajuntament de Barcelona ArcGIS (Observatori d'Agricultura Urbana).\n` +
    `-- Full refresh of the 'ajuntament' set (school gardens excluded). Safe to re-run.\n` +
    `-- Requires patch-005.sql (source/external_id) and patch-006.sql (subtype) first.\n\n`

  const sql =
    header +
    'BEGIN;\n' +
    "DELETE FROM public.green_spaces WHERE source = 'ajuntament';\n\n" +
    insertRows('Horts urbans', horts) + '\n' +
    insertRows('Parcs i jardins', parks) + '\n' +
    'COMMIT;\n'
  const outPath = join(dirname(fileURLToPath(import.meta.url)), '..', 'supabase', 'import-real-data.sql')
  writeFileSync(outPath, sql)
  console.log(`Horts: ${horts.length} (schools skipped: ${schoolsSkipped}) | Parcs: ${parks.length} | Total: ${horts.length + parks.length}`)
  console.log(`Written: ${outPath}`)
}

main().catch((e) => { console.error(e); process.exit(1) })
