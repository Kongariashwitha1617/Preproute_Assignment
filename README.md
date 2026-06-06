# Preproute — Test Management

Admin web application for creating, managing, and publishing MCQ-based tests through the Preproute backend API.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Features](#2-features)
3. [Architecture](#3-architecture)
4. [Technology Stack](#4-technology-stack)
5. [Application Flow](#5-application-flow)
6. [State Management](#6-state-management)
7. [API Integration](#7-api-integration)
8. [Validation Strategy](#8-validation-strategy)
9. [Project Structure](#9-project-structure)
10. [Development Setup](#10-development-setup)
11. [Production Build & Deployment](#11-production-build--deployment)
12. [Engineering Considerations](#12-engineering-considerations)
13. [Assumptions & Notes](#13-assumptions--notes)
14. [Future Improvements](#14-future-improvements)

---

## 1. Project Overview

### Description

Preproute Test Management is a single-page admin application that enables moderators to authenticate, configure tests, attach MCQ questions, and publish or schedule tests for student availability on the Preproute platform.

### Business Purpose

The application supports the content lifecycle for academic assessments:

- Configure test metadata (subject, topics, marking scheme, duration)
- Author and manage question banks per test
- Review a complete test before release
- Publish immediately or schedule a future go-live date

### Key User Workflows

| Workflow | Summary |
|----------|---------|
| **Authenticate** | Admin signs in with credentials; session persists across refresh |
| **Monitor** | Dashboard shows aggregate test counts by status |
| **Track tests** | Test Tracking lists all tests with search, filter, edit, view, delete |
| **Create test** | Three-step wizard: Test Details → Questions → Preview & Publish |
| **Edit test** | Existing tests can be updated; draft tests can be published via the same wizard |
| **Publish** | Publish now or schedule with expiry configuration |

### Workflow Overview

```
Login → Dashboard / Test Tracking
              │
              ├── Create New Test
              │        │
              │        ▼
              │   Test Details (Step 1)
              │        │
              │        ▼
              │   Add Questions (Step 2)
              │        │
              │        ▼
              │   Preview & Publish (Step 3)
              │        │
              │        ▼
              │   Test Tracking (scheduled / live)
              │
              └── Edit / View existing test
```

---

## 2. Features

### Authentication

- Login form with client-side validation
- JWT-based session stored in persisted Zustand store
- Protected routes for all application pages except `/login`
- Automatic logout and redirect on `401 Unauthorized`
- Session survives page refresh

### Test Management

- Create and edit tests with cascading subject → topic → sub-topic selectors
- Test types: chapterwise, mock, PYQ
- Configurable marking scheme, duration, marks, and question count
- Save as Draft or proceed to question authoring
- Delete tests with confirmation dialog

### Question Management

- Add, edit, and delete MCQ questions per test
- Fields: question text, four options, correct answer, explanation, difficulty, topic, sub-topic, optional media URL
- Bulk create and individual update via API on save
- Minimum one question required before continuing
- Question list with inline edit/delete actions

### Preview & Publish

- Full test summary with marking scheme and question review
- Correct answers highlighted in preview
- Publish Now with confirmation dialog
- Schedule Publish with date, time, and live-until options
- Status-aware UI: publish controls only for `draft` and `unpublished` tests

### Search and Filtering

- Test Tracking supports text search by test name
- Filter by status: all, draft, scheduled, live, unpublished

### Draft and Publish Workflows

| Status | Behavior |
|--------|----------|
| `draft` | Full edit flow; publish or schedule from Preview |
| `unpublished` | Same publish controls as draft |
| `scheduled` | View-only on Preview; edits preserve scheduled status when using Next (not Save as Draft) |
| `live` | View-only on Preview; no re-publish |

---

## 3. Architecture

### Feature-Based Structure

The codebase is organized by **feature domain** (`auth`, `tests`, `questions`) rather than by file type. Each feature owns its pages, feature-specific components, and schemas. Shared concerns live in `components/`, `hooks/`, `services/`, and `lib/`.

This keeps related logic co-located and makes it straightforward to extend or isolate features without cross-cutting changes.

### Separation of Concerns

| Layer | Responsibility |
|-------|----------------|
| **Pages** | Route-level composition, user interaction, navigation |
| **Hooks** | React Query wrappers — caching, loading/error states, mutations |
| **Services** | Typed HTTP calls; no UI or state logic |
| **Stores** | Client-only state (auth session, question drafts) |
| **Components** | Reusable, presentational UI with minimal business logic |
| **Types / Schemas** | DTOs and runtime validation contracts |

Data flows in one direction:

```
Page → Hook → Service → Axios Client → API
         ↓
      Zustand (client state)
```

### Reusable Component Strategy

Shared UI primitives live in `src/components/ui/` (Button, Input, Select, MultiSelect, Modal, Table, Badge, etc.). These are:

- **Presentational** — accept props, no direct API calls
- **Composable** — used across features without feature-specific imports
- **Consistent** — shared styling via Tailwind utility classes and design tokens in `index.css`

Layout components (`AppLayout`, `Sidebar`, `StepIndicator`, `Breadcrumbs`) provide the application shell and wizard navigation.

---

## 4. Technology Stack

| Technology | Role | Rationale |
|------------|------|-----------|
| **React 19** | UI library | Component model, ecosystem maturity, concurrent features |
| **TypeScript** | Language | Compile-time safety across API contracts and form models |
| **Vite 8** | Build tool | Fast HMR, native ESM, minimal configuration |
| **React Router 7** | Routing | Declarative routes, nested layouts, protected route pattern |
| **TanStack Query 5** | Server state | Caching, deduplication, retries, mutation lifecycle |
| **Zustand 5** | Client state | Lightweight store for auth persistence and question drafts |
| **React Hook Form** | Forms | Performant forms with minimal re-renders |
| **Zod 4** | Validation | Schema-first validation shared between forms and types |
| **Axios** | HTTP client | Interceptors, timeout, structured error handling |
| **Tailwind CSS 3** | Styling | Utility-first CSS with responsive breakpoints |
| **Sonner** | Notifications | Non-blocking toast feedback for mutations |
| **Lucide React** | Icons | Consistent icon set |

---

## 5. Application Flow

### Routes

| Route | Page | Description |
|-------|------|-------------|
| `/login` | Login | Public entry point |
| `/dashboard` | Dashboard | Status summary cards (total, draft, scheduled, live, unpublished) |
| `/test-tracking` | Test Tracking | Searchable, filterable test list with actions |
| `/tests/create` | Test Form | Step 1 — create new test |
| `/tests/:id/edit` | Test Form | Step 1 — edit existing test |
| `/tests/:id/questions` | Questions | Step 2 — question authoring |
| `/tests/:id/preview` | Preview | Step 3 — review and publish |

### Step-by-Step Flow

**Login** → Redirect to Dashboard.

**Dashboard** → Overview metrics; navigate to Test Tracking or create a new test.

**Test Tracking** → View, edit, or delete tests. Create New Test starts the wizard.

**Create / Edit Test** → Fill test metadata. Save as Draft returns to Test Tracking. Next proceeds to Questions.

**Question Management** → Add questions, edit inline, delete. Save & Continue persists to API and navigates to Preview.

**Preview & Publish** → Review test and questions. Publish Now or Schedule Publish. Scheduled and live tests show read-only preview.

---

## 6. State Management

State is split by ownership — server data vs. client-only data.

### Authentication State (Zustand + persist)

- Store: `src/stores/authStore.ts`
- Holds JWT token, user object, and `isAuthenticated` flag
- Persisted to `localStorage` so sessions survive refresh
- Cleared on explicit logout or `401` response

### Question Draft State (Zustand)

- Store: `src/stores/questionDraftStore.ts`
- Manages in-memory question list during Step 2 authoring
- Supports add, update, remove before bulk save to API
- Not persisted — cleared when navigating away or after successful save

### Server State (React Query)

- Hooks in `src/hooks/` wrap all API reads and writes
- Query keys scoped by domain (`tests`, `questions`, subjects/topics)
- Default `staleTime: 30s`, retry up to 2 times (skipped on 401)
- Mutations invalidate relevant queries on success
- Batch operations suppress per-item toasts; a single summary toast is shown instead

---

## 7. API Integration

### Axios Client

Centralized in `src/lib/api/client.ts`:

- Base URL from `VITE_API_BASE_URL` environment variable
- 30-second request timeout
- JSON content type by default

### Request Interceptor

Attaches `Authorization: Bearer <token>` from `localStorage` on every request when a token exists.

### Response Interceptor

On `401`:

1. Clears token and user from storage
2. Redirects to `/login` if not already there

### Error Handling Strategy

`getErrorMessage()` normalizes errors for user-facing display:

| Source | Handling |
|--------|----------|
| Network failure | Friendly connectivity message |
| Validation errors | First server validation message |
| API message | `response.data.message` |
| Fallback | Generic error string |

Errors surface via Sonner toasts in mutation `onError` handlers and inline `ErrorState` components on query failures.

### Service Layer

Each domain has a dedicated service (`authService`, `testService`, `questionService`, `subjectService`) that calls `apiClient` with typed request/response models. Pages never call Axios directly.

---

## 8. Validation Strategy

### Form Validation

React Hook Form + Zod resolver on all major forms:

| Form | Schema |
|------|--------|
| Login | `loginSchema` |
| Test details | `testFormSchema` |
| Questions | `questionSchema` |

Validation runs on submit; field-level errors render inline below inputs.

### Type Safety

- Strict TypeScript (`strict` mode)
- DTOs in `src/types/` mirror API request/response shapes
- Service functions typed end-to-end

### Runtime Validation

Zod schemas enforce constraints at form submission (required fields, min/max values, enum types). Server-side validation errors from the API are parsed and displayed via `getErrorMessage()`.

Additional client checks exist for workflow rules (e.g., minimum one question before Save & Continue, schedule date/time required for scheduled publish).

---

## 9. Project Structure

```
preproute-test-management/
├── public/                  # Static assets served as-is
├── src/
│   ├── app/
│   │   ├── router.tsx       # Route definitions and protected layout
│   │   └── providers.tsx    # QueryClient, Toaster
│   ├── components/
│   │   ├── auth/            # ProtectedRoute, ErrorBoundary
│   │   ├── brand/           # Logo
│   │   ├── layout/          # AppLayout, Sidebar, Header, StepIndicator
│   │   └── ui/              # Reusable UI primitives
│   ├── features/
│   │   ├── auth/
│   │   │   ├── pages/       # LoginPage
│   │   │   └── schemas/     # loginSchema
│   │   ├── tests/
│   │   │   ├── pages/       # Dashboard, TestTracking, TestForm, Preview
│   │   │   ├── components/  # PublishTestDialog, DeleteTestDialog
│   │   │   └── schemas/     # testFormSchema
│   │   └── questions/
│   │       ├── pages/       # QuestionsPage
│   │       ├── components/  # QuestionForm, QuestionList
│   │       └── schemas/     # questionSchema
│   ├── hooks/               # useAuth, useTests, useQuestions, useSubjects
│   ├── services/            # Typed API functions per domain
│   ├── stores/              # authStore, questionDraftStore
│   ├── types/               # auth, test, question, subject, api DTOs
│   ├── lib/
│   │   ├── api/             # Axios client, error helpers
│   │   ├── constants.ts     # App-wide constants
│   │   └── utils/           # resolveIds, format, scheduleUtils, subTopicFilter
│   ├── index.css            # Tailwind directives and design tokens
│   └── main.tsx             # Application entry
├── .env.example             # Environment variable template
├── vite.config.ts           # Vite config, path alias, dev proxy
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

### Folder Responsibilities

| Folder | Purpose |
|--------|---------|
| `app/` | Application bootstrap — routing and global providers |
| `components/` | Cross-feature UI and layout; no feature business logic |
| `features/` | Domain modules — each owns pages, local components, schemas |
| `hooks/` | React Query integration; bridge between pages and services |
| `services/` | HTTP layer; single place for API endpoint changes |
| `stores/` | Ephemeral and persisted client state only |
| `types/` | Shared TypeScript interfaces |
| `lib/` | Infrastructure utilities not tied to a feature |

---

## 10. Development Setup

### Prerequisites

- Node.js 18+
- npm 9+

### Quick Start

```bash
copy .env.example .env   # macOS/Linux: cp .env.example .env
npm install
npm run dev
```

Open the URL shown in the terminal (default: [http://localhost:5173](http://localhost:5173)).

> Run the app through Vite. Do not open `index.html` directly — React, routing, and Tailwind will not load.

> **Credentials:** Use admin credentials provided by your team or project owner. Do not commit credentials to the repository.

### Environment Variables

Copy `.env.example` to `.env` and configure:

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Backend API base URL or local proxy path |

**Local development** — use the proxy path to avoid CORS:

```env
VITE_API_BASE_URL=/api
```

Configure the Vite dev proxy target in `vite.config.ts` to forward `/api` to your backend.

**Direct API access** — set the full API URL when not using the dev proxy.

Never commit `.env`. Use `.env.example` as the template.

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Type-check (`tsc`) + production build to `dist/` |
| `npm run preview` | Serve `dist/` locally after build |

---

## 11. Production Build & Deployment

### Build

```bash
npm run build
```

Output is written to `dist/`. The build runs TypeScript compilation before Vite bundling.

### Environment Configuration

Set `VITE_API_BASE_URL` to the target API URL **before** building. Vite inlines env variables at build time — they cannot be changed after build without rebuilding.

### Deployment Notes

| Requirement | Detail |
|-------------|--------|
| **Hosting type** | Static SPA (Netlify, Vercel, S3 + CloudFront, Nginx, etc.) |
| **Routing** | Configure fallback to `index.html` for client-side routes |
| **HTTPS** | Required for production API calls |
| **CORS** | Backend must allow the deployed origin, or serve API on same domain |

### Example Deploy Flow

1. Set `VITE_API_BASE_URL` for the target environment
2. Run `npm run build`
3. Upload `dist/` contents to static host
4. Configure SPA redirect rules
5. Verify login, test creation, and publish against the target API

---

## 12. Engineering Considerations

### Scalability

- Feature-based modules allow independent growth per domain
- React Query caching reduces redundant API calls as test lists grow
- Service layer isolates API changes from UI

### Maintainability

- Strict typing and Zod schemas document contracts at compile time and runtime
- Single Axios client and error helper avoid duplicated HTTP logic
- Consistent hook pattern (`useTests`, `useQuestions`) for predictable data access

### Reusability

- UI component library shared across all features
- Generic hooks and services reusable for new entities (e.g., users, reports)

### Performance

- React Hook Form minimizes re-renders on large forms
- Query `staleTime` prevents excessive refetching
- Vite code-splitting ready; current bundle is a single chunk suitable for admin-scale traffic

### Accessibility

- Semantic HTML in forms and tables
- `aria-label` on icon-only action buttons
- Keyboard-navigable form controls via native inputs

### Responsive Design

- Desktop-first admin layout with sidebar navigation
- Test Tracking table on desktop; card layout on mobile
- Forms and preview adapt to tablet and mobile breakpoints

---

## 13. Assumptions & Notes

| Assumption | Detail |
|------------|--------|
| **Single admin role** | No role-based access control; all authenticated users have full access |
| **API availability** | Backend is reachable and returns documented response shapes |
| **JWT auth** | Token returned on login; no refresh-token flow implemented |
| **Sub-topics required** | Backend rejects empty `sub_topics` array on test save |
| **Question topic fields** | API expects topic/sub-topic **names**, not UUIDs |
| **Subject/topic naming** | Display names may differ from API data; resolution handled in service layer |
| **Sub-topic endpoint** | `GET /sub-topics/topic/:id` may be unavailable; app falls back to `POST /sub-topics/multi-topics` |
| **Schedule publish** | `expiry_date` must be a valid ISO date; null is rejected by API |
| **Test statuses** | Publish UI gated on client by `draft` / `unpublished` status |

---

## 14. Future Improvements

| Area | Enhancement |
|------|-------------|
| **Testing** | Unit tests for utilities and schemas; integration tests for critical flows (login, create test, publish) |
| **CI/CD** | GitHub Actions pipeline: lint, type-check, build, deploy preview |
| **Environment config** | Move dev proxy target to env variable; remove hardcoded fallback in API client |
| **Auth** | Refresh token rotation; token expiry handling before 401 |
| **Error monitoring** | Sentry or similar for production error tracking |
| **Optimistic updates** | Optimistic UI for question edit/delete before server confirmation |
| **Code splitting** | Route-level lazy loading to reduce initial bundle size |
| **E2E tests** | Playwright coverage for full wizard flow |
| **Accessibility audit** | WCAG 2.1 AA compliance review with axe or Lighthouse |
| **Reschedule / unpublish** | UI for changing schedule or unpublishing live tests (if API supports) |

---

## License

Private — assignment / internal use. Update as appropriate for your organization.
