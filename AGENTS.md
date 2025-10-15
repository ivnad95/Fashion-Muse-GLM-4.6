# Repository Guidelines

## Project Structure & Module Organization
The app follows the Next.js App Router layout under `src/app`, where each feature packages its `page.tsx`, loaders, and route handlers. Shared UI lives in `src/components`, with shadcn-derived primitives isolated in `src/components/ui`. Cross-cutting logic belongs in `src/hooks` and `src/lib` (for example, the Socket.IO setup referenced by `server.ts`). Static assets reside in `public/`, while integration samples live in `examples/`. Database schema and local SQLite files are maintained in `prisma/schema.prisma` and `db/`; update both together when evolving persistence. Configuration files (`next.config.ts`, `tailwind.config.ts`, `ecosystem.config.js`) should stay in the repo root to keep deployment scripts (`deploy.sh`, `docker-compose.yml`, `Dockerfile`, `nginx.conf`) working without edits.

## Build, Test, and Development Commands
- `npm run dev` – Starts the Nodemon-based dev server (`server.ts`) with Socket.IO; tail the generated `dev.log` when debugging.
- `npm run build` – Produces the Next.js production bundle (`.next/`); run after schema changes to surface type breakage.
- `npm start` – Launches the production Node server via `tsx`, piping output to `server.log`.
- `npm run lint` – Executes `next lint` using the flat config in `eslint.config.mjs`; keep the tree warning-free even though many rules are relaxed.
- `npm run db:push | db:migrate | db:reset | db:generate` – Prisma workflows targeting `prisma/schema.prisma` and the bundled SQLite databases. Always back up `db/custom.db` before resetting.

## Coding Style & Naming Conventions
Write new code in TypeScript with 2-space indentation and strict null handling despite permissive lint rules. Use PascalCase for React components, camelCase for hooks (`useSomething`) and utility helpers, and SCREAMING_SNAKE_CASE for environment constants. Prefer the `@/` path alias (declared in `tsconfig.json`) over relative imports once you cross a folder boundary. Compose styles with Tailwind utilities; keep class lists concise and prefer extracting shared patterns into `src/components/ui`. Console logging is allowed but should be gated by `process.env.NODE_ENV`.

## Testing Guidelines
Formal unit tests are not yet configured; when adding them, colocate `.test.ts(x)` files beside the unit under test and wire them through Vitest or Testing Library before submitting the PR. Until then, rely on `npm run lint` plus manual QA for interactive flows (drag-and-drop, sockets). When you touch Prisma models or authentication, document manual verification steps in the PR and update any seeds kept in `prisma/`.

## Commit & Pull Request Guidelines
Use concise, imperative commit messages (e.g., `Add avatar upload modal`) and group related schema changes with their generated artifacts. Each PR should describe intent, list testing performed, and call out migrations, new environment variables, or external service setup (see `GEMINI_SETUP.md` and `GOOGLE_SIGNIN_SETUP.md`). Attach UI screenshots or GIFs when you alter visible components. Before requesting review, run `npm run lint`, apply pending migrations, and ensure deployment guides remain accurate (update `DEPLOYMENT.md` if tooling changes).

## Environment & Deployment Notes
Store secrets in `.env.local`; never commit them. Align `PORT` and `HOSTNAME` with the expectations in `server.ts` when running behind Docker or PM2 (`ecosystem.config.js`). For container builds, prefer `deploy.sh` or `docker-compose.yml` so the custom Socket.IO server and Nginx config stay in sync. If you introduce new third-party APIs, document required keys in `README.md` and validate rate limits before shipping.
