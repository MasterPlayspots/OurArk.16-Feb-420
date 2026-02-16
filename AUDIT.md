# OurArk Full Project Audit
> Generated: 16. Februar 2026 | Branch: `claude/product-launch-checklist-dZRqn`

---

## Executive Summary

OurArk is a **multi-agent AI workspace** built with Next.js 16, React 19, and TypeScript.
The core chat and agent orchestration **work end-to-end**. The UI is polished and complete.
9 of 13 views are **demo-only stubs** with no backend. The D1 database layer was just added
but is not yet wired into the main chat/agent flow on the server side. There are **zero tests**.

| Metric               | Value              |
|-----------------------|--------------------|
| Total Files           | ~45 source files   |
| Working Features      | 4 / 13 views       |
| Demo/Stub Features    | 9 / 13 views       |
| Broken Features       | 0                  |
| Test Coverage         | 0% (no tests exist)|
| TypeScript Errors     | 0                  |
| ESLint Errors         | 0                  |
| Build Status          | PASSING            |

---

## 1. What Is WORKING (Production-Ready)

### 1.1 Chat System (chat-view.tsx + /api/chat)
- **Status:** FULLY FUNCTIONAL
- Multi-model chat via OpenRouter (GPT-4o, Claude 3.5 Sonnet, Mistral Large, GPT-4o-mini, Claude Sonnet 4)
- Smart model routing based on task complexity (saves 40-70% on API costs)
- Cost + token tracking per message
- Auto-creates conversations on first message
- Fire-and-forget persistence to D1 (when configured)
- Graceful fallback to localStorage when D1 is not configured

### 1.2 Agent System (metatron-view.tsx + /api/agents/execute)
- **Status:** FULLY FUNCTIONAL
- 6 built-in agents with specialized system prompts:
  - **Metatron** (Master Agent - coordinates others)
  - **Aria** (Content & Marketing)
  - **Nova** (Code & Development)
  - **Atlas** (Data & Analysis)
  - **Echo** (Support & Communication)
  - **Sage** (Strategy & Planning)
- Task classification routes input to best agent via keyword matching
- Agent execution with per-model cost calculation
- Status indicators (online/busy/offline)

### 1.3 Agent Builder (agent-builder-view.tsx)
- **Status:** FULLY FUNCTIONAL
- Two-step flow: pick template -> customize
- 4 templates (Blank, Translator, Social Media Manager, Code Reviewer)
- Editable: name, description, system prompt, capabilities, preferred model
- Saves to Zustand store (client-side only, not yet persisted to D1)

### 1.4 Dashboard (dashboard-view.tsx)
- **Status:** WORKING (demo data)
- 4 KPI cards (Conversations, Tokens, Costs, Bots)
- Quick navigation grid to all 12 views
- Trend indicators
- Note: All numbers are hardcoded demo values

### 1.5 Infrastructure

| Component | Status | Notes |
|-----------|--------|-------|
| **Smart LLM Router** (lib/llm-router.ts) | WORKING | Analyzes complexity, picks cheapest capable model |
| **Zustand Store** (lib/store.ts) | WORKING | Persists conversations, agents, costs to localStorage |
| **Rate Limiting** (lib/rate-limit.ts + middleware.ts) | WORKING | 20 req/min chat, 60 req/min other. In-memory only |
| **Security Headers** (middleware.ts + next.config.mjs) | WORKING | CSP, HSTS, X-Frame-Options, CORS whitelist |
| **D1 Database Client** (lib/db.ts) | WORKING | HTTP REST API client, CRUD helpers, migration endpoint |
| **Error Boundary** (error-boundary.tsx) | WORKING | Catches component crashes, shows recovery UI |
| **Tab System** (tab-bar.tsx) | WORKING | Browser-like tabs with badges |
| **3-Column Layout** (page.tsx) | WORKING | Left sidebar + content + right sidebar, all collapsible |

---

## 2. What Is DEMO/STUB (UI Exists, No Backend)

These 9 views render a polished UI with **hardcoded demo data**. No backend, no persistence, no real functionality behind the buttons.

