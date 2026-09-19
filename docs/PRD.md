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

Documentation Q&A fails when the model is allowed to be helpful. Helpful answers invent plans. Citepage treats documentation as source of truth. Empty retrieval is a feature (`refused`).

## 3. Problem

Small SaaS teams already have docs and still answer the same factual questions in email. Widgets wander. Mintlify is more product than they will pay for.

## 4. Job to be done

When someone has a factual product question, they get an answer tied to a live paragraph, or an honest “not on these pages.”

## 5. Buyer

Primary: US/EU B2B SaaS, 1–15 people, founder or docs owner.  
Not: Mintlify/Fin customers, HIPAA, India-only low ARPU.

## 6. Positioning

Category: documentation host with grounded /ask.  
Price band: $29–$49, not $250.

## 7. What it is

Hosted help center, /ask with citations or refuse, ingest paste (URL later), publish to subdomain then custom domain.

## 8. What it is not

Generic RAG, ticket inbox, social autopilot, 20 adapters, invented doc patches.

## 9. Core loop

Paste → passages → ask → retrieve → refuse or answer+quote → coverage on misses.

## 10. Journeys

Preview: desk → seed pages → ask → paste their page → cited answer.  
Paid (P1): Dodo → slug.citepage.xyz or CNAME.  
Coverage: refused questions list.

## 11. Requirements

### P0
- P0-1 GET /api/pages
- P0-2 GET /api/pages/:slug
- P0-3 POST /api/ingest
- P0-4 POST /api/ask with citations
- P0-5 refuse on miss
- P0-6 desk UI
- P0-7 marketing + docs
- P0-8 no invention (answer = passage in v0.1)

### P1
- D1 persist, workspace, Dodo $29/$49, subdomain, ask cap, URL ingest, coverage log

### P2
- Custom hostname, remove mark, cited paraphrase only, embed snippet, reindex

### P3
- Git sync, Vectorize, seats, Slack on refuse spikes

## 12. Non-functional

Cloudflare Workers + D1 + R2. Dodo only. AI optional after retrieval. Delete workspace deletes data.

## 13. Data model

workspaces, pages, passages, asks.

## 14. API

GET /api/pages  
GET /api/pages/:slug  
POST /api/ingest {title, body}  
POST /api/ask {q} → {refused, answer, citations[]}

No citations on a success is a bug.

## 15. Design

Paper #F4EFE6, ink #1A1612, oxide #9C2B18. See DESIGN.md. No generic AI SaaS look.

## 16. Pricing

Preview $0 · Starter $29 / 2k asks · Pro $49 / 10k asks + domain. Annual = 2 months free.

## 17. Metrics (90 days)

Preview → cited ask on their text ≥ 40%. Paid of activated ≥ 8%. 30-day churn ≤ 12%. Usable citation ≥ 70%. Gross margin ≥ 70%.

$4k profit ≈ 120 × $49 at 70% gross.

## 18. GTM

Demo is the funnel. Hunt public GitBook/Notion dumps. r/SaaS, X, IH, affiliates. No ads at this LTV.

## 19. Competitors

Chatbase/DocsBot/SiteGPT = widget. Mintlify/GitBook = platform. We host + refuse + cite at $29–$49.

## 20. Risks

Looks like Chatbase → homepage refuse proof. Lexical retrieval → ship; paraphrase only on hits. Data loss → D1 before paid.

## 21. Launch checklist

- D1 persist
- Dodo webhook
- Domain citepage.xyz or .site
- 10 founders, ≥7 correct-page citations
- Refuse demo recorded

## 22. Final rule

The page is the source of truth. /ask is checked against the page. The page is never generated from the question.
