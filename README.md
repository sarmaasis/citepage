# Citepage

Help center + `/ask` that only answers with a citation.

If the page does not say it, Citepage refuses.

Repo: [github.com/sarmaasis/citepage](https://github.com/sarmaasis/citepage)

## Product

See [docs/PRODUCT.md](docs/PRODUCT.md) and the site at `/docs.html`.

## Run

```bash
npm install
npm run dev
```

Open the Wrangler URL, then `/app.html`.

Try:

- “Does Pro include SSO?”
- “What is the meaning of life?” (must refuse)

Paste your own page in the rail.

## Stack

- Cloudflare Worker + static assets
- D1 schema ready (`schema.sql`) — v0.1 uses in-memory pages so `npm run dev` works before you create D1
- Dodo for billing (not wired)
- Optional AI later, only after retrieval

## Domain

Register **citepage.xyz** or **citepage.site** (~$1). This repo does not buy the domain.

## Design

Paper + ink. Not a generic AI gradient. See `DESIGN.md`.