| View | File | What It Shows | What's Missing |
|------|------|---------------|----------------|
| **Automations** | automations-view.tsx | 5 demo automations, stats (847 runs) | No execution engine, no triggers, no cron |
| **Connectors** | connectors-view.tsx | 5 connectors (Telegram, OpenRouter, etc.) | No OAuth, no API integration, no health checks |
| **Documents** | documents-view.tsx | 3 collections, 5 documents | No RAG pipeline, no file upload, no indexing |
| **Budgets** | budgets-view.tsx | Budget bar (EUR38.40/EUR50), model breakdown | No real cost aggregation, no alerts, no limits |
| **Prompts** | prompts-view.tsx | 6 prompt templates with ratings | No CRUD, no template variables, "Use" button does nothing |
| **Event Log** | eventlog-view.tsx | 8 demo events with severity filter | No real logging backend, no event collection |
| **Telegram** | telegram-view.tsx | Bot config (@ourark_ai_bot), 11 commands | No actual bot, no webhook, no Telegram API |
| **Workspace** | workspace-view.tsx | 5 team members, 3 API keys | No team management, no invitations, no auth |
| **Settings** | settings-view.tsx | 4 setting sections (General, Notifications, etc.) | Read-only display, no forms, no persistence |

---

## 3. What Is BROKEN or Has Issues

### 3.1 Critical Issues

| # | Issue | Location | Impact |
|---|-------|----------|--------|
| 1 | **No server-side persistence in /api/chat** | app/api/chat/route.ts | Messages sent via main chat are NOT saved to D1 on the server. Only the client fires a separate request to /api/conversations. If client-side persist fails silently, data is lost. |
| 2 | **No server-side persistence in /api/agents/execute** | app/api/agents/execute/route.ts | Agent task results are never saved to database. |
| 3 | **Store and DB are disconnected** | lib/store.ts vs lib/db.ts | Zustand store initializes from hardcoded demo data, never reads from D1. Page reload = back to demo state. |
| 4 | **usage_stats table never written to** | lib/db/schema.sql | Table exists in schema but no code ever INSERTs into it. Cost tracking only lives in Zustand. |
| 5 | **No tests at all** | vitest.config.ts references test/setup.ts which doesn't exist | README claims 82% coverage with 62 tests. Reality: 0 tests, 0% coverage. |

### 3.2 Major Issues

| # | Issue | Location | Impact |
|---|-------|----------|--------|
| 6 | **No streaming support** | /api/chat, /api/agents/execute | Always `stream: false`. Long responses waste time, poor UX. |
| 7 | **Duplicate API code** | /api/chat vs /api/agents/execute | 95% identical logic. Should share a common LLM call function. |
| 8 | **Rate limiter memory leak** | lib/rate-limit.ts | Expired entries in the Map are never cleaned up. Grows forever. |
| 9 | **Upstash Redis configured but unused** | .env.example + lib/rate-limit.ts | Env vars exist for UPSTASH_REDIS_REST_URL/TOKEN but code never imports @upstash/redis for rate limiting. Always uses in-memory Map. |
| 10 | **Agent executor calls wrong endpoint** | lib/agents/executor.ts | `executeAgentTask()` calls `/api/chat` instead of `/api/agents/execute`. Agent system prompts are ignored. |
| 11 | **Agents not persisted to D1** | lib/agents/registry.ts | Built-in agents created fresh on every page load. Custom agents lost on reload. |
| 12 | **LLM router is German-only** | lib/llm-router.ts | Complexity keywords only match German words. English input always classified as "simple". |

### 3.3 Quality Issues

| # | Issue | Location |
|---|-------|----------|
| 13 | **Hardcoded demo data pollutes production** | lib/store.ts - demoConversations, demoTeamMembers |
| 14 | **No request idempotency** | /api/conversations - double submit = duplicate records |
| 15 | **No structured logging** | All files use console.error only |
| 16 | **listAgents() returns capabilities as JSON string** | lib/db.ts - needs JSON.parse on read |
| 17 | **Agent.ismaster is optional but always checked** | lib/types.ts |
| 18 | **No CLAUDE.md** | Root - would help with AI-assisted development |

---

## 4. File-by-File Status Matrix

### Configuration Files
| File | Status | Notes |
|------|--------|-------|
| package.json | OK | 71 dependencies, all scripts work |
| tsconfig.json | OK | Strict mode enabled |
| next.config.mjs | OK | Security headers, bundle analyzer |
| tailwind.config.ts | OK | Dark mode, custom design tokens |
| postcss.config.mjs | OK | Standard Tailwind setup |
| eslint.config.mjs | OK | Next.js defaults |
| vitest.config.ts | PARTIAL | Config OK, but test/setup.ts missing, 0 tests |
| components.json | OK | shadcn/ui config |
| middleware.ts | OK | CORS + rate limiting + security headers |
| .env.example | OK | All required vars documented |

### Library Files (lib/)
| File | Status | Notes |
|------|--------|-------|
| lib/types.ts | OK | 23 types/interfaces, comprehensive |
| lib/utils.ts | OK | cn() utility |
| lib/store.ts | PARTIAL | Works but demo data, no DB sync |
| lib/llm-router.ts | PARTIAL | Works but German keywords only |
| lib/rate-limit.ts | PARTIAL | Works but memory leak, no Upstash |
| lib/db.ts | OK | D1 HTTP client, full CRUD helpers |
| lib/db/schema.sql | OK | 4 tables, idempotent |
| lib/agents/registry.ts | OK | 6 agents, 4 templates |
| lib/agents/executor.ts | PARTIAL | Calls wrong API endpoint |

