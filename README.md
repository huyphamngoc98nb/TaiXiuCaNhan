# Expense Tracker App

A local-first, offline-ready expense tracker packaged for Android using Capacitor.

## Project Structure

This project follows a domain-driven architecture:
- `src/app/`: Application shell, providers, layouts, and routing.
- `src/shared/`: Shared UI components, global constants, and utility functions.
- `src/core/`: Infrastructure code (e.g., telemetry logger, DB configurations).
- `src/modules/`: Business domains (e.g., transactions, settings, categories). Each module encapsulates its own UI, state, and domain logic.
- `src/tests/`: Global test configuration.

## Current Implemented Scope
- **Phase 1 Bootstrap & Refinement**
  - React + Vite + TypeScript initialized.
  - Prettier and ESLint configured.
  - Capacitor initialized with Android platform.
  - App folder structure scaffolded.
  - Basic minimal bottom navigation layout (`MainLayout`).
  - App bootstrap mock sequence with Loading and Error states.
  - Basic shared UI components (`LoadingScreen`, `ErrorScreen`, `EmptyState`).
  - Telemetry logger and environment configuration boilerplate.

## Local Development & Run Commands

**1. Install dependencies:**
```bash
npm install
```

**2. Setup SQLite for Web Development (Required for local dev):**
Because `@capacitor-community/sqlite` uses `jeep-sqlite` on the web, you must copy the WebAssembly file into your public directory so the browser can load it.
```bash
# On Windows PowerShell:
New-Item -ItemType Directory -Force -Path "public/assets"
Copy-Item "node_modules/sql.js/dist/sql-wasm.wasm" -Destination "public/assets/sql-wasm.wasm"
```

**3. Run Development Server:**
```bash
npm run dev
```

## Android Sync & Build

To package your app for Android, build the web assets first, then sync Capacitor:

**1. Build Web Bundle:**
```bash
npm run build
```

**2. Sync with Capacitor:**
```bash
npx cap sync android
```

**3. Open Android Studio:**
```bash
npx cap open android
```

## How to Verify SQLite is Working

1. Start the app locally using `npm run dev` (ensure you copied the `.wasm` file first).
2. The app should display "Loading..." briefly, then navigate to the Home screen.
3. Open the **Settings** tab.
4. You will see a **Developer Diagnostics** card at the bottom.
5. It should display **DB Initialized: ✅ Yes**, show the current Schema Version (e.g. 2), show the seeded category count (6), and indicate that all required tables were **✅ Found**.
6. If it fails, check your browser console for Jeep SQLite WebAssembly errors.

> [!WARNING]
> If you make changes to the migration `.sql` files, make sure to bump the migration version in `migration-runner.ts` so the engine knows to execute them.

