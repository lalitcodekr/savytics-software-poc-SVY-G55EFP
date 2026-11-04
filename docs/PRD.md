# Product Requirements Document (PRD)

## Mini Project Tracker

| | |
|---|---|
| **Author** | Pyda Lalit Kumar |
| **Application / Candidate ID** | SVY-G55EFP |
| **Purpose** | Savytics – Software Development Intern Technical Assessment |
| **Repository** | `savytics-software-poc-SVY-G55EFP` (public) |
| **Submission deadline** | 08/11/2026 (8 November 2026) |
| **Status** | Draft v1.0 |

---

## 1. Overview

### 1.1 Summary
Mini Project Tracker is a full-stack web application that lets a user create, organize, search, and track tasks, and see a dashboard summary of project progress. It is a focused, production-style proof of concept that demonstrates sound engineering across frontend, backend, database, testing, and CI/CD.

### 1.2 Problem Statement
Small teams and individuals often track work in scattered notes or spreadsheets. They lack a quick way to see what is pending, in progress, or complete, and to find specific tasks. A lightweight tracker with search, filters, and a progress dashboard solves this.

### 1.3 Assessment Context
This project is built to satisfy the Savytics technical assignment. The deliverable is evaluated on:
- Completeness against the required features
- Code quality, structure, and validation
- Testing and CI/CD discipline
- Documentation (README, architecture, screenshots)
- Ability to explain technical decisions in the follow-up walkthrough

---

## 2. Goals and Non-Goals

### 2.1 Goals
| ID | Goal |
|----|------|
| G1 | Deliver all required features (task CRUD, statuses, search, filters, dashboard) end to end. |
| G2 | Persist all data in PostgreSQL so it survives page refreshes and application restarts. |
| G3 | Enforce robust backend validation and consistent, meaningful error handling. |
| G4 | Provide a responsive UI (desktop and mobile) with loading, empty, success, and error states. |
| G5 | Ship automated tests (unit, component, API integration) and a GitHub Actions pipeline. |
| G6 | Maintain a clean commit history and a thorough README with architecture and screenshots. |
| G7 | Make every technical decision explainable in the walkthrough, including any AI tool usage. |

### 2.2 Non-Goals (Out of Scope)
- User authentication, accounts, or multi-tenancy
- Teams, task assignment, or role-based permissions
- Real-time collaboration (WebSockets)
- File attachments, comments, or notifications
- Drag-and-drop Kanban board (listed as an optional stretch only)
- Mandatory production hosting (a local Docker setup is sufficient; optional cloud deployment is covered in Section 11)

---

## 3. Target Users and Personas

| Persona | Description | Needs |
|---------|-------------|-------|
| **Individual Contributor (primary)** | A developer or student managing personal or project tasks | Quickly add tasks, update status, find tasks |
| **Project Lead (secondary)** | Someone who wants a snapshot of overall progress | At-a-glance dashboard with counts by status |
| **Technical Evaluator (assessment)** | Savytics engineer reviewing the submission | Clear setup, readable code, tests, CI, documentation |

---

## 4. User Stories and Acceptance Criteria

### Epic A: Task Management

**US-01 – Create a task**
*As a user, I want to create a task with a title, description, priority, and status so that I can capture work I need to do.*
- Form fields: title (required), description (optional), priority (Low / Medium / High), status (To Do / In Progress / Done)
- Default status is **To Do**; default priority is **Medium**
- Title must be 1–100 characters; description up to 1000 characters
- Invalid input shows inline field errors; valid input shows a success message and the task appears in the list
- Server rejects invalid payloads with HTTP 400 and field-level error details

**US-02 – View all tasks**
*As a user, I want to see all my tasks in one list so that I know what exists.*
- Tasks display title, priority badge, status badge, and created/updated date
- Default sort: newest first
- A loading indicator displays while data is fetched
- An empty state with a call-to-action displays when no tasks exist
- An error state with a retry option displays if the request fails

**US-03 – Edit a task**
*As a user, I want to edit any field of an existing task so that I can correct or update it.*
- Edit form is pre-filled with current values
- Same validation as creation
- Success message after save; list updates without a full page reload
- Editing a non-existent task returns HTTP 404

