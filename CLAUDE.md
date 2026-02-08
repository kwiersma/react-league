# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Fantasy football draft management web app (React + TypeScript). Frontend for a Django backend (`djleague`) that provides REST APIs at `/api2/*`. Real-time draft updates via Pusher.js WebSockets.

## Commands

- **Dev server**: `npm start` (Vite, port 5173, proxies `/api2` to `http://127.0.0.1:8000`)
- **Build**: `npm run ci-build` (type-check + bundle; `npm run build` also copies output to the Django project)
- **Test**: `npm test` (Vitest, watch mode) or `npm run ci-test` (single run)
- **Lint**: `npm run lint` (ESLint with auto-fix)
- **Format**: `npm run format` (Prettier)
- **Run single test**: `npx vitest run src/path/to/file.test.tsx`

## Architecture

**State management**: App.tsx is a class component that holds all global state (teams, players, picks). State is prop-drilled to child components. No Redux or Context.

**Real-time updates**: Pusher.js subscribes to `draftedPlayers` channel. When `playerDrafted` events arrive, App updates picks and players in state and shows a toast notification.

**API layer** (`src/api/index.ts`): Module-scoped cache for teams and players (fetched once). Picks are always fetched fresh. All requests use `credentials: 'include'`. Exports `draftAPI` object with `getFantasyTeams`, `getPlayers`, `getPicks`, `savePlayer`.

**Data models** (`src/model/index.ts`): Three TypeScript classes — `FantasyTeam`, `Player`, `Pick` — with public properties matching the Django API response shape.

**Routing**: React Router v6. Routes under `/draft2/` — `players` (default), `teams`. All other paths redirect to `/draft2/players`.

**UI**: Bootstrap 5 + React-Bootstrap. Dark mode via `data-bs-theme` attribute on `<html>`. Player table uses `react-data-table-component`. Draft pick animations use `react-flip-move`.

## Code Style

- Prettier: 110 char width, single quotes, 2-space indent, trailing commas
- ESLint enforces import ordering (grouped, alphabetized with newlines between groups) and no import cycles
- `@typescript-eslint/no-explicit-any` is disabled
- React class components are used throughout (not hooks)