### API Routes (app/api/)
| File | Status | Notes |
|------|--------|-------|
| /api/chat/route.ts | PARTIAL | Works but no server-side DB persist |
| /api/agents/route.ts | PARTIAL | GET metadata only, POST doesn't persist |
| /api/agents/execute/route.ts | PARTIAL | Works but no DB persist, duplicate of chat |
| /api/conversations/route.ts | OK | Full CRUD with D1, graceful fallback |
| /api/db/migrate/route.ts | OK | Idempotent migration runner |

### Components
| File | Status | Notes |
|------|--------|-------|
| left-sidebar.tsx | OK | Navigation, search, collapsible |
| right-sidebar.tsx | OK | Team, notifications, agents |
| content-area.tsx | OK | View router for all 13 views |
| tab-bar.tsx | OK | Browser-like tab management |
| agent-panel.tsx | OK | Agent execution sidebar |
| error-boundary.tsx | OK | React error boundary |

### Views (components/views/)
| File | Status | LOC | Notes |
|------|--------|-----|-------|
| chat-view.tsx | WORKING | 402 | Full chat with persistence |
| metatron-view.tsx | WORKING | 397 | Master agent orchestration |
| agent-builder-view.tsx | WORKING | 291 | Custom agent creation |
| dashboard-view.tsx | WORKING | 186 | KPIs + quick nav (demo data) |
| automations-view.tsx | STUB | 123 | Demo UI only |
| connectors-view.tsx | STUB | 109 | Demo UI only |
| documents-view.tsx | STUB | 105 | Demo UI only |
| budgets-view.tsx | STUB | 106 | Demo UI only |
| prompts-view.tsx | STUB | 85 | Demo UI only |
| eventlog-view.tsx | STUB | 128 | Demo UI only |
| telegram-view.tsx | STUB | 129 | Config display only |
| workspace-view.tsx | STUB | 151 | Demo UI only |
| settings-view.tsx | STUB | 85 | Read-only display |

### Documentation
| File | Status | Notes |
|------|--------|-------|
| README.md | OUTDATED | Claims 82% test coverage (actually 0%) |
| ROADMAP.md | OUTDATED | References files that don't exist (console-dashboard, analyse-page, skills-page) |
| STRUCTURE.md | OUTDATED | Describes old architecture (chat-header, browser-tab, skills-page) |
| SECURITY.md | MOSTLY OK | AES-256-GCM encryption not implemented yet |
| DESIGN_SYSTEM.md | OK | Accurate color/typography/animation specs |

---

## 5. Dependency Audit

### External Services Required
| Service | Required? | Purpose | Status |
|---------|-----------|---------|--------|
| **OpenRouter** | YES | LLM API calls | Working when API key set |
| **Cloudflare D1** | Optional | Conversation persistence | Client built, needs credentials |
| **Upstash Redis** | Optional | Production rate limiting | Packages installed, NOT wired up |
| **Google Fonts** | YES | Inter + JetBrains Mono | Working on Vercel |
| **Vercel** | YES | Hosting | Deployment working |

### NPM Dependencies (71 total)
- **28 Radix UI packages** - UI primitives (most unused, installed by shadcn)
- **Core:** next, react, react-dom, typescript, zustand, zod
- **Used actively:** lucide-react, clsx, tailwind-merge, sonner
- **Installed but potentially unused:** recharts, cmdk, embla-carousel, react-resizable-panels, react-window, vaul, input-otp, react-day-picker, date-fns, next-themes, class-variance-authority, @hookform/resolvers, react-hook-form
- **Dev:** vitest (configured, no tests), happy-dom, @testing-library/react

---

## 6. Architecture Diagram

```
Browser (Client)
  |
  ├── Zustand Store (localStorage)
  |     ├── conversations[]    (demo data + new)
  |     ├── messages[]         (NOT persisted across reload)
  |     ├── agents[]           (built-in + custom, client only)
  |     ├── totalCost          (accumulated)
  |     └── UI state           (view, tabs, sidebars)
  |
  ├── chat-view.tsx
  |     ├── POST /api/chat          → OpenRouter → response
  |     └── POST /api/conversations  → D1 (fire-and-forget)
  |
  ├── metatron-view.tsx
  |     ├── classifyTaskForAgent()   → keyword matching
  |     └── POST /api/agents/execute → OpenRouter → response
  |
  └── agent-builder-view.tsx
        └── addAgent() → Zustand only (no DB)

Server (Next.js API Routes)
  |
  ├── /api/chat              → validate → route model → OpenRouter → return
  ├── /api/agents/execute    → validate → route model → OpenRouter → return
  ├── /api/conversations     → validate → D1 CRUD
  ├── /api/agents            → validate → return metadata
  └── /api/db/migrate        → execute DDL on D1

External
  |
  ├── OpenRouter API (api.openrouter.ai)
  └── Cloudflare D1 (api.cloudflare.com)
```

