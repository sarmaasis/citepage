# Architecture

```
Browser → Worker (src/worker.js)
  GET static from public/
  GET /api/pages
  POST /api/ingest
  POST /api/ask
```

Retrieval v0.1 splits sentences and scores token overlap. Score 0 refuses.

```bash
npm install
npm run dev
```
