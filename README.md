# Pax Group Global Website

Modern marketing site and customer portal for Pax Group Global built with React 19 and Vite. The project uses Tailwind CSS for styling, React Router for client-side navigation, and a lightweight language context to power Turkish/English content.

## Getting started

1. Install dependencies (Node 18+ recommended):
   ```bash
   npm install
   ```
2. Run the development server with hot reload:
   ```bash
   npm run dev
   ```
3. Create a production build:
   ```bash
   npm run build
   ```
4. Preview the production build locally:
   ```bash
   npm run preview
   ```

## Project structure

- `src/App.jsx` – Root layout with navigation, footer, landing content, and route definitions for marketing pages, blog, solutions, pricing, and the dashboard shell.
- `src/main.jsx` – Vite entry that mounts the app and wraps it with the `LanguageProvider`.
- `src/LanguageContext.jsx` – Centralized translations and helper hooks for toggling between Turkish (`tr`) and English (`en`).
- `src/pages` – Dashboard and utility pages (calendar, overview, settings, etc.).
- `src/layouts/DashboardLayout.jsx` – Sidebar + main content shell used for authenticated routes.
- `src/components` – Shared UI pieces such as cards, lists, forms, and hero sections.
- `public/` – Static assets including the logo and localized hero images.

## Routing and authentication

Client-side routing is handled by `react-router-dom`. Marketing routes (e.g., `/`, `/cozumler`, `/fiyatlar`, `/blog`) are publicly accessible. Dashboard routes are nested under `/panel` and are guarded by `ProtectedRoute` to redirect unauthenticated users to the login page.

## Localization workflow

All copy and language-aware image paths live in `src/LanguageContext.jsx` under the `translations` object. To add or update content:

1. Add the new key/value pairs to both `tr` and `en` objects so the UI stays in sync across languages.
2. Read translations via the `useLanguage()` hook, which returns `{ language, toggleLanguage, t }`.
3. For new pages or components, reference `t.some.sectionKey` instead of hard-coding strings. This keeps the navbar, hero, forms, and CTA buttons automatically bilingual.

## Styling

Tailwind CSS is configured via `tailwind.config.js` and `postcss.config.js`. Utility classes are applied directly in JSX, and `App.css`/`index.css` contain global resets and glassmorphism helpers used across the landing page.

## Scripts

- `npm run dev` – Start the Vite dev server.
- `npm run build` – Generate an optimized production bundle.
- `npm run preview` – Serve the production bundle locally.
- `npm run lint` – Run ESLint with the project rules.

