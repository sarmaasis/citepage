# Citepage — Product Requirements Document

**Status:** v1.0  
**Date:** 20 September 2026  
**Owner:** Ashish Sharma  
**Repo:** https://github.com/sarmaasis/citepage  
**Market:** United States / English-speaking B2B SaaS (not India-first)

---

## 1. One-line

Host the help center. Answer only from the page. Cite the paragraph. Refuse when the page is silent.

## 2. Thesis

Documentation Q&A fails when the model is allowed to be helpful. Helpful answers invent plans, mix old pages with new ones, and train customers to distrust the box.

Citepage treats documentation as **source of truth**, not training data. Retrieval selects a passage. The answer may only rest on that passage. Empty retrieval is a product feature (`refused`), not an error to paper over.

This is a **docs host + cited ask**, not a generic chatbot and not a Mintlify competitor at $250.

## 3. Problem

Solo and small SaaS teams already have docs (Notion, Markdown, a neglected GitBook). They still answer the same ten questions in email:

- Does Pro include SSO?
- Where is the API key?
- What happens after cancel?

Widgets trained on “the website” wander. Platforms like Mintlify / GitBook are more product than they will pay for. Intercom Fin is a support desk, not a help center.

## 4. Job to be done

When a customer (or the founder) has a factual product question, they get an answer **tied to a live paragraph**, or an honest “not on these pages.”

Success for the buyer: fewer repeat email threads about facts that are already written down.

## 5. Buyer

**Primary (self-serve)**  
US/EU B2B SaaS, 1–15 people. Founder or the person who owns `/docs`. English docs already exist as Markdown, Notion export, or a public URL.

**Secondary**  
Tiny agencies that stand up help centers for two or three clients.

**Not a buyer**  
Teams already on Mintlify / ReadMe / Intercom Fin. API-reference platforms as the core product. HIPAA / enterprise procurement in year one. India-only low-ARPU tools.

## 6. Positioning

| We say | We do not say |
|---|---|
| Your docs, on your domain, answers only from the page | AI helpdesk |
| If it isn’t on the page, we don’t say it | Trained on your whole internet |
| $29 / $49 | Replace Zendesk |

**Category:** documentation host with grounded /ask  
**Price band:** Chatbase / SiteGPT floor ($29–$49), not Mintlify ($250+)

## 7. What Citepage is

1. A hosted help center (pages in, site out).
2. An `/ask` box that returns `answer + citations[]` or `refused`.
3. An ingest path: paste Markdown now; public URL crawl next.
4. Publish to `*.citepage.xyz` then `docs.customer.com`.

## 8. What Citepage is not

- Generic RAG chatbot
- Ticket inbox / live chat
- Autopilot poster on Reddit / X
- Full entitlements or billing reconciliation
- 20 source adapters
- Automatic merge of invented doc patches

## 9. Core loop

```
paste page or URL
    → split into passages
    → customer (or founder) asks
    → retrieve passages
    → if none: refuse
    → if hit: answer + quote + page title
    → founder sees which questions missed (coverage)
```

The product must remove a support reply, not create another dashboard.

## 10. User journeys

### 10.1 Preview (no card)

1. Land on marketing site.
2. Open desk.
3. See seeded pages (Pricing, SSO, API, How /ask works).
4. Ask a real question.
5. See citation or refuse.
6. Paste one of their own pages.
7. Ask again.

Activation: first **cited** answer on **their** text.

### 10.2 Paid publish (P1)

1. Dodo checkout $29 / $49.
2. Subdomain `slug.citepage.xyz` or CNAME `docs.theirapp.com`.
3. Hosted `/ask` on that site.
4. Monthly ask cap by plan.

### 10.3 Coverage (P1)

Founder opens “Questions we refused.” Each refuse is a missing paragraph, not a model failure.

## 11. Functional requirements

### P0 — in repo now + harden

| ID | Requirement | Acceptance |
|---|---|---|
| P0-1 | List indexed pages | `GET /api/pages` returns title + slug |
| P0-2 | Read a page | `GET /api/pages/:slug` returns body |
| P0-3 | Ingest text | `POST /api/ingest` {title, body} ≥ 20 chars → passage count |
| P0-4 | Ask with citations | `POST /api/ask` {q} → answer + citations or refused |
| P0-5 | Refuse on miss | No token overlap → `refused: true`, empty citations |
| P0-6 | Desk UI | Paper/ink desk: page list, paste, ask, citation sheet |
| P0-7 | Marketing + product docs | `/`, `/docs.html`, `docs/PRODUCT.md` |
| P0-8 | No invention | v0.1 answer text is a retrieved passage |

