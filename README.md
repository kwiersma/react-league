# react-league

Fantasy football draft management frontend built with React + TypeScript + Vite. Connects to a Django backend (`djleague`) via REST APIs at `/api2/*` with real-time draft updates via Pusher.js WebSockets.

## Requirements

- Node.js
- A running `djleague` Django backend (for API calls and authentication)

## Development

Install dependencies:

```bash
npm install
```

Start the dev server (port 5173, proxies `/api2` to `http://127.0.0.1:8000`):

```bash
npm start
```

## Key Commands

| Command | Description |
|---|---|
| `npm start` | Start Vite dev server on port 5173 |
| `npm test` | Run Vitest in watch mode |
| `npm run ci-test` | Run tests once (CI mode) |
| `npm run ci-build` | Type-check and build for production |
| `npm run build` | Build and copy output to the Django project |
| `npm run lint` | Lint with ESLint (auto-fix) |
| `npm run format` | Format with Prettier |

## Tech Stack

- **Build**: [Vite](https://vitejs.dev/)
- **Testing**: [Vitest](https://vitest.dev/)
- **UI**: React + TypeScript, Bootstrap 5, React-Bootstrap
- **Real-time**: Pusher.js
- **Routing**: React Router v6
- **Tables**: react-data-table-component
- **Animations**: react-flip-move