**Key Gap:** The server API routes (`/api/chat`, `/api/agents/execute`) do NOT write to D1.
Only the client-side fire-and-forget in `chat-view.tsx` does. This is fragile.

---

## 7. What Comes Next (Priority Order)

### P0 - Must Fix Before Launch
| # | Task | Effort | Why |
|---|------|--------|-----|
| 1 | **Wire D1 credentials** via Cowork | 15 min | Nothing persists without this |
| 2 | **Run /api/db/migrate** to create tables | 1 min | Schema needs to exist |
| 3 | **Add server-side DB persist to /api/chat** | 1h | Messages must be saved reliably, not just fire-and-forget |
| 4 | **Fix executor.ts to call /api/agents/execute** | 30 min | Agent system prompts are currently ignored |
| 5 | **Sync Zustand store with D1 on page load** | 2h | Load real conversations from DB instead of demo data |
| 6 | **Remove hardcoded demo data** | 30 min | Demo conversations/team pollute production |
| 7 | **Write core tests** (llm-router, rate-limit, db) | 3h | Zero test coverage is a launch blocker |
| 8 | **Update README** to reflect actual state | 30 min | Claims 82% test coverage (false) |

### P1 - Should Do Within 2 Weeks
| # | Task | Effort | Why |
|---|------|--------|-----|
| 9 | Add streaming support to /api/chat | 3h | Much better UX for long responses |
| 10 | Deduplicate /api/chat and /api/agents/execute | 1h | Same code twice |
| 11 | Write to usage_stats table | 1h | Schema exists, just needs INSERT |
| 12 | Wire budgets-view to real usage_stats | 2h | Low-hanging fruit, table is ready |
| 13 | Add English keywords to LLM router | 1h | Currently German-only classification |
| 14 | Fix rate-limit memory leak | 30 min | Add TTL cleanup to the Map |
| 15 | Persist custom agents to D1 | 2h | Agent builder works but loses data on reload |
| 16 | Wire Upstash Redis for production rate limiting | 1h | Packages already installed |

### P2 - Build Out Stub Views (2-4 Weeks)
| # | View | Effort | Notes |
|---|------|--------|-------|
| 17 | **Prompts** - CRUD + template variables | 3h | Easiest stub to make real |
| 18 | **Event Log** - real logging from API routes | 3h | Add structured logging to all routes |
| 19 | **Budgets** - real cost aggregation + alerts | 4h | Needs usage_stats writes first |
| 20 | **Settings** - editable forms + persistence | 4h | Needs settings table in D1 |
| 21 | **Workspace** - team management + roles | 8h | Needs auth system first |
| 22 | **Connectors** - real API integrations | 16h | Start with OpenRouter health check |
| 23 | **Documents** - file upload + RAG | 20h | Needs vector DB (Cloudflare Vectorize?) |
| 24 | **Automations** - cron/webhook triggers | 20h | Needs execution engine |
| 25 | **Telegram** - actual bot integration | 12h | Needs webhook endpoint + bot API |

### P3 - Long Term (1-3 Months)
- Streaming responses for all endpoints
- i18n (German + English)
- Real authentication (Clerk, Auth.js, or custom)
- n8n workflow integration
- Cloudflare KV for credential storage (replace localStorage)
- Playwright E2E tests
- Command palette (cmdk already installed)
- WebWorker for agent orchestrator

---

## 8. Risk Assessment

| Risk | Severity | Mitigation |
|------|----------|------------|
| **Data loss on page reload** | HIGH | Wire D1 + sync store on load (P0 #1-5) |
| **Zero test coverage** | HIGH | Write core tests before adding features (P0 #7) |
| **Demo data in production** | MEDIUM | Remove demo data, show empty state (P0 #6) |
| **No auth system** | MEDIUM | Single-user OK for now, add auth for teams |
| **In-memory rate limiting** | LOW | Fine for single-instance Vercel, add Upstash for scale |
| **German-only LLM routing** | LOW | Works for target audience, add English later |

---

*This audit reflects the state of the codebase as of 16 Feb 2026.*
*Next step: Wire D1 credentials and run through P0 tasks.*
