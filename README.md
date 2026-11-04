# Mini Project Tracker (Savytics Assessment)

[![CI](https://github.com/lalitcodekr/savytics-software-poc-SVY-G55EFP/actions/workflows/ci.yml/badge.svg)](https://github.com/lalitcodekr/savytics-software-poc-SVY-G55EFP/actions/workflows/ci.yml)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-6-darkblue?style=flat&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-336791?style=flat&logo=postgresql)

A full-stack project tracking application demonstrating robust engineering across frontend, backend API, PostgreSQL persistence, Zod validation, automated testing, and CI/CD.

| Metadata | Details |
|---|---|
| **Candidate ID** | `SVY-G55EFP` |
| **Author** | Pyda Lalit Kumar |
| **Repository** | `savytics-software-poc-SVY-G55EFP` |
| **Assessment Date** | November 2026 |

---

## 🚀 Features

- **Task CRUD**: Create, view, edit, and delete tasks with instant optimistic feedback.
- **Three-State Workflow**: Strict `TODO`, `IN_PROGRESS`, and `DONE` statuses enforced in Postgres enums, Prisma, and Zod schemas.
- **Search & Filter**: Real-time debounced keyword search combined with status/priority filters and sorting.
- **Progress Dashboard**: At-a-glance summary cards showing total tasks and counts per status aggregated directly from PostgreSQL.
- **Form Validation**: Comprehensive client and server-side validation using Zod with structured field-level error messages.
- **Responsive UI & Feedback**: Desktop and mobile layouts with skeleton loading states, empty states, error fallbacks, and toast notifications.
- **Automated Testing & CI**: Vitest unit/schema tests and GitHub Actions CI workflow running lint, typecheck, tests, and build on every push.

---

## 📸 Application Screenshots

### Desktop Views

#### 1. Interactive Dashboard
Live summary metrics, overall completion progress bar, and recent task activity.
![Dashboard](docs/screenshots/dashboard.png)

#### 2. Task Management Hub (List View)
Comprehensive task list with priority badges, inline status dropdowns, update timestamps, and pagination.
![Task List](docs/screenshots/tasks-list.png)

#### 3. Real-Time Search & Filtering
Debounced keyword search across task titles and descriptions, combined with status and priority filtering.
![Filtered Tasks](docs/screenshots/tasks-filtered.png)

#### 4. Task Modal (Create & Edit)
Accessible modal dialog with client-side Zod validation, character counters, priority selectors, and optimistic updates.
![Task Modal](docs/screenshots/task-modal.png)

#### 5. Three-State Kanban Board
Visual workflow with dedicated columns for `TO DO`, `IN PROGRESS`, and `DONE` supporting drag-and-drop status transitions.
![Kanban Board](docs/screenshots/kanban-board.png)

#### 6. Project Overview & Architecture
System specification, technical metadata, and quick navigation actions.
![Project Overview](docs/screenshots/project-overview.png)

---

### Mobile Responsive Views

| Dashboard (Top Metrics) | Dashboard (Progress & Tasks) | Navigation Drawer |
|---|---|---|
| ![Mobile Dashboard 1](docs/screenshots/mobile-dashboard-1.png) | ![Mobile Dashboard 2](docs/screenshots/mobile-dashboard-2.png) | ![Mobile Sidebar](docs/screenshots/mobile-sidebar.png) |

---

## 🏗️ Architecture & Tech Stack

```
┌────────────────────────────────────────────────────────┐
│               Client (React 19 + Tailwind)             │
│  - Dashboard Summary Cards                             │
│  - Task Toolbar (Debounced Search, Filters, Sorting)   │
│  - Task Cards with inline status dropdown              │
│  - Task Modal Form (React Hook Form + Zod)             │
│  - TanStack Query (Caching, Mutations, Invalidation)   │
└───────────────────────────┬────────────────────────────┘
                            │ HTTP / REST (/api/*)
┌───────────────────────────▼────────────────────────────┐
│          Next.js Route Handlers (REST Layer)           │
│  - GET, POST /api/tasks                                │
│  - GET, PATCH, DELETE /api/tasks/[id]                  │
│  - GET /api/dashboard/summary                          │
│  - GET /api/health                                     │
│  - Centralized Error Handler (AppError, Zod, Prisma)   │
└───────────────────────────┬────────────────────────────┘
                            │ Service Layer
┌───────────────────────────▼────────────────────────────┐
│                    Business Logic                      │
│  - Task Service (CRUD, server-side filtering)          │
│  - Prisma Client Singleton                             │
└───────────────────────────┬────────────────────────────┘
                            │ SQL Queries
┌───────────────────────────▼────────────────────────────┐
│               PostgreSQL Database (Neon)               │
│  - Task Table with Enums: Priority & Status            │
│  - Indexes on status, priority, and createdAt          │
└────────────────────────────────────────────────────────┘
```

---

## 🛠️ Getting Started

### Prerequisites

- Node.js 20+ LTS
- npm 10+
- A PostgreSQL database (Neon Cloud URL provided in `.env.example`, or local Docker)

### 1. Clone the repository

```bash
git clone https://github.com/lalitcodekr/savytics-software-poc-SVY-G55EFP.git
cd savytics-software-poc-SVY-G55EFP
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Ensure your `DATABASE_URL` is set:
```env
DATABASE_URL="postgresql://neondb_owner:npg_veK8u4tojkfg@ep-flat-wildflower-azqg3rrt-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
NODE_ENV="development"
```

### 3. Install Dependencies

```bash
npm install --legacy-peer-deps
```

### 4. Setup Database & Seed Sample Data

```bash
# Push schema to database
npx prisma db push

# Seed sample tasks
npm run db:seed
```

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🧪 Testing & Quality Checks

Run the full quality verification suite locally:

```bash
# Run unit & schema tests
npm run test

# Run TypeScript type check
npm run type-check

# Run ESLint check
npm run lint

# Run production build
npm run build
```

---

## 📡 REST API Reference

Base URL: `/api`

| Method | Endpoint | Description | Status Codes |
|---|---|---|---|
| `GET` | `/tasks` | List tasks with search, filter, pagination, sorting | `200`, `400` |
| `POST` | `/tasks` | Create a new task | `201`, `400` |
| `GET` | `/tasks/:id` | Get task details by ID | `200`, `404` |
| `PATCH` | `/tasks/:id` | Update task fields or status | `200`, `400`, `404` |
| `DELETE` | `/tasks/:id` | Delete task | `204`, `404` |
| `GET` | `/dashboard/summary` | Aggregate counts: total, TODO, IN_PROGRESS, DONE | `200`, `500` |
| `GET` | `/health` | Health check and database connectivity | `200`, `503` |

---

## 🤖 AI Tool Usage

As outlined in the assessment guidelines:
- **Tools used**: Antigravity AI coding assistant.
- **Used for**: Scaffolding boilerplate Next.js structure, drafting initial PRD/Techstack documentation, configuring Vitest test setups, and debugging Prisma 6 configuration.
- **Reviewed and verified**: All schema definitions, database migrations, business services, React hooks, and edge cases were reviewed, verified, and confirmed against the test suite and production build.