### P1 — paid host

| ID | Requirement |
|---|---|
| P1-1 | Persist pages in D1 |
| P1-2 | Site per workspace |
| P1-3 | Dodo Starter $29 / Pro $49 |
| P1-4 | Subdomain publish `slug.citepage.xyz` |
| P1-5 | Ask cap → 429 + upgrade |
| P1-6 | Public URL ingest |
| P1-7 | Coverage log of refused questions |

### P2 — Pro

Custom hostname, remove mark, cited paraphrase only from retrieved passages, embed snippet, reindex.

### P3 — later

Git sync, Vectorize, team seats, Slack on refuse spikes.

## 12. Non-functional

- Stack: Cloudflare Workers, D1, R2, optional Vectorize, Workers AI or one AI gateway.
- Billing: Dodo only.
- External APIs: AI + Dodo. No Reddit, Shopify, Meta.
- Latency: lexical /ask < 200ms p95; paraphrased < 2s p95.
- Privacy: docs not used to train a public model. Delete workspace deletes pages + asks.

## 13. Data model

```
workspaces  id, slug, plan (preview|starter|pro), dodo_customer_id
pages       id, workspace_id, title, slug, body, source, updated_at
passages    id, workspace_id, page_id, title, body
asks        id, workspace_id, q, refused, answer, created_at
```

v0.1 may use Worker memory for `wrangler dev`. Production uses D1 (`schema.sql`).

## 14. API

**GET `/api/pages`** `{ pages: [{ id, title, slug }] }`  
**GET `/api/pages/:slug`** `{ page }`  
**POST `/api/ingest`** `{ title, body }` → `{ ok, id, slug, passages }`  
**POST `/api/ask`** `{ q }` → `{ refused, answer, citations: [{ title, quote, page_id }] }`

No citation array on a successful answer is a **bug**.

## 15. UX / design

See `DESIGN.md`. Paper `#F4EFE6`, ink `#1A1612`, oxide `#9C2B18`. No purple gradient, orbs, or fake logo clouds. One primary CTA per view.

## 16. Pricing

| Plan | Price | Limits |
|---|---|---|
| Preview | $0 | Seed + paste, mark on |
| Starter | $29 / mo | 1 site, `*.citepage.xyz`, 2k asks / mo |
| Pro | $49 / mo | Custom domain, no mark, 10k asks / mo |
| Annual | 2 months free | Same caps |

Do not launch at $9. Do not launch at $199.

## 17. Metrics (90 days)

| Metric | Target |
|---|---|
| Preview → first cited ask on their text | ≥ 40% |
| Paid conversion of activated previews | ≥ 8% |
| 30-day logo churn | ≤ 12% |
| Refuse rate on indexed sites | 10–35% |
| Correct-page rate (non-refused) | ≥ 70% |
| Gross margin after AI + CF | ≥ 70% at $49 |

**$4k / mo profit:** ~120 × $49 or ~160 × $29 at ~70% gross.

## 18. Go to market

Demo is the funnel. Hunt `site:gitbook.io` and Notion dumps. r/SaaS, X indie, Indie Hackers, 30% affiliate. 20 public-doc sites/day outbound. No Google ads at this LTV.

## 19. Competitive line

| Product | Job | Citepage difference |
|---|---|---|
| Chatbase, DocsBot, SiteGPT | Widget | We host the pages so the corpus is the site |
| Mintlify, GitBook, ReadMe | Dev docs platform | Cheaper, narrower, citation-first |
| Intercom Fin / Zendesk | Tickets | Out of category |

## 20. Risks

Looks like Chatbase → refuse UI on homepage. Lexical retrieval → ship; paraphrase only on hits. URL crawl ToS → paste-first. Data loss → D1 before paid.

## 21. Open decisions

Ask caps (start 2k / 10k). Preview data retention. Whether Pro embed may run on a site we do not host.

## 22. Launch checklist

- [ ] D1 persist ingest
- [ ] Dodo $29 / $49 + webhook
- [ ] Register citepage.xyz or citepage.site
- [ ] 10 founders paste real docs; ≥ 7 correct-page citations
- [ ] Refuse demo recorded (SSO on Pro)
- [ ] Privacy sentence on footer

## 23. Final product rule

**The page is the source of truth. /ask is checked against the page. The page is never generated from the question.**
