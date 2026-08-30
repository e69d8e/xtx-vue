# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

小兔鲜 (Xiao Tu Xian) — a Chinese e-commerce frontend SPA built with Vue 3 + Vite + Element Plus + Pinia.

**Backend API (dev/test):** `http://pcapi-xiaotuxian-front-devtest.itheima.net`. In dev, requests hit `/api/...` and Vite's proxy (in `vite.config.js`) forwards them to the backend, stripping the `/api` prefix. `src/utils/request.js` uses `baseURL: '/api'`, so the proxy is what makes the app work — do not remove it.

## Environment & Commands

| Command | Action |
|---|---|
| `pnpm install` | Install dependencies (also runs `husky install` via `prepare`) |
| `pnpm approve-builds` | **Required after first install** — authorizes native builds for `esbuild`, `vue-demi` (otherwise dev/build fail with native-binding errors) |
| `pnpm dev` | Start Vite dev server with HMR |
| `pnpm build` | Production build |
| `pnpm preview` | Preview production build locally |
| `pnpm lint` | Run ESLint with auto-fix on `.vue`, `.js`, `.jsx`, `.cjs`, `.mjs` |
| `pnpm format` | Run Prettier on `src/` |

**Requirements:** Node.js ≥ 18, pnpm ≥ 8.

**No test framework is configured** — there are no test scripts or testing dependencies. Do not add tests without first wiring up Vitest or similar.

## Architecture

**Stack:** Vue 3.4 (Composition API + `<script setup>`) / Vue Router 4 / Pinia / Element Plus / Axios / SCSS / Vite 5

**Package manager:** pnpm. `pnpm-workspace.yaml` only disables native builds for `esbuild`/`vue-demi` — this is a single-package project, not a monorepo.

### Data Flow

1. **API layer** (`src/apis/*.js`) — thin Axios call wrappers; each file groups one domain (`home`, `login`, `cart`, `cate`, `order`, `product`, `address`, `user`).
2. **HTTP client** (`src/utils/request.js`) — Axios instance with request interceptor (Bearer token from Pinia user store) and response interceptor (rejects + toasts on non-`1` business codes; on HTTP 401 redirects to `/login`; on other HTTP errors toasts the server message and rejects).
3. **State management** (`src/stores/`) — Pinia stores using `pinia-plugin-persistedstate` (localStorage). Store IDs in this repo are inconsistent (`cart`, `xxt-cate`, `xtx-user`) — keep the existing ID when editing a store, do not "fix" it without a migration story.
4. **Views** (`src/views/`) — page components mapped to routes; one folder per route.
5. **Components** (`src/components/`) — shared components. `XtxSku/` is a subdirectory containing the SKU selector (`index.vue`) plus `power-set.js` (the bit-mask variant-combination algorithm).

### Route Structure

Top-level layout (`src/views/layout/index.vue`) renders header + `<RouterView>`:

- `/home`, `/category/:id`, `/subcategory/:id`, `/product/:id`, `/cart`, `/order`, `/pay`
- `/user` (redirects to `/user/message`) → `/user/message`, `/user/userorder`
- `/login`, `/paycallback`

`scrollBehavior` always returns `{ top: 0 }`. Guards in `src/router/index.js` enforce: must be logged in for non-`/login` routes (else `ElMessage.warning('请先登录')` + redirect); `/paycallback` only reachable from `/order`; `/home` is open.

### Key Patterns

- **Auto-imports:** Element Plus components and APIs via `unplugin-vue-components` + `unplugin-auto-import` (configured in `vite.config.js`) — do not add manual `import` statements for Element Plus in app code.
- **Element Plus locale:** `zhCn` is registered globally in `main.js`.
- **Styling:** SCSS with Element Plus theme overrides via `additionalData` in `vite.config.js` (auto-injects `@use "@/styles/element/index.scss" as *;` into every SCSS file — primary color `#27ba9b`). Global reset in `src/styles/common.scss`.
- **Custom directive:** `v-img-lazy` — IntersectionObserver-based image lazy load using `@vueuse/core`, installed as a Vue plugin in `src/directive/index.js` (`app.use(lazyPlugin)` in `main.js`).
- **Path alias:** `@/*` → `./src/*` (both `vite.config.js` and `jsconfig.json`).

### Conventions

- All Vue components use `<script setup>` with Composition API.
- Pinia stores use the setup-function pattern with `{ persist: true }` for localStorage persistence.
- API functions are async and return the Axios response object directly (callers read `.data.result`).
- ESLint/Prettier rules: single quotes, no semicolons, 80-char print width, `endOfLine: 'auto'`, no trailing commas. `vue/multi-word-component-names` ignores `index`. `vue/no-setup-props-destructure` is off.
- Pre-commit hook (`.husky/pre-commit`) runs `pnpm lint-staged`, which executes `eslint --fix` on staged `*.{js,ts,vue}` files (no separate Prettier step).

### Footguns

- `src/utils/request.js` invokes `useRouter()` and `useUserStore()` at module top level. This works today only because the module is imported inside Vue contexts; do not copy this pattern into new files. In a fresh component or non-Vue module, those hooks must be called inside `setup()` or a function that runs in a Vue context.
- The Element Plus SCSS override (`src/styles/element/index.scss`) is injected via `additionalData`, so every `.vue`/`.scss` file pays the cost — keep the file minimal.
