# AssetWave Frontend

Built with **Vite + React + React Router**. A multi-page marketing and marketplace site, designed to grow into the full product (checkout, dashboards, account management) described in the AssetWave technical documentation, without a rewrite.

## Quick start

```bash
npm install
npm run dev
```

## Pages

| Route | Page | Notes |
|---|---|---|
| `/` | Home | Hero, platform pillars, features, impact timeline, case studies, dashboard preview |
| `/about` | About | Vision, principles, team |
| `/features` | Features | Deep dive on verification, escrow, disputes, logistics |
| `/impact` | Impact | Market stats, journey timeline, case studies |
| `/marketplace` | Marketplace | Live listings grid, wired to the data layer (see below) |
| `/resources` | Resources | Guides and support links |

## Architecture — designed to connect to the backend later

The frontend never calls `fetch` directly from components. Every piece of data flows through one seam:

```
Component  ->  hook (src/hooks/)  ->  API module (src/lib/api/)  ->  apiClient (src/lib/api/client.js)
                                              | (if VITE_API_BASE_URL is unset)
                                        mock data (src/lib/api/mocks/)
```

**Today**, `VITE_API_BASE_URL` is unset, so `apiClient.isUsingMocks` is `true` and every API module (e.g. `src/lib/api/listings.js`) returns realistic mock data shaped exactly like the real backend's API responses (see `docs/api_design.md` and `infra/migrations/0001_init.sql` in the project root). The `/marketplace` page is a working example — it filters and searches real (mock) listing data through `useListings()`.

**Later**, once the backend is deployed:
1. Set `VITE_API_BASE_URL=https://api.assetwave.com/v1` (or your local backend URL) in `.env`
2. Nothing else changes. `apiClient.isUsingMocks` becomes `false`, and every API module automatically makes real HTTP calls instead of returning mocks.

### Adding a new data source

1. Add mock data to `src/lib/api/mocks/`
2. Add a module to `src/lib/api/` (e.g. `orders.js`) following the pattern in `listings.js`
3. Add a hook to `src/hooks/` if a component needs loading/error state
4. Use the hook in your component

## Folder structure

```
src/
|-- components/
|   |-- shared/        Navbar, Footer, PageHeader, ScrollToTop -- used across all pages
|   |-- home/           Homepage-only sections (Hero, Features, ImpactTimeline, Dashboard, ...)
|   `-- visuals/        Custom illustrations (SignalSculpture hero graphic)
|-- pages/               One file per route (Home, About, FeaturesPage, Impact, Marketplace, Resources)
|-- hooks/                Data-fetching hooks (useListings, usePlatformStats)
`-- lib/api/               API client, per-domain API modules, mock data
```

## Design system

Defined as CSS variables in `src/index.css`:
- **Colors**: `--bg` (near-black), `--violet` / `--violet3`, `--ice`, text scale `--text` through `--text4`
- **Type**: `--font-display` (Instrument Serif, for headlines and emphasis) + `--font-body` (Inter, for everything else). Use `className="serif"` or `className="serif-italic"` for display text, and `className="gradient-text"` for the violet-to-ice gradient treatment.
- **Icons**: `lucide-react` throughout. No emoji anywhere in the codebase — keep it that way for a consistent, professional visual language.

Adding a new page or section should reuse these tokens rather than introducing new colors or fonts.

## Light & dark mode

Theming is handled by `src/context/ThemeContext.jsx`, which sets a `data-theme="dark"` or `data-theme="light"` attribute on `<html>`. All colors in `src/index.css` are defined twice — once per theme — under `:root[data-theme="dark"]` and `:root[data-theme="light"]`. Components reference the CSS variables (`var(--bg)`, `var(--text)`, etc.), never raw hex codes, so they automatically adapt.

- **Toggle**: the sun/moon icon in the navbar (`Navbar.jsx`) calls `toggleTheme()` from `useTheme()`.
- **Persistence**: the chosen theme is saved to `localStorage` and restored on next visit. A small inline script in `index.html` applies it before React mounts, so there's no flash of the wrong theme.
- **System preference**: on a first-ever visit (no saved preference), the site respects `prefers-color-scheme`.
- **Intentionally fixed-dark elements**: a few components — the dashboard mockup in `Dashboard.jsx`, the dark CTA banner in `CtaBanner.jsx`, the featured card in `CaseStudies.jsx` — are deliberately always dark, like a product screenshot or a spotlight panel, regardless of the page theme. These use a nested `data-theme="dark"` scope (Dashboard) or hardcoded colors (CtaBanner, CaseStudies) rather than the theme variables, by design.
- **Inverse tokens**: `--inverse-bg` / `--inverse-text` exist for elements that should stay "white card, dark text" in dark mode and "dark card, white text" in light mode — e.g. the floating stat card in the Hero, and primary filled buttons.

When adding new components, use the existing variables (`var(--text)`, `var(--bg2)`, `var(--border)`, etc.) rather than hardcoding `#fff` or `rgba(255,255,255,...)`, so new UI automatically supports both themes.
