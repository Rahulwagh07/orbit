# Orbit

Orbit is a cloud computer: you open Chromium, VS Code, or a terminal in a browser tab, and each one runs in its own Docker container streamed back to you over WebRTC.

Status: working prototype under active development. The sign-in, launch, and stream loop runs end to end; expect rough edges.

## Run it locally

You need Bun, Docker, and a Google OAuth client (ID + secret).

```sh
cp .env.example .env.local
docker compose -f docker/docker-compose.yml --env-file .env.local up -d
bun install
cd packages/db && bun run migrate && cd ../..
turbo dev
```

Fill in `JWT_SECRET` and the Google credentials in `.env.local` first, or nothing boots. In the Google Cloud console, register the redirect URI as `<NEXT_PUBLIC_APP_URL>/api/auth/google/callback`.

## Stack

Next.js + TypeScript in a Turborepo (Bun workspaces), Postgres 17, Redis 7, Prisma, Tailwind. `apps/web` is the UI and the control-plane API; `apps/worker` drives Docker containers off a Redis queue; `apps/gateway` relays WebRTC signaling.

See `docs/architecture.md` for how this is put together.
