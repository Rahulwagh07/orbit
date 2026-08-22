# Spec: Adding a New App

Checklist for onboarding any new remote application (e.g. Brave Browser) into
the cloud OS. Every app flows through the same pipeline:

```
Dock button → POST /api/windows → Redis job → Worker → Docker container (WebRTC agent)
```

Use this spec as an ordered checklist. Each step references the file(s) that
must be modified and what to add.

---

## 0. Naming conventions

| Concept        | Value format                | Example (Brave)      |
| -------------- | --------------------------- | -------------------- |
| App id (lower) | lowercase string            | `brave`              |
| DB enum value  | UPPERCASE of app id         | `BRAVE`              |
| Docker image   | `infinity-<app-id>`         | `infinity-brave`     |
| Window class   | exact WM_CLASS of the app   | `Brave-browser`      |

Find the exact WM_CLASS by running `xprop WM_CLASS` on the app window, or via
`xdotool search --onlyvisible --class <class>` (this is what the runtime agent
uses to wait until the window is visible — a wrong class fails deployment).

## 1. Protocol — validate the app id

**File:** `packages/protocol/src/api.ts`

Add the app id to **both** zod enums:

```ts
// CreateWindowRequestSchema
application: z.enum(["chromium", "vscode", "terminal", "brave"])

// DeploymentJobSchema
application: z.enum(["chromium", "vscode", "terminal", "brave"]).optional()
```

## 2. Database — application type enum + migration

**File:** `packages/db/prisma/schema.prisma`

```prisma
enum ApplicationType {
  CHROMIUM
  VSCODE
  TERMINAL
  BRAVE
}
```

Create a migration (follow the pattern of
`20260816103035_add_vscode_app_type`):

```
packages/db/prisma/migrations/<timestamp>_add_<app-id>_app_type/migration.sql
```

```sql
-- AlterEnum
ALTER TYPE "ApplicationType" ADD VALUE 'BRAVE';
```

Apply it with `bun run migrate` from `packages/db`.

## 3. Control plane API — map app id to type/name

**File:** `apps/web/app/api/windows/route.ts`

Add an entry to `appTypeMap` in the `POST` handler:

```ts
const appTypeMap = {
  // ...
  brave: { type: 'BRAVE', name: 'Brave' },
}
```

The `GET` handler needs no changes (it derives everything from the DB).

## 4. Worker — deployment config (image + env)

**File:** `apps/worker/src/services/deployment.ts`

Add an `APP_CONFIG` entry. The image is started with `APP_COMMAND`,
`APP_WINDOW_CLASS` (and optionally `APP_EXECUTABLE`) env vars, which the
generic runtime agent uses to launch the app inside Xvfb/fluxbox:

```ts
const APP_CONFIG = {
  // ...
  brave: {
    image: "infinity-brave",
    env: { APP_COMMAND: "brave", APP_WINDOW_CLASS: "Brave-browser" },
  },
}
```

## 5. Docker image — runtime agent + app install

**File:** new `runtime/agent/Dockerfile.<app-id>` (see
`Dockerfile.vscode` as reference).

Rules:

- Base must be `FROM infinity-chromium` (Xvfb, fluxbox, ffmpeg, xdotool,
  node 18, WebRTC agent build steps). Never fork the base stack.
- Install the real desktop application — do not substitute downgraded or
  web-based variants.
- Set the same env vars as the worker config so local `docker run` works:
  `APP_COMMAND`, optionally `APP_EXECUTABLE`, `APP_WINDOW_CLASS`.
- If the app needs CLI flags, set `APP_EXTRA_ARGS` (comma-separated; parsed by
  the agent).
- Build from repo root:
  ```
  docker build -f runtime/agent/Dockerfile.<app-id> -t infinity-<app-id> .
  ```

## 6. UI Desktop — titles and launch types

**File:** `apps/web/components/Desktop.tsx`

- Add the display title to `APP_TITLES`.
- Widen the `'chromium' | 'vscode' | ...` unions in `handleLaunchApp` and the
  cast in `handleToggleAppWindows`.

## 7. UI Dock — icon + button

**File:** `apps/web/components/Dock.tsx`

- Add an inline `<AppId>SVG />` component following the existing icon style
  (`ChromeSVG` / `VSCodeSVG`). Use a high-quality vector rendition of the
  brand mark — gradients and paths only, no traced low-res raster sources.
  Gradient/filter ids must be unique across the document.
- Duplicate one dock item block: filter windows by the app id, compute
  minimized/active status dot, wire `onToggleAppWindows('<app-id>')`, and set
  the hover tooltip label.

## 8. Verify

1. `bun run check-types` and `bun run lint` at repo root.
2. Build the image: `docker build -f runtime/agent/Dockerfile.<app-id> -t infinity-<app-id> .`
3. Start infra (`docker/docker-compose.yml`), run web + worker.
4. Click the new dock icon: window appears, deployment phases stream through
   READY, and the app's window is interactive (mouse/keyboard over WebRTC).