**US-04 – Delete a task**
*As a user, I want to delete a task so that I can remove work that is no longer relevant.*
- A confirmation dialog appears before deletion
- Success message after deletion; list and dashboard update
- Deleting a non-existent task returns HTTP 404

**US-05 – Quick status change**
*As a user, I want to change a task's status directly from the list so that updating progress is fast.*
- A status control on each task (dropdown or button) updates status in one action

### Epic B: Task Organization

**US-06 – Three-state workflow**
*As a user, I want every task to be To Do, In Progress, or Done so that I can see where work stands.*
- Only these three values are accepted by UI and API (enum enforced in DB, Zod, and TypeScript)

**US-07 – Search tasks**
*As a user, I want to search tasks by keyword so that I can find a specific task quickly.*
- Case-insensitive search across title and description
- Input is debounced (~300 ms)
- "No results" empty state when nothing matches

**US-08 – Filter tasks**
*As a user, I want to filter by status and priority so that I can focus on a subset of work.*
- Status filter: All / To Do / In Progress / Done
- Priority filter: All / Low / Medium / High
- Search and filters can be combined
- A "Clear filters" action resets all criteria

### Epic C: Dashboard

**US-09 – Progress summary**
*As a user, I want a dashboard showing total tasks and counts by status so that I can monitor progress.*
- Displays total number of tasks
- Displays counts for To Do, In Progress, and Done
- Counts update after create, edit, or delete
- Dashboard has loading and error states
- (Optional) completion percentage and per-priority breakdown

### Epic D: Reliability and Experience

**US-10 – Data persistence**
*As a user, I want my tasks to remain after refresh or restart so that I can trust the app.*
- All data is stored in PostgreSQL via Prisma
- Verified by restarting backend and database containers and confirming data remains

**US-11 – Clear feedback**
*As a user, I want clear loading, empty, success, and error feedback so that I always know what the app is doing.*
- Toast/banner notifications for success and failure
- Buttons disabled while submitting to prevent duplicates

**US-12 – Responsive layout**
*As a user, I want the app to work on my phone and my laptop so that I can use it anywhere.*
- Layout verified at roughly 360 px, 768 px, and 1280 px widths
- No horizontal scrolling; touch-friendly controls (min ~44 px tap targets)

### Epic E: Developer / Evaluator Experience

**US-13 – Easy setup**
*As an evaluator, I want to run the project with minimal steps so that I can review it quickly.*
- README setup in under 10 minutes using `.env.example` and Prisma migrations
- Seed script provides sample data
- (Optional) `docker-compose.yml` for PostgreSQL

**US-14 – Automated quality checks**
*As an evaluator, I want automated tests and CI so that I can trust the code quality.*
- GitHub Actions runs install, lint, type-check, test, and build on every push and PR

---

## 5. Feature List

Priority key: **P0** = required by the assignment, **P1** = strongly recommended, **P2** = optional stretch.

| ID | Feature | Priority | Stories |
|----|---------|----------|---------|
| F1 | Create task (title, description, priority, status) | P0 | US-01 |
| F2 | List all tasks | P0 | US-02 |
| F3 | Edit task | P0 | US-03 |
| F4 | Delete task with confirmation | P0 | US-04 |
| F5 | Three statuses (To Do, In Progress, Done) | P0 | US-06 |
| F6 | Search by keyword | P0 | US-07 |
| F7 | Filter by status and priority | P0 | US-08 |
| F8 | Dashboard: total + counts by status | P0 | US-09 |
| F9 | PostgreSQL persistence via Prisma | P0 | US-10 |
| F10 | Backend validation (Zod) and centralized error handling | P0 | US-01, US-03 |
| F11 | Responsive UI | P0 | US-12 |
| F12 | Loading, empty, success, and error states | P0 | US-11 |
| F13 | Automated tests (Vitest, RTL, Supertest) | P0 | US-14 |
| F14 | GitHub Actions CI workflow | P0 | US-14 |
| F15 | README with setup, architecture, screenshots, AI usage | P0 | US-13 |
| F16 | Quick inline status change | P1 | US-05 |
| F17 | Debounced search, combined with filters | P1 | US-07, US-08 |
| F18 | Sorting (newest, oldest, priority) | P1 | US-02 |
| F19 | Pagination (server-side) | P1 | US-02 |
| F20 | Docker Compose for DB (and optionally the whole stack) | P1 | US-13 |
| F21 | Seed script with sample data | P1 | US-13 |
| F22 | Dashboard completion % and priority breakdown | P2 | US-09 |
| F23 | Due dates and overdue indicator | P2 | n/a |
| F24 | Dark mode | P2 | n/a |
| F25 | Kanban board view | P2 | n/a |
| F26 | Playwright E2E tests | P2 | US-14 |

