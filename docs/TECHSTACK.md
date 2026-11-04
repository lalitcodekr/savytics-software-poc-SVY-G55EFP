# Tech Stack Recommendation

## Mini Project Tracker (Savytics Assessment, Candidate ID: SVY-G55EFP)

| | |
|---|---|
| **Companion to** | `PRD.md` |
| **Prepared** | 4 November 2026 |
| **Proposed stack** | Next.js + Vercel (candidate preference), validated against the assignment |
| **Version note** | Versions below were current at the time of writing. Confirm with `npm view <package> version` before installing. |

---

## 1. Executive Summary

**Verdict: Next.js on Vercel is a valid choice for this assignment.** Every *required* feature in the brief can be built with it. The company's stack is listed as **"Recommended"**, not mandatory, so a justified deviation is acceptable.

There is one real risk. The recommended stack describes a **separate Express backend tested with Supertest**. A Next.js app is full-stack in one codebase, so an evaluator expecting a visible frontend/backend split may look for it. This is manageable if you:

1. Build a clear REST API under `/api` with a separate service layer (so the "backend" is still obvious).
2. Explain the decision in the README and be ready to defend it in the walkthrough.
3. Optionally send the recruiter a one-line confirmation email (template in Section 9).

| Layer | Recommended Choice |
|-------|--------------------|
| Frontend | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, shadcn/ui |
| Backend | Next.js Route Handlers (REST under `/api`) + service layer + Zod |
| Auth | None for the submission (PRD non-goal); Better Auth or Clerk if added later |
| Database | PostgreSQL via Neon (Vercel Marketplace); Docker Postgres locally |
| ORM | Prisma |
| Validation | Zod (shared between client and server) |
| Testing | Vitest, React Testing Library, route-handler API tests, optional Playwright |
| CI/CD | GitHub Actions (quality gate) + Vercel Git integration (deploy) |
| Deployment | Vercel (app) + Neon (database) |

---

## 2. Compatibility Check Against the Assignment

### 2.1 Required Features

| Requirement | Next.js + Vercel Support | Status |
|-------------|--------------------------|--------|
| Create, edit, delete, view tasks | Route Handlers + React UI | ✅ |
| Three statuses, search, filters | Query params handled server-side with Prisma | ✅ |
| Dashboard (total and counts by status) | Prisma `groupBy` aggregate endpoint | ✅ |
| Persist data in PostgreSQL | Neon / any Postgres via Prisma | ✅ |
| Backend validation and error handling | Zod + shared error helper | ✅ |
| Responsive UI with loading, empty, success, error states | Tailwind, `loading.tsx`, `error.tsx`, toasts | ✅ |
| Automated tests | Vitest + RTL (+ API tests) | ✅ |
| GitHub Actions workflow | Works the same as any Node project | ✅ |
| Private repo named `savytics-software-poc-SVY-G55EFP` | Independent of framework | ✅ |
| README with architecture and screenshots | Independent of framework | ✅ |

### 2.2 Recommended Stack vs. Your Stack

| Company Recommendation | Your Choice | Match |
|------------------------|-------------|-------|
| React | React 19 (inside Next.js) | ✅ Same |
| TypeScript | TypeScript (strict) | ✅ Same |
| Vite | Next.js (Turbopack bundler) | ⚠️ Different build tool |
| Node.js + Express | Next.js Route Handlers on Node runtime | ⚠️ Different backend framework |
| PostgreSQL | PostgreSQL (Neon) | ✅ Same |
| Prisma | Prisma | ✅ Same |
| Zod | Zod | ✅ Same |
| Vitest | Vitest | ✅ Same |
| React Testing Library | React Testing Library | ✅ Same |
| Supertest | Direct handler tests or HTTP tests (see 5.3) | ⚠️ Supertest does not fit natively |
| GitHub Actions | GitHub Actions | ✅ Same |

**Result:** 8 of 11 items match exactly; 3 differ in tooling but not in outcome.

### 2.3 Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Evaluator expects an Express backend and Supertest | Medium | Medium | Document the decision; keep API and service layers clearly separated; confirm by email |
| Walkthrough questions on Next.js specifics (server vs client components, caching) | Medium | Medium | Keep the architecture simple; study the App Router basics before the walkthrough |
| Serverless DB connection and cold-start issues | Low | Medium | Use Neon pooled connection string and Prisma driver adapter |
| Over-engineering with Server Actions, caching, and PPR | Medium | Low | Use plain Route Handlers and explicit data fetching only |
| Vercel/Neon free-tier limits or setup problems before the deadline | Low | Medium | Local Docker Postgres works with zero cloud setup; deployment is optional |

### 2.4 Decision Guide

