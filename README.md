# Barcelona Verda

A citizen platform designed to connect elderly residents to Barcelona's network of urban green spaces and the municipal programmes governing them.

Built as part of the EuroTeQ student challenge *Sustainable Smart Cities* (2026), the project addresses the participation gap in urban-greening initiatives: existing programmes often fail to reach the most vulnerable groups, and the city's current digital channels are not designed for active inclusion. Barcelona has more than 250,000 trees and several well-established participation programmes, yet no unified tool connects them to residents in a clear, accessible way.

Barcelona Verda combines a digital platform with a non-digital mediator network to meet residents where they already are, online and offline. The platform features:

- An interactive map showing parks, urban gardens, tree pits, and biodiversity reserves across the city
- Colour-coded markers for participation opportunities and spaces flagging a need for help
- A neighbourhood filter and list view for accessible browsing
- A gateway to four official municipal programmes (Cuida l'escocell, Xarxa d'Horts Municipals, Cessió d'Espais Municipals, Cogestió d'Espais Públics)
- A network of local mediators and volunteers supporting residents less comfortable with digital tools
- Full multilingual support: Catalan, Spanish, and English

**Stack:** Nuxt 4 · Vue 3 · Supabase (PostgreSQL + PostGIS) · MapLibre GL JS · OpenStreetMap · Vercel

**Team:** Jacob Stark · Marta Alfonso · Mehdike Rüveyda Buga · Micaelle Nogueira de Carvalho

---

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
