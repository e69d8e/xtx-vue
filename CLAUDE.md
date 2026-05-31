# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

小兔鲜 (Xiao Tu Xian) — a Chinese e-commerce frontend SPA built with Vue 3 + Vite + Element Plus + Pinia.

## Commands

| Command | Action |
|---|---|
| `pnpm install` | Install dependencies |
| `pnpm dev` | Start Vite dev server with HMR |
| `pnpm build` | Production build |
| `pnpm preview` | Preview production build locally |
| `pnpm lint` | Run ESLint with auto-fix on `.vue`, `.js`, `.jsx`, `.cjs`, `.mjs` |
| `pnpm format` | Run Prettier on `src/` |

No test framework is configured — there are no test scripts or testing dependencies.

## Architecture

**Stack:** Vue 3.4 (Composition API + `<script setup>`) / Vue Router 4 / Pinia / Element Plus / Axios / SCSS / Vite 5

**Package manager:** pnpm. `pnpm-workspace.yaml` only disables native builds for esbuild/vue-demi — this is a single-package project, not a monorepo.

### Data Flow

1. **API layer** (`src/apis/*.js`) — thin Axios call wrappers targeting `http://pcapi-xiaotuxian-front-devtest.itheima.net`
2. **HTTP client** (`src/utils/request.js`) — Axios instance with request interceptor (Bearer token from Pinia user store) and response interceptor (checks response code, redirects to `/login` on 401)
3. **State management** (`src/stores/`) — Pinia stores with `pinia-plugin-persistedstate` (localStorage). Key stores: user login, cart, categories
4. **Views** (`src/views/`) — page components mapped to routes
5. **Components** (`src/components/`) — shared components including `XtxSku` (SKU selector using power-set algorithm for variant combinations)

### Route Structure

- `/` — Layout shell (header + `<RouterView>`)
  - `/home`, `/category/:id`, `/subcategory/:id`, `/product/:id`, `/cart`, `/order`, `/pay`, `/user/*`
- `/login`, `/paycallback`

### Key Patterns

- **Auto-imports:** Element Plus components and APIs are auto-imported via `unplugin-vue-components` and `unplugin-auto-import` — no manual imports needed for Element Plus
- **Styling:** SCSS with Element Plus theme overrides in `src/styles/element/index.scss` (primary color: `#27ba9b`). Global reset in `src/styles/common.scss`
- **Custom directive:** `v-img-lazy` — lazy image loading via IntersectionObserver (`@vueuse/core`), registered as a Vue plugin in `src/directive/index.js`
- **Path alias:** `@/*` maps to `./src/*` (configured in `jsconfig.json` and `vite.config.js`)

### Conventions

- All Vue components use `<script setup>` with Composition API
- Pinia stores use `defineStore` with the setup function pattern and enable `persist: true`
- API functions are async and return Axios response data directly
- Pre-commit hook (Husky + lint-staged) runs `eslint --fix` on staged files