| If you... | Choose |
|-----------|--------|
| Are strongest in Next.js and can explain it confidently | **Next.js + Vercel** (this document) |
| Want zero risk of deviating from what evaluators expect | **Vite + React frontend, Express backend** (the company's recommended stack) |
| Want a middle path | Next.js with the backend logic isolated in a `server/` layer so it can be lifted into Express |

**Honest recommendation:** With four days left, use the stack you can build *and explain* fastest. Next.js is a sound, defensible choice for this brief. The only thing it costs you is the evaluator's easy "tick" on Express and Supertest, which you recover through documentation and a clear API layer.

---

## 3. Frontend

### Choice
- **Next.js 16 (App Router)** with **React 19** and **TypeScript (strict)**
- **Tailwind CSS** for responsive styling
- **shadcn/ui** (Radix-based) for accessible dialogs, selects, toasts, and skeletons
- **TanStack Query** for client-side data fetching, caching, and loading/error state
- **React Hook Form + Zod resolver** for forms with inline validation

### Justification
| Reason | Detail |
|--------|--------|
| Meets the brief | React and TypeScript are the recommended frontend stack; Next.js is React with a production framework around it |
| Responsive by default | Tailwind's breakpoint utilities make desktop and mobile layouts quick to build |
| UI states are built in | `loading.tsx` and `error.tsx` conventions, plus skeleton and toast components, cover loading, empty, success, and error states |
| Accessibility | shadcn/ui and Radix handle focus management, keyboard use, and ARIA for dialogs and menus |
| Shared validation | The same Zod schemas validate forms on the client and requests on the server |
| Ecosystem and hiring signal | Next.js is widely used in industry, which helps in discussion with evaluators |

### Alternatives Considered
| Option | Why Not (for this project) |
|--------|----------------------------|
| Vite + React | Matches the brief exactly and is simpler, but needs a separate backend to deploy; strong fallback choice |
| Remix / React Router framework mode | Good option, but less familiar to most evaluators |
| SvelteKit / Nuxt | Different ecosystem from the recommended React stack |

### Guidance
Use **client components with TanStack Query** for the task list, search, and filters, and keep the REST API as the single data path. This keeps the architecture aligned with the PRD and makes the API independently testable. Avoid mixing in Server Actions for the same operations; two data paths add explanation burden.

---

## 4. Backend

### Choice
- **Next.js Route Handlers** (`app/api/**/route.ts`) on the Node.js runtime
- A **service layer** (`src/server/services/`) holding all business logic and Prisma calls
- **Zod** schemas for body, query, and route parameters
- A shared **error helper** that returns the PRD's standard error format

### Justification
| Reason | Detail |
|--------|--------|
| One deployable | Frontend and API ship together on Vercel, which removes CORS setup and a second host |
| Same REST contract as the PRD | The endpoints in PRD Section 6.2 map one to one to Route Handlers |
| Clean separation | Route Handler (HTTP only) → service (logic) → Prisma (data) keeps the backend visible and testable |
| Fewer moving parts | Less configuration and less to break in a four-day window |

### Alternative: Express (company recommendation)
Choose Express if you want an exact match to the brief. It requires a second deployment (for example Render or Railway) and CORS configuration, but it enables native Supertest tests and gives evaluators exactly what they expect.

### Suggested API Layout
```
app/api/
├── tasks/route.ts            # GET (list, search, filter, paginate), POST
├── tasks/[id]/route.ts       # GET, PATCH/PUT, DELETE
├── dashboard/summary/route.ts# GET
└── health/route.ts           # GET
```

---

## 5. Validation and Testing

### 5.1 Validation: Zod
- Single source of truth for types (`z.infer`) shared by client forms and server handlers
- Validates request body, query string (`status`, `priority`, `search`, `page`), and `id` parameters
- Failures return HTTP 400 with field-level details (PRD Section 6.3)

### 5.2 Testing Tools
| Level | Tool | Focus |
|-------|------|-------|
| Unit | Vitest | Zod schemas, service functions, error mapping |
| Component | Vitest + React Testing Library | Task form validation, list states, filters, dashboard |
| API | Vitest (see 5.3) | Every endpoint: success, 400, 404, filters, dashboard counts |
| E2E (optional) | Playwright | Create → edit → filter → delete |

### 5.3 The Supertest Question
Supertest targets Node HTTP servers (Express). Route Handlers use the Web `Request`/`Response` API, so you have three workable options:

1. **Call the handlers directly** in Vitest: build a `new Request(...)`, pass it to `GET`/`POST`, and assert on the `Response`. Simple and fast; recommended.
2. **Run the built app in CI** (`next start`) and test with `fetch` against `http://localhost:3000/api`. Closest to real HTTP.
3. **Use a helper library** such as `next-test-api-route-handler` (check that it supports your Next.js version before relying on it).

State in the README that Supertest was replaced by option 1 or 2 because Route Handlers are not Express apps. This shows you understood the difference.

### 5.4 Targets
- All P0 features covered by at least one test
- About 80% coverage on service and validation logic
- Tests run against a separate test database (a Postgres service container in CI)

---

## 6. Authentication

### Recommendation for the Submission: No Authentication
The assignment does not ask for users or login, and the PRD lists authentication as a non-goal. Adding auth inside a four-day window adds risk and takes time from the required features.

### If You Add It Later (Stretch)
| Option | When to Choose | Notes |
|--------|----------------|-------|
| **Better Auth** | You want self-hosted, TypeScript-first auth with Prisma | Good Next.js and Prisma support; verify current docs and the status of Auth.js before choosing |
| **Clerk** | You want the fastest hosted setup | Prebuilt UI and sessions; third-party dependency and free-tier limits |
| **Auth.js (NextAuth)** | You already know it | Check its maintenance status and docs before starting a new project on it |

**Design for it now at no cost:** add an optional `userId` column only if you implement auth. Otherwise do not include it. Unused fields invite questions in the walkthrough.

---

## 7. Database

### Choice
- **PostgreSQL** (required) hosted on **Neon**, provisioned through the **Vercel Marketplace**
- **Docker Compose Postgres** for local development and CI parity
- **Prisma** as the ORM

### Justification
| Reason | Detail |
|--------|--------|
| Required by the brief | PostgreSQL persistence is a P0 requirement |
| Serverless-friendly | Neon offers pooled connections and scale-to-zero, a good fit for Vercel functions |
| Simple setup | Marketplace integration injects `DATABASE_URL` into the Vercel project automatically |
| Preview environments | Neon can provide a database branch per preview deployment (optional) |
| Local parity | The same Postgres engine runs locally via Docker, avoiding "works on my machine" differences |

Note: Vercel no longer offers its own first-party Postgres product. Postgres on Vercel comes from Marketplace providers such as Neon, Supabase, or Prisma Postgres.

### Prisma Notes
- Prisma 7 moved to a Rust-free client that connects through **driver adapters** (for example `@prisma/adapter-pg` or `@prisma/adapter-neon`), with project configuration in `prisma.config.ts` and a changed generator output path. Follow the current official "Next.js + Prisma" quickstart rather than older tutorials, since many online examples predate these changes.
- A newer Prisma ORM major version exists, but Prisma's own comparison notes some features that ORM 7 has are not yet available in it. For a time-boxed assessment, use the version the official quickstart installs and confirm that your needed features (`groupBy`, enums, filtering, `contains` with `mode: "insensitive"`) work.
- Use `prisma migrate dev` locally and `prisma migrate deploy` in CI and production. Commit the `migrations/` folder.
- Keep a single Prisma client instance (`src/server/db.ts`) to avoid exhausting connections during development hot reloads.

### Schema Highlights
- Enums `Priority` (`LOW`, `MEDIUM`, `HIGH`) and `Status` (`TODO`, `IN_PROGRESS`, `DONE`)
- Indexes on `status`, `priority`, `createdAt`

### Alternatives Considered
| Option | Why Not (for this project) |
|--------|----------------------------|
| Supabase | Excellent, but brings auth/storage you do not need; more concepts to explain |
| Prisma Postgres | Good fit with Prisma; fewer evaluators will be familiar with it than plain Postgres |
| SQLite | Does not meet the PostgreSQL requirement |
| Drizzle ORM | Strong choice, but the brief names Prisma |

---

## 8. Deployment and CI/CD

### 8.1 Choice
- **Vercel** for hosting the Next.js app (frontend and API)
- **Neon** for managed PostgreSQL
- **GitHub Actions** as the quality gate (lint, type-check, test, build)
- **Vercel's GitHub integration** for automatic preview and production deploys

### 8.2 Justification
| Reason | Detail |
|--------|--------|
| First-party Next.js host | Vercel builds and runs Next.js with no custom configuration |
| Git-driven | Every push gets a preview URL; merges to `main` deploy to production |
| Zero server management | No Docker, Nginx, or process manager to maintain |
| Strong demo value | A live URL makes the walkthrough easier |
| Works with a private repo | Import the private repo into Vercel from your own GitHub account |

### 8.3 Pipeline Design
```
Developer ──push/PR──▶ GitHub
                         │
        ┌────────────────┴─────────────────┐
        ▼                                  ▼
 GitHub Actions (quality gate)      Vercel Git integration
 install → lint → type-check →      preview deploy per PR,
 prisma migrate deploy (CI DB) →    production deploy on main
 test → build
```

### 8.4 Deployment Steps (Summary)
1. Push the private repo `savytics-software-poc-SVY-G55EFP` to GitHub.
2. In Vercel: **Add New → Project →** import the repo (framework auto-detected).
3. In the Vercel project: **Storage → Create → Neon** (Marketplace) and connect it to the project so `DATABASE_URL` is injected.
4. Run migrations against the production database: add `prisma migrate deploy` to the build command (for example `prisma migrate deploy && next build`) or run it once from your machine with the production URL.
5. Set any other environment variables (`NODE_ENV` is set automatically).
6. Deploy, then verify create, edit, delete, search, filters, dashboard, and persistence after a redeploy.
7. Add the live URL and the CI badge to the README.

### 8.5 Platform Notes
- Vercel's free **Hobby** plan is intended for personal, non-commercial use, which fits an assessment project. Check the current plan terms before relying on it.
- Use a **pooled** connection string for serverless functions.
- Seeding and migrations should never run on every request; run them in the build or CI step only.
- If Vercel setup fails near the deadline, the app still runs locally with Docker Postgres. Deployment is optional per the PRD.

### 8.6 Alternatives Considered
| Option | Why Not (for this project) |
|--------|----------------------------|
| Render / Railway | Good for Express backends; extra work for Next.js and no advantage here |
| Netlify | Works, but Vercel is the first-party Next.js host |
| Self-hosted Docker (VPS) | Maximum control, much more setup and maintenance |
| Cloudflare Workers | Requires an adapter and edge-runtime constraints with Prisma; unnecessary risk |

---

## 9. Confirmation Email (Optional, Recommended)

Sending this takes two minutes and removes the main risk:

> **Subject:** Application SVY-G55EFP – Tech stack clarification
>
> Hi Savytics team,
>
> I plan to build the Mini Project Tracker using Next.js (React, TypeScript), Prisma, PostgreSQL, Zod, Vitest and React Testing Library, deployed on Vercel, with a REST API in Next.js Route Handlers instead of a separate Express server. Please let me know if this is acceptable, or if you would prefer the Vite + Express setup from the recommended stack.
>
> Thank you,
> Pyda Lalit Kumar

If there is no reply before you need to start building, proceed with Next.js, document the decision clearly, and keep the API layer separated.

---

## 10. Suggested Project Structure (Next.js)

```
savytics-software-poc-SVY-G55EFP/
├── .github/workflows/ci.yml
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── src/
│   ├── app/
│   │   ├── page.tsx                 # Dashboard + task list
│   │   ├── layout.tsx
│   │   ├── loading.tsx, error.tsx
│   │   └── api/                     # Route Handlers (REST)
│   ├── components/                  # UI components (shadcn/ui based)
│   ├── features/tasks/              # hooks, forms, list, filters
│   ├── features/dashboard/
│   ├── lib/                         # api client, utils
│   ├── schemas/                     # Zod schemas (shared)
│   └── server/
│       ├── db.ts                    # Prisma client singleton
│       ├── services/                # business logic
│       └── errors.ts                # error mapping
├── tests/                           # API + service tests
├── docs/screenshots/
├── docker-compose.yml
├── prisma.config.ts
├── .env.example
├── PRD.md
├── TECHSTACK.md
└── README.md
```

---

## 11. Summary Scorecard

| Criterion | Next.js + Vercel | Vite + Express (company default) |
|-----------|------------------|----------------------------------|
| Match to company recommendation | Medium | High |
| Speed to build in 4 days | High | Medium |
| Deployment simplicity | High (one host) | Medium (two hosts, CORS) |
| Supertest compatibility | Low (alternatives needed) | High |
| Clarity of frontend/backend separation | Medium (needs discipline) | High |
| Walkthrough risk | Medium | Low |
| Industry relevance in 2026 | High | Medium |

**Final recommendation:** Go with **Next.js + Vercel + Neon + Prisma + Zod + Vitest**, keep the REST API and service layer clean, document why Supertest was replaced, and send the confirmation email. If you feel unsure about explaining Next.js internals in the walkthrough, fall back to Vite + Express with no loss of features.

---

## 12. Changes Needed in the PRD if You Choose Next.js

| PRD Section | Change |
|-------------|--------|
| 6.3 Validation | Replace "Express error middleware" with a shared error helper used by Route Handlers |
| 8.1, 8.2, 8.3 | Update stack table, architecture diagram, and repository structure to the Next.js layout in Section 10 |
| 9 Testing | Replace Supertest with direct handler or `fetch`-based API tests |
| 10 CI/CD | Keep as is; build step becomes `next build` |
| 11 Deployment | Replace the Render/Railway backend row with Vercel; keep Neon for the database |
