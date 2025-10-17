# Repository Guidelines

## Project Structure & Module Organization

The frontend is a Vite + React app in `src/`. Core views live under `src/pages`, reusable UI and layout pieces in `src/modules` and `src/sidebar`, and map utilities under `src/map` and `src/lib`. Dataset configuration lives in `src/config/...`, while state management uses Recoil atoms/selectors in `src/state`. Tests sit next to the code they cover (e.g., `src/modules/downloads/sections/datasets/dataset-indicator/status-logic/dataset-status.spec.ts`). Static assets go in `public/`. Generated artifacts land in `build/`; do not edit them manually. Ancillary docs live in `docs/`, and local proxy presets are in `dev-proxy/`.

## Build, Test, and Development Commands

Run `npm install` once per clone. `npm run start` launches the Vite dev server with hot reload. `npm run build` performs TypeScript checking then emits production bundles. `npm run serve` previews the built output. Quality gates: `npm run lint` (ESLint), `npm run test:type-check` (strict TypeScript), `npm run test` (Vitest in watch mode), and `npm run coverage` for instrumentation. Use `npm run format` before large refactors to normalize formatting.

## Coding Style & Naming Conventions

This repo uses TypeScript, React 18, and path aliases (`@/`) configured via Vite. Prettier (with sorted imports) enforces two-space indentation, single quotes, and trailing commas; let it format automatically. Keep React components and files that export components in PascalCase (e.g., `Nav.tsx`), hooks in camelCase starting with `use` (see `use-is-mobile.ts`), and shared state modules in camelCase filenames. Favor functional, memoized components and emotion/MUI styling patterns already in `src/modules`.

## Testing Guidelines

Vitest is the unit test runner; colocate `*.spec.ts` files with the module under test as shown in `src/modules/downloads/sections/datasets/dataset-indicator/status-logic/dataset-status.spec.ts`. Name suites after the domain concept rather than the implementation (e.g., `dataset-status`). Aim to accompany new selectors, hooks, and logic helpers with deterministic tests and keep coverage above the existing baseline by running `npm run coverage`. Mock network calls via the API client wrappers instead of touching real services.

## Commit & Pull Request Guidelines

Follow the existing log by writing short, imperative commit titles (`Ignore logs`, `Switch eslint...`). Keep related changes in a single commit and include brief body notes when context is not obvious. For each PR, link the relevant issue, summarize intent and testing steps, and attach screenshots or GIFs for UI-visible updates. Ensure lint, tests, and build succeed locally before requesting review.
