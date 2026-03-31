# syntax=docker/dockerfile:1.7

FROM node:20-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NEXT_TELEMETRY_DISABLED=1

RUN corepack enable

FROM base AS deps
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/student/package.json apps/student/package.json
COPY packages ./packages

RUN pnpm install --frozen-lockfile

FROM deps AS build
WORKDIR /app

COPY apps/student ./apps/student

RUN --mount=type=secret,id=vault_env \
    if [ -f /run/secrets/vault_env ]; then set -a; . /run/secrets/vault_env; set +a; fi && \
    pnpm --filter student build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=build /app /app

EXPOSE 3001

CMD ["node", "apps/student/node_modules/next/dist/bin/next", "start", "apps/student", "-p", "3001"]
