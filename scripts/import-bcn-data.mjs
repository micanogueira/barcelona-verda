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

import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const BASE = 'https://services2.arcgis.com/KlzkV0ROO8BmwwDe/arcgis/rest/services/Servidor_horts2026_WFL1/FeatureServer'
const SOURCE = 'ajuntament'
const PAGE = 1000

const esc = (v) => (v == null || String(v).trim() === '') ? 'NULL' : `'${String(v).trim().replace(/'/g, "''")}'`
const finite = (n) => typeof n === 'number' && Number.isFinite(n)

// Official neighbourhood boundaries (73 barris, EPSG:25831) for point-in-polygon.
// The ArcGIS "Parcs" layer has no barri/districte field, so we derive them from
// each garden's projected centroid. Slim file extracted from Open Data BCN's
// "Administrative units" dataset (Unitats_Administratives_BCN, barri polygons).
const BARRIS = JSON.parse(readFileSync(new URL('./data/barris-bcn.geojson', import.meta.url), 'utf8'))
for (const f of BARRIS.features) {
  let minx = Infinity, miny = Infinity, maxx = -Infinity, maxy = -Infinity
  const scan = (c) => { if (typeof c[0] === 'number') { minx = Math.min(minx, c[0]); maxx = Math.max(maxx, c[0]); miny = Math.min(miny, c[1]); maxy = Math.max(maxy, c[1]) } else c.forEach(scan) }
  scan(f.geometry.coordinates)
  f.bbox = [minx, miny, maxx, maxy]
}
const ringHas = (x, y, ring) => {
  let inside = false
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j]
    if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) inside = !inside
  }
  return inside
}
const polyHas = (x, y, rings) => { let inside = false; for (const r of rings) if (ringHas(x, y, r)) inside = !inside; return inside }
// Returns { barri, districte } for a point in EPSG:25831, or null.
const neighbourhoodAt = (x, y) => {
  for (const f of BARRIS.features) {
    const b = f.bbox
    if (x < b[0] || x > b[2] || y < b[1] || y > b[3]) continue
    const g = f.geometry
    const hit = g.type === 'MultiPolygon' ? g.coordinates.some(p => polyHas(x, y, p)) : polyHas(x, y, g.coordinates)
    if (hit) return f.properties
  }
  return null
}

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

async function fetchPaged(layer, { outFields, geojson, sr = 4326 }) {
  const out = []
  for (let offset = 0; ; offset += PAGE) {
    const common = `where=1%3D1&outFields=${encodeURIComponent(outFields)}&outSR=${sr}&resultOffset=${offset}&resultRecordCount=${PAGE}`
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

  // --- Parcs i jardins (layer 4, polygons → centroid) ---
  // The layer is called "Parcs" but ~half the entries are named "Jardins de …";
  // type them by name so gardens get the garden label/icon instead of "Parc".
  const parkFeats = await fetchPaged(4, { outFields: 'Nom,Codi,OBJECTID', geojson: false })
  // Same centroids in EPSG:25831 to look up the neighbourhood by point-in-polygon.
  const centroid25831 = {}
  for (const f of await fetchPaged(4, { outFields: 'OBJECTID', geojson: false, sr: 25831 })) {
    if (f.centroid) centroid25831[f.attributes.OBJECTID] = f.centroid
  }
  const parks = []
  let withBarri = 0
  for (const f of parkFeats) {
    const a = f.attributes || {}
    const lng = f.centroid?.x, lat = f.centroid?.y
    if (!finite(lng) || !finite(lat)) continue
    const extId = `parc-${a.OBJECTID}`
    if (!keep(extId)) continue
    const name = a.Nom || 'Parc'
    const c = centroid25831[a.OBJECTID]
    const nb = c ? neighbourhoodAt(c.x, c.y) : null
    if (nb) withBarri++
    parks.push({
      name,
      type: /jard/i.test(name) ? 'garden' : 'park',
      address: null,
      district: nb?.districte ?? null,
      neighborhood: nb?.barri ?? null,
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
  console.log(`Horts: ${horts.length} (schools skipped: ${schoolsSkipped}) | Parcs i jardins: ${parks.length} (with neighbourhood: ${withBarri}) | Total: ${horts.length + parks.length}`)
  console.log(`Written: ${outPath}`)
}

main().catch((e) => { console.error(e); process.exit(1) })