---

## 6. Functional Requirements

### 6.1 Data Model

**Task**

| Field | Type | Constraints |
|-------|------|-------------|
| `id` | UUID | Primary key, auto-generated |
| `title` | String | Required, 1–100 chars, trimmed |
| `description` | String | Optional, max 1000 chars |
| `priority` | Enum `LOW \| MEDIUM \| HIGH` | Required, default `MEDIUM` |
| `status` | Enum `TODO \| IN_PROGRESS \| DONE` | Required, default `TODO` |
| `createdAt` | DateTime | Auto-set |
| `updatedAt` | DateTime | Auto-updated |

Indexes: `status`, `priority`, `createdAt` to support filtering and sorting.

### 6.2 REST API

Base path: `/api`

| Method | Endpoint | Description | Success | Errors |
|--------|----------|-------------|---------|--------|
| `GET` | `/tasks` | List tasks. Query: `search`, `status`, `priority`, `sort`, `page`, `limit` | 200 | 400 |
| `GET` | `/tasks/:id` | Get one task | 200 | 400, 404 |
| `POST` | `/tasks` | Create task | 201 | 400 |
| `PUT/PATCH` | `/tasks/:id` | Update task | 200 | 400, 404 |
| `DELETE` | `/tasks/:id` | Delete task | 204 | 400, 404 |
| `GET` | `/dashboard/summary` | Total and counts by status | 200 | 500 |
| `GET` | `/health` | Health check | 200 | n/a |

