# Repository Guidelines

## Project Structure & Module Organization
- Monorepo managed by Turborepo + pnpm (`pnpm-workspace.yaml`); apps live in `apps/` and shared code in `packages/`.
- `apps/web` (landing), `apps/student` (student portal), `apps/admin` (admin shell) are Next.js 15 projects that consume shared packages.
- `packages/ui` (tsup-built component library), `packages/shared` (Zustand store + domain types), `packages/utils` (Axios client, env helpers), `packages/config-tailwind` (Tailwind CSS 4 preset).
- Root configs: `turbo.json` for pipelines, `biome.json` for lint/format, `.env.*` for environment values injected by `dotenv-cli`.

## Build, Test, and Development Commands
- Install once: `pnpm install`.
- Run all apps in dev with shared env: `pnpm dev` (turbo runs `dev` in each package).
- Production-like dev: `pnpm dev:prod` (loads `.env.production`).
- Build all targets: `pnpm build`; run lint: `pnpm lint`; auto-fix lint: `pnpm lint:fix`; format: `pnpm format`; auto-format: `pnpm format:fix`.
- Target a single package/app: `pnpm --filter web dev`, `pnpm --filter student build`, `pnpm --filter ui build`, etc.

## Coding Style & Naming Conventions
- Language: TypeScript; Framework: Next.js App Router; Styling: Tailwind CSS preset from `config-tailwind`.
- Biome enforces formatting/linting; run before commits (`pnpm lint`/`pnpm format`).
- Components and hooks: `PascalCase` for components, `camelCase` for functions/variables, `kebab-case` for route folders; keep co-located styles/assets under the component directory.
- Prefer shared UI/state/utils packages over duplicating code; import from `ui`, `shared`, `utils` via workspace aliases.

## Testing Guidelines
- Root `test` script currently placeholder; no automated suite is wired yet.
- When adding tests, place unit/component specs beside code as `*.test.ts(x)`; consider React Testing Library for components and Playwright for e2e.
- Keep mock data in `src/__mocks__` per app; ensure new commands are added to Turbo/pnpm scripts for consistency.

## Commit & Pull Request Guidelines
- Follow existing history style: `<type> : <subject>` (e.g., `feat : add onboarding flow`, `fix : header style`). Use imperative, keep under ~72 chars.
- Commits should be small and scoped; include lint/format fixes in the same commit when practical.
- Pull Requests: include a concise summary, screenshots/GIFs for UI changes, steps to reproduce/test, and reference issue numbers. Ensure `pnpm lint` and relevant `pnpm --filter <target> build` run clean before requesting review.

## Environment & Security Tips
- Use root `.env.local` for development and `.env.production` for builds; apps load them via `dotenv -e ../../.env.*`.
- Do not commit secrets; copy from `.env.example` and keep sensitive keys in local or CI secrets.
- If adding new env variables, document them in `.env.example` and note which apps/packages consume them.
