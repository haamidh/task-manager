# Task Manager

A small task manager with a NestJS REST API and a Next.js frontend.

- **`/api`**: NestJS 12, Prisma 7, SQLite, class-validator
- **`/web`**: Next.js 16 (App Router), shadcn/ui, TanStack Query, react-hook-form, zod

You can create, edit and delete tasks, filter them by status and sort them by due date.

## Prerequisites

- **Node.js 24** (developed and tested on 24.18). The dependencies also declare support for 20.19+ and 22.12+, but I have only run the project on 24.
- **npm** (bundled with Node.js). No other package manager is needed.
- Nothing to install for the database: SQLite is a local file that the setup step creates.
- **Docker** is optional, only for the Docker Compose route at the end.

## Run the project

You need two terminals: one for the API and one for the web app. Start the API first.

### 1. Clone

```bash
git clone https://github.com/haamidh/task-manager.git
cd task-manager
```

### 2. Start the API (terminal 1)

```bash
cd api
npm install
cp .env.example .env
npm run db:setup
npm run start:dev
```

`npm run db:setup` generates the Prisma client and creates the SQLite database file `api/dev.db` by applying the migrations. The API is ready when the log shows `Nest application successfully started`. It listens on http://localhost:3001.

### 3. Start the web app (terminal 2)

```bash
cd web
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

## Environment variables

The defaults in the example files work as they are; you only need to edit them if you change a port.

**`api/.env`**

| Variable | Default | Purpose |
|---|---|---|
| `DATABASE_URL` | `file:./dev.db` | Location of the SQLite file, relative to `/api` |
| `PORT` | `3001` | Port the API listens on |
| `CORS_ORIGIN` | `http://localhost:3000` | Origin of the web app, allowed to call the API |

**`web/.env.local`**

| Variable | Default | Purpose |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:3001` | URL the browser uses to reach the API |

## API

| Method | Path | Description | Success | Errors |
|---|---|---|---|---|
| `GET` | `/tasks` | List tasks | 200 | 400 invalid query |
| `GET` | `/tasks/:id` | Get one task | 200 | 404 |
| `POST` | `/tasks` | Create a task | 201 | 400 invalid body |
| `PATCH` | `/tasks/:id` | Update some fields of a task | 200 | 400, 404 |
| `DELETE` | `/tasks/:id` | Delete a task | 204 | 404 |

A task has `id`, `title` (required, up to 200 characters), `description` (optional), `status` (`TODO`, `IN_PROGRESS` or `DONE`, default `TODO`), `dueDate` (optional ISO 8601 date) and `createdAt`.

`GET /tasks` accepts optional query parameters:

- `status`: `TODO`, `IN_PROGRESS` or `DONE`
- `sort`: `createdAt` (default) or `dueDate`
- `order`: `asc` or `desc`

Example:

```bash
curl -X POST http://localhost:3001/tasks \
  -H 'Content-Type: application/json' \
  -d '{"title":"Write the README","status":"IN_PROGRESS","dueDate":"2026-12-01"}'

curl "http://localhost:3001/tasks?status=IN_PROGRESS&sort=dueDate"
```

Unknown fields and unknown query parameters are rejected with 400. In `PATCH`, sending `"description": null` or `"dueDate": null` clears that field.

## Run with Docker Compose (optional)

Instead of steps 2 and 3, from the repository root:

```bash
docker compose up --build
```

Then open http://localhost:3000. Ports 3000 and 3001 must be free. The database is stored in a Docker volume, so tasks survive restarts; `docker compose down -v` removes it.

## Project structure

```
api/
  prisma/              schema and migrations
  src/
    main.ts            bootstrap: validation pipe, CORS
    prisma/            PrismaService (database client)
    tasks/             controller, service and DTOs for the Task resource
web/
  app/                 layout, page and providers (App Router)
  components/tasks/    table, status badge, form dialog, delete dialog, toolbar
  components/ui/       shadcn/ui components
  hooks/use-tasks.ts   TanStack Query hooks for the API
  lib/                 API client, types, zod schema, date formatting
compose.yaml           runs both apps with Docker
```

## Notes and trade-offs

- **Filtering and sorting run in the API**, not in the browser. The toolbar only changes the query string.
- **Tasks without a due date sort last** in both directions, so dated tasks stay at the top.
- **Due dates are calendar days** stored as midnight UTC and displayed in UTC, so the day never shifts with the viewer's time zone.
- **No automated tests.** I verified the endpoints with `curl` and the interface in the browser.
- **No pagination or authentication**, as the brief did not ask for them.

## How I used AI

I built this with **Github Copilot** in VS Code.

**How I worked with it**

- I gave it the assignment brief and asked for a plan first, then built the project one step at a time. Each step is one commit in the history.
- After every step I read the code, ran it locally, and made the commit myself before moving on. If anything goes wrong I did a debugging on each step so that I was able to understand what went wrong.
- The assistant generated most of the code; the shadcn/ui components under `web/components/ui` come from the shadcn CLI.

**What was changed from the first generated version**

- **Prisma was pinned to 7.10.1.** A plain `npm install prisma` pulled an 8.0 release candidate, which was replaced with the stable release so the project runs reliably from a fresh clone.
- **`null` handling in validation was tightened.** `title` and `status` reject `null` with a 400 instead of reaching the database and failing with a 500, while `description` and `dueDate` accept `null` to clear the value.
- **The page font was fixed.** The generated CSS defined `--font-sans` in terms of itself, so the page fell back to a serif font.
- **The "Created" date was fixed** to use the viewer's time zone. It was first formatted in UTC and showed the previous day for me.
- **Toasts were moved to the bottom-right** because they covered the "New task" button at the top-right.
- **Errors from a failed save or delete are shown inside the dialog** rather than as a toast, so the dialog stays open and the action can be retried.
- **The scaffold's "Hello World" controller, service and tests were removed.**