**Standard error format**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "details": [{ "field": "title", "message": "Title is required" }]
  }
}
```

**Dashboard response example**
```json
{ "total": 12, "byStatus": { "TODO": 5, "IN_PROGRESS": 4, "DONE": 3 } }
```

### 6.3 Validation and Error Handling
- Zod schemas validate request body, query parameters, and route parameters
- Shared validation rules mirrored on the frontend for consistent inline errors
- Centralized Express error middleware maps errors to consistent responses:
  - Validation errors → 400
  - Not found (including Prisma `P2025`) → 404
  - Unexpected errors → 500 with a generic message (no stack traces in production)
- Unknown routes return a 404 JSON response
- Security basics: `helmet`, CORS restricted to the frontend origin, JSON body size limit, Prisma parameterized queries (no raw SQL injection risk)

### 6.4 Frontend Requirements
- **Pages/sections:** Dashboard summary, task toolbar (search, filters, "New Task"), task list, create/edit modal or form, delete confirmation
- **State and data:** Typed API client; server state via React Query (or equivalent hooks); loading and error flags per request
- **UI states:**

| State | Behavior |
|-------|----------|
| Loading | Skeletons or spinner for list and dashboard |
| Empty | Friendly message and "Create your first task" button; separate "no results" message for filtered views |
| Success | Toast on create, update, delete |
| Error | Inline banner or toast with a retry action; form-level and field-level errors |

- **Accessibility:** Semantic HTML, labeled inputs, keyboard-operable dialogs with focus management, sufficient color contrast, and status communicated by text (not color alone)

---

## 7. Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| **Performance** | List and dashboard API responses under 300 ms for up to ~1,000 tasks locally; debounced search |
| **Reliability** | Data persists across restarts; graceful handling of DB connection failure; health endpoint |
| **Security** | No secrets in the repo; `.env.example` provided; input validation on every endpoint; `helmet` and restricted CORS |
| **Maintainability** | TypeScript strict mode; ESLint and Prettier; layered backend (routes, controllers, services, schemas); feature-based frontend folders |
| **Compatibility** | Latest Chrome, Firefox, Safari, and Edge; mobile viewports from 360 px |
| **Portability** | Runs on Node 20 LTS and PostgreSQL 15+; reproducible via Docker Compose |
| **Documentation** | README covers setup, architecture, API reference, testing, limitations, AI usage |

---

## 8. Technical Architecture

### 8.1 Technology Stack

| Layer | Choice |
|-------|--------|
| Frontend | React, TypeScript, Vite |
| Backend | Node.js, TypeScript, Express |
| Database | PostgreSQL |
| ORM | Prisma |
| Validation | Zod |
| Testing | Vitest, React Testing Library, Supertest |
| CI/CD | GitHub Actions |
| Tooling | ESLint, Prettier, Docker Compose, (optional) Husky |

### 8.2 High-Level Architecture

```
┌──────────────┐   HTTP/JSON    ┌────────────────────┐   Prisma    ┌──────────────┐
│  React + Vite │ ─────────────▶ │  Express API (TS)  │ ──────────▶ │  PostgreSQL  │
│  (Browser)    │ ◀───────────── │  Zod · Middleware  │ ◀────────── │              │
└──────────────┘                └────────────────────┘             └──────────────┘
```

### 8.3 Suggested Repository Structure

```
savytics-software-poc-SVY-G55EFP/
├── .github/workflows/ci.yml
├── backend/
│   ├── prisma/ (schema.prisma, migrations/, seed.ts)
│   ├── src/
│   │   ├── app.ts, server.ts
│   │   ├── routes/, controllers/, services/
│   │   ├── schemas/ (Zod)
│   │   ├── middleware/ (errorHandler, validate, notFound)
│   │   └── lib/ (prisma client, config)
│   ├── tests/ (Supertest integration tests)
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/, components/, features/tasks/, features/dashboard/
│   │   ├── hooks/, types/, utils/
│   │   └── main.tsx, App.tsx
│   ├── tests/ or *.test.tsx
│   └── package.json
├── docs/screenshots/
├── docker-compose.yml
├── .env.example
├── PRD.md
└── README.md
```

### 8.4 Key Design Decisions (to explain in the walkthrough)
1. **Layered backend:** keeps HTTP concerns, business logic, and data access separate and testable.
2. **Zod at the boundary:** a single source of truth for validation; types inferred with `z.infer`.
3. **Prisma enums:** statuses and priorities enforced at the database level, not only in code.
4. **Server-side filtering and search:** scalable and avoids sending unnecessary data to the client.
5. **Aggregate query for dashboard:** use `groupBy` rather than fetching all tasks.
6. **React Query for server state:** built-in caching, loading, error, and refetch handling.
7. **Separate test database:** integration tests never touch development data.

---

## 9. Testing Strategy

| Level | Tooling | Coverage Focus |
|-------|---------|----------------|
| Backend unit | Vitest | Zod schemas, service logic, error mapping |
| Backend integration | Vitest + Supertest | Every endpoint: success paths, validation failures (400), not-found (404), filter/search behavior, dashboard counts |
| Frontend component | Vitest + React Testing Library | Task form validation, task list states (loading/empty/error), filters, search, dashboard rendering, delete confirmation |
| E2E (optional) | Playwright | Create → edit → filter → delete flow |

**Targets:** meaningful coverage of all P0 features; ~80% line coverage on core backend and frontend logic; all tests green in CI.

---

## 10. CI/CD (GitHub Actions)

Workflow triggers: `push` and `pull_request` on `main`.

| Step | Description |
|------|-------------|
| Checkout and setup | Node 20 with dependency caching |
| Service container | PostgreSQL for backend integration tests |
| Install | `npm ci` for backend and frontend |
| Prisma | `prisma generate` and `prisma migrate deploy` against the CI database |
| Lint and type-check | ESLint and `tsc --noEmit` |
| Test | Backend and frontend suites with coverage |
| Build | Production builds of both apps |

A passing-workflow badge is added to the README.

---

## 11. Deployment Steps (GitHub)

The repository must be **private** and named exactly `savytics-software-poc-SVY-G55EFP`.

### 11.1 Create and Push the Repository

1. **Create the repo on GitHub:** GitHub → **New repository** → name `savytics-software-poc-SVY-G55EFP` → visibility **Private** → do not add a README (you will push your own).
2. **Initialize locally and make the first commit:**
   ```bash
   git init -b main
   git add .
   git commit -m "chore: initial project setup"
   ```
3. **Connect and push:**
   ```bash
   git remote add origin https://github.com/<your-username>/savytics-software-poc-SVY-G55EFP.git
   git push -u origin main
   ```
4. **Make sure these are in `.gitignore` before the first push:** `node_modules/`, `.env`, `dist/`, `coverage/`. Commit only `.env.example`.
5. **Use a branch workflow:** work on feature branches (`feat/task-crud`, `feat/dashboard`, `test/api`), open pull requests into `main`, and let CI run on each PR. Use descriptive commit messages (Conventional Commits).
6. **Protect `main` (recommended):** Settings → Branches → require the CI check to pass before merging.
7. **Share access if requested:** Settings → Collaborators → add the Savytics reviewer usernames provided by the recruiter.

### 11.2 Verify the CI Pipeline on GitHub

1. Push the workflow file at `.github/workflows/ci.yml`.
2. Open the repo's **Actions** tab and confirm the run is green (install, lint, type-check, test, build).
3. Add the status badge to the README:
   ```md
   ![CI](https://github.com/<your-username>/savytics-software-poc-SVY-G55EFP/actions/workflows/ci.yml/badge.svg)
   ```
4. Do a **fresh-clone test**: clone the repo into a new folder, follow only the README steps, and confirm the app runs.

### 11.3 Optional: Cloud Deployment via GitHub Actions

Not required by the assignment, but it makes the walkthrough stronger. Pick one setup.

| Component | Suggested Host | How |
|-----------|----------------|-----|
| Database | Neon, Supabase, or Render PostgreSQL | Create a free instance; copy its connection string |
| Backend (Express) | Render or Railway | Connect the GitHub repo; root directory `backend`; build `npm ci && npx prisma generate && npm run build`; start `npx prisma migrate deploy && node dist/server.js` |
| Frontend (Vite) | GitHub Pages, Vercel, or Netlify | Build `frontend` with `VITE_API_URL` pointing to the deployed backend |

**Steps**

1. Provision the PostgreSQL instance and note its `DATABASE_URL`.
2. Deploy the backend and set environment variables on the host: `DATABASE_URL`, `PORT`, `NODE_ENV=production`, `CORS_ORIGIN` (the frontend URL).
3. In GitHub → Settings → **Secrets and variables → Actions**, add any deployment secrets (for example `RENDER_DEPLOY_HOOK_URL`) and a repository variable `VITE_API_URL`.
4. Add a deploy job to the workflow that runs only on `main` after tests pass:
   ```yaml
   deploy-frontend:
     needs: test
     if: github.ref == 'refs/heads/main'
     runs-on: ubuntu-latest
     permissions:
       pages: write
       id-token: write
     steps:
       - uses: actions/checkout@v4
       - uses: actions/setup-node@v4
         with: { node-version: 20, cache: npm, cache-dependency-path: frontend/package-lock.json }
       - run: npm ci && npm run build
         working-directory: frontend
         env:
           VITE_API_URL: ${{ vars.VITE_API_URL }}
       - uses: actions/upload-pages-artifact@v3
         with: { path: frontend/dist }
       - uses: actions/deploy-pages@v4
   ```
5. For GitHub Pages: Settings → **Pages** → Source: **GitHub Actions**. Set `base` in `vite.config.ts` to `/savytics-software-poc-SVY-G55EFP/`.
6. Note: GitHub Pages from a **private** repo requires a paid GitHub plan. If unavailable, use Vercel or Netlify for the frontend instead.
7. Add the live URLs to the README and the submission email.

### 11.4 Deployment Acceptance Criteria

| Check | Expected Result |
|-------|-----------------|
| Repo visibility | Private |
| Repo name | `savytics-software-poc-SVY-G55EFP` |
| Secrets in repo history | None (no `.env`, keys, or passwords) |
| CI on `main` | Green |
| Fresh clone runs following README only | Pass |
| (Optional) Deployed app reachable and persists data | Pass |

---

## 12. Success Metrics

### 12.1 Functional Completeness
| Metric | Target |
|--------|--------|
| Required (P0) features implemented | 100% (15 of 15) |
| Required endpoints working with correct status codes | 100% |
| Data intact after restarting app and database | Pass |

### 12.2 Quality
| Metric | Target |
|--------|--------|
| TypeScript strict-mode errors | 0 |
| ESLint errors | 0 |
| Automated tests passing | 100% |
| Test coverage on core logic | ≥ 80% |
| CI pipeline on `main` | Green |

### 12.3 User Experience
| Metric | Target |
|--------|--------|
| Time to create a task | Under 15 seconds |
| Layout at 360 / 768 / 1280 px | No horizontal scroll or broken layout |
| Lighthouse accessibility score | ≥ 90 |
| Every async view has loading, empty, and error handling | 100% |

### 12.4 Process and Documentation
| Metric | Target |
|--------|--------|
| Commit history | Regular, descriptive commits (e.g., Conventional Commits), 25+ meaningful commits |
| README completeness | Setup, architecture, API docs, tests, screenshots, limitations, AI usage |
| Fresh-clone setup time | Under 10 minutes |
| Walkthrough readiness | Can explain every major decision and each file's purpose without notes |

---

## 13. Implementation Plan

Deadline: **8 November 2026**. Four days remain from today (4 November), so this plan is compressed.

| Day | Focus | Deliverables |
|-----|-------|--------------|
| **Day 1** (4 Nov) | Setup and backend | Repo, tooling, Docker Postgres, Prisma schema and migration, task CRUD API, Zod validation, error middleware |
| **Day 2** (5 Nov) | Backend completion and frontend foundation | Search, filters, dashboard endpoint, Supertest tests; Vite app, API client, task list |
| **Day 3** (6 Nov) | Frontend features | Create/edit/delete UI, search and filters, dashboard, all UI states, responsive styling |
| **Day 4** (7 Nov) | Quality and docs | Frontend tests, GitHub Actions, README with screenshots, AI usage notes, bug fixes |
| **Buffer** (8 Nov) | Final checks and submission | Fresh-clone test, CI green, submit repo URL, description, and known limitations |

**Commit cadence:** commit after each logical unit (for example `feat(api): add task creation endpoint`, `test(api): cover validation errors`, `docs: add architecture section`).

---

## 14. Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Tight timeline | Missed requirements | Build P0 first; treat P1/P2 as optional; keep a daily checklist |
| Database setup issues on evaluator's machine | Cannot run the app | Docker Compose, `.env.example`, clear README, seed script |
| CI failures from DB or environment differences | Red pipeline | Use a Postgres service container; run the same commands locally first |
| Over-reliance on AI-generated code | Cannot explain it in the walkthrough | Review every file; write notes on decisions; document AI usage honestly |
| Scope creep | Incomplete core features | Hold to the non-goals list in Section 2.2 |
| Flaky tests | Unstable CI | Isolated test database; reset state between tests; avoid timing dependencies |

---

## 15. Submission Checklist

- [ ] Private GitHub repo named `savytics-software-poc-SVY-G55EFP`
- [ ] All P0 features working end to end
- [ ] PostgreSQL persistence verified after restart
- [ ] Backend validation and error handling in place
- [ ] Responsive UI with loading, empty, success, and error states
- [ ] Backend and frontend automated tests passing
- [ ] GitHub Actions workflow green
- [ ] `.env` and secrets not committed; `.gitignore` configured
- [ ] Fresh-clone test completed
- [ ] (Optional) Cloud deployment live and URLs added to README
- [ ] README with setup, architecture, implementation details, and screenshots
- [ ] README section documenting AI tool usage
- [ ] Regular, descriptive commit history
- [ ] Repo access granted to Savytics reviewers (if requested)
- [ ] Submission email: repo URL, short implementation description, known limitations

---

## 16. Known Limitations (to be finalized at submission)

- No authentication; all users share one task list
- No real-time sync across browser tabs or devices
- Optional features (F22–F26) may be left out depending on time

---

## 17. Open Questions

1. Should the repository be shared with specific Savytics GitHub usernames? (Confirm in the assignment email or with the recruiter.)
2. Is a Docker-based setup acceptable, or must the evaluator be able to use a locally installed PostgreSQL? (Support both in the README to be safe.)
3. Is the deadline date `08/11/2026` in DD/MM/YYYY format (8 November)? This PRD assumes yes.

---

## 18. Appendix: AI Usage Documentation Template

Include this section in the README:

> **AI Tool Usage**
> - **Tools used:** [e.g., Claude]
> - **Used for:** [e.g., drafting the PRD, scaffolding boilerplate, suggesting test cases]
> - **Reviewed and modified by me:** [what you checked, changed, or rewrote]
> - **Written independently:** [e.g., core business logic, final architecture decisions]
> - **Verification:** [how you confirmed correctness, e.g., running tests, manual testing]
