# ClubPack Sponsor Concierge

AI-powered concierge that helps brands discover and sponsor college clubs. Built with Next.js 16, AI SDK v6, and Vercel AI Gateway.

## What it does

1. **Landing page** — CMS-driven (Sanity) marketing page with email lead capture
2. **AI chat** — Streaming concierge that searches clubs, fetches pricing, and escalates to sales
3. **Eval harness** — 10 test cases with an LLM judge to catch prompt regressions

## Architecture

```
/                  Cached Server Component (Sanity CMS + fallback)
/chat              Client Component (useChat + AI Elements)
/api/chat          Streaming route handler (streamText + 3 tools)
/studio            Embedded Sanity Studio
```

**Agent flow:** User message → Claude Haiku 4.5 (via AI Gateway) → tool call (searchClubs / getPricing / escalateToHuman) → streamed response

**Model strategy:** Haiku 4.5 primary, Gemini 2.5 Flash Lite and GPT-5.4 Nano as gateway fallbacks. All chosen for low cost and fast tool calling.

## Key decisions

- **Cache Components** (`'use cache'` + `cacheLife('hours')`) on the landing page so it's served from cache, not SSR'd per request
- **LeadSuccess as a client component** reads `?lead=success` via `useSearchParams` to keep the landing page cacheable
- **Tool-every-message prompt rule** forces the model to ground all responses in real database data
- **Search-before-pricing** pattern prevents the model from hallucinating club IDs
- **Escalation as a catch-all** for off-topic, hostile, or high-budget requests (safety guardrail)
- **streamText over Agent class** because the tool loop is simple with no per-step hooks needed
- **Server Actions** for lead capture give progressive enhancement (forms work without JS)

## Tech stack

- **Framework:** Next.js 16.2.1 (App Router, Turbopack, Cache Components)
- **AI:** AI SDK v6, Vercel AI Gateway, AI Elements
- **Database:** Neon Postgres (clubs, pricing, leads)
- **CMS:** Sanity (landing page content)
- **UI:** shadcn/ui, Tailwind v4, Geist font

## Setup

```bash
pnpm install
```

Create a `.env.local` with:

```
DATABASE_URL=              # Neon Postgres connection string
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=
```

Seed the database:

```
Run db/schema.sql in the Neon SQL editor
```

Link to Vercel for AI Gateway credentials:

```bash
vercel link
vercel env pull
```

Run locally:

```bash
pnpm dev
```

## Eval

```bash
pnpm eval
```

Runs 10 test cases against the real agent, then uses gpt-5-mini as an LLM judge with an ordered scoring rubric. Checks tool routing correctness, hallucination, escalation behavior, and small-budget handling.

## Project structure

```
app/
  page.tsx              Landing page (cached Server Component)
  chat/page.tsx         Chat UI (Client Component)
  api/chat/route.ts     Streaming chat endpoint
  actions/saveLead.ts   Server Action for email capture
  studio/               Embedded Sanity Studio

lib/
  agent.ts              Agent config (model, tools, gateway fallback)
  prompts/concierge.ts  System prompt
  tools/                searchClubs, getPricing, escalateToHuman
  db.ts                 Neon Postgres client
  sanity.ts             Sanity CMS client

eval/
  dataset.ts            10 test cases
  run-eval.ts           Eval runner with LLM judge

db/
  schema.sql            Database schema and seed data
```
