# Tomo Plan

A lightweight, offline-first task management desktop app built with Tauri 2, React 18, and SQLite. All data is stored locally on your device — no account or internet required.

## Features

- **Task Management** — Create, edit, delete tasks with title, description, priority, category, start date, and deadline
- **Status Tracking** — Three statuses: Todo, In Progress, Done (click the badge to cycle)
- **Priority Levels** — Low, Medium, High, Critical with color-coded badges
- **Categories** — Organize tasks by color-coded categories
- **Filtering** — Filter by status, priority, and free-text search
- **Persistent Storage** — SQLite database stored locally, survives app restarts
- **Responsive UI** — Works on desktop and mobile (slide-in sidebar drawer on narrow screens)
- **Cross-platform** — Linux, Windows, macOS, Android

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Tauri 2](https://tauri.app) + Rust |
| Frontend | React 18 + TypeScript |
| Styling | Tailwind CSS v4 |
| Database | SQLite via `tauri-plugin-sql` |
| Build tool | Vite |
| Package manager | pnpm |

## Prerequisites

- [Node.js](https://nodejs.org) 18+
- [pnpm](https://pnpm.io) 9+
- [Rust](https://rustup.rs) stable
- **Linux only:** system WebKit dependencies (see below)

```bash
# Linux — install system dependencies
sudo apt-get update
sudo apt-get install -y \
  libwebkit2gtk-4.1-dev \
  libappindicator3-dev \
  librsvg2-dev \
  patchelf
```

## Development

```bash
# Install dependencies
pnpm install

# Start development (opens native window with live reload)
pnpm tauri:dev

# Type check only
pnpm type-check
```

> **Note:** Always use `pnpm tauri:dev` for development — not `pnpm dev`.
> Running `pnpm dev` opens the app in a browser where Tauri APIs (database, etc.) are unavailable.

## Build

```bash
# Build for current platform
pnpm tauri:build
```

Output is in `src-tauri/target/release/bundle/`:

| Platform | Files |
|----------|-------|
| Linux | `deb/tomo-plan_x.x.x_amd64.deb`, `appimage/tomo-plan_x.x.x_amd64.AppImage` |
| Windows | `msi/tomo-plan_x.x.x_x64_en-US.msi`, `nsis/tomo-plan_x.x.x_x64-setup.exe` |
| macOS | `dmg/tomo-plan_x.x.x_x64.dmg`, `macos/tomo-plan.app` |

### Cross-platform Builds via GitHub Actions

Tauri does not support cross-compilation. To build for all platforms at once, push a version tag to trigger the GitHub Actions release workflow:

```bash
git tag v0.1.0
git push origin v0.1.0
```

This builds Linux + Windows + macOS in parallel and creates a GitHub Release draft with all installers attached. See [`.github/workflows/release.yml`](.github/workflows/release.yml).

## Project Structure

```
tomo-plan/
├── src/
│   ├── components/
│   │   ├── categories/       # CategoryBadge, CategoryForm, CategoryList
│   │   ├── layout/           # Header (with hamburger), Sidebar (drawer)
│   │   ├── tasks/            # TaskCard, TaskForm, TaskList, TaskModal
│   │   └── ui/               # Button, DatePicker, Input, Modal, Select, ...
│   ├── context/
│   │   ├── AppContext.tsx     # Context type + useAppContext hook
│   │   └── AppProvider.tsx   # State management + all CRUD actions
│   ├── lib/
│   │   └── db.ts             # SQLite singleton wrapper
│   ├── services/
│   │   ├── categoryService.ts
│   │   └── taskService.ts
│   ├── types/
│   │   └── index.ts          # TypeScript type definitions
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── src-tauri/
│   ├── capabilities/
│   │   ├── default.json      # Desktop permissions (sql:default + sql:allow-execute)
│   │   └── mobile.json       # Mobile permissions
│   ├── src/
│   │   └── lib.rs            # Rust entry point + SQLite migrations
│   └── tauri.conf.json
└── .github/
    └── workflows/
        └── release.yml       # Multi-platform CI/CD
```

## Database Schema

```sql
-- Categories
CREATE TABLE categories (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT NOT NULL UNIQUE,
  color      TEXT NOT NULL DEFAULT '#000000',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tasks
CREATE TABLE tasks (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  title       TEXT NOT NULL,
  description TEXT,
  status      TEXT NOT NULL DEFAULT 'todo',     -- todo | inprogress | done
  priority    TEXT NOT NULL DEFAULT 'Medium',   -- Low | Medium | High | Critical
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  start_time  DATETIME,
  deadline    DATETIME,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Scripts Reference

| Script | Description |
|--------|-------------|
| `pnpm tauri:dev` | Start development (native window, live reload) |
| `pnpm tauri:build` | Build production app for current platform |
| `pnpm tauri:android:init` | Initialize Android project (one-time) |
| `pnpm tauri:android:dev` | Android development (requires emulator or device) |
| `pnpm tauri:android:build` | Build Android APK |
| `pnpm type-check` | TypeScript type check without building |
| `pnpm build` | Build frontend only (Vite) |

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/)
- [Tauri extension](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode)
- [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
