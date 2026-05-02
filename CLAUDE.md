# PAX GROUP Website — Claude Code Operating Manual

## Project Goal

Transform paxgroupglobal.com into the premium global advertising face of PAX GROUP — a software, AI automation, web development, digital transformation, and business process automation company.

The final result must feel:
- Premium and enterprise-grade
- Global and trustworthy
- Minimal and sharp
- Modern software company style (not generic agency, not freelancer)

Core brand message:
> "We build intelligent digital systems that help businesses scale, automate operations, and grow with precision."

---

## Absolute Rules

1. **Never commit, push, deploy, or merge without explicit written approval from the owner.**
2. Work only on the current feature branch unless instructed otherwise. Default working branch: `main` (revamp work should be on `revamp/global-software-company-v1` unless owner directs otherwise).
3. Before editing any file, read it first. Inspect before you touch.
4. Provide a concise plan before implementing any non-trivial change.
5. Do not invent fake client logos, fake testimonials, fake case studies, fake statistics, fake awards, or fake social proof of any kind.
6. Improve English language quality and tone quality across all pages.
7. Avoid exaggerated claims: no "world leader", "guaranteed growth", "best in the world", or similar.
8. The website targets global B2B clients — every decision must serve that audience.
9. Every change must improve conversion, credibility, design quality, code quality, or performance.
10. If unsure about any decision, document the question and wait for owner approval.

---

## Branch Safety Rules

- Current active branch: `main`
- Do not force push to main/master.
- Do not reset, rebase, or amend published commits without explicit owner instruction.
- Do not create a commit without owner saying: `approved`, `onaylıyorum`, `uygula`, or equivalent.

---

## Tech Stack (Confirmed)

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 7, React Router 7, Framer Motion 12 |
| Styling | Tailwind CSS 3, clsx, tailwind-merge |
| Icons | lucide-react |
| i18n | Custom LanguageContext (TR/EN/RU/ME) |
| Backend | Node.js / Express 5, Mongoose 9, MongoDB Atlas |
| Auth | JWT (jsonwebtoken), localStorage-based session |
| Hosting | Vercel (frontend via vercel.json rewrites) |
| Forms | formsubmit.co (external, no backend form handling) |
| Analytics | Google Analytics (G-X23413SM7F), Facebook Domain Verification |
| CI/CD | None configured (manual deploy) |

---

## Frontend Standards

- Clean component structure — one responsibility per component
- Responsive design (mobile-first)
- Semantic HTML with proper heading hierarchy (h1 > h2 > h3)
- Strong SEO: `<title>`, `<meta description>`, Open Graph tags on every route
- Accessible contrast ratios (WCAG AA minimum)
- No console errors in production
- No unused imports
- No hardcoded messy inline styles unless absolutely necessary
- No duplicated copy blocks
- No layout shift on mobile
- Framer Motion animations: performance-safe, reduced-motion-aware
- Tailwind only — no additional CSS frameworks

---

## Backend Standards

- All secrets in environment variables — never hardcoded in source code
- `MONGO_URI`, `JWT_SECRET`, `WEBHOOK_SECRET`, `N8N_WEBHOOK_URL` must be in `.env`
- Input validation on all POST endpoints
- Spam protection on public-facing form endpoints (rate limiting / honeypot)
- No public admin endpoints without authentication
- CORS: restrict to specific domains in production (not `*`)
- Passwords must be hashed (bcrypt) — never stored in plaintext
- JWT secret must be a strong random string, not `'gizlisifre123'`

---

## SEO Standards

- `<title>` tag on every page (unique, descriptive)
- `<meta name="description">` on every page
- Open Graph (`og:title`, `og:description`, `og:image`) on every page
- Canonical URL tags
- Structured data (JSON-LD) for organization at minimum
- Sitemap.xml (generate or add manually)
- robots.txt
- No broken internal links
- Images with `alt` attributes

---

## Security Standards

- No API keys or secrets in frontend bundle
- No plaintext passwords in database
- JWT secret must be environment-variable-based and strong
- CORS locked to specific origins in production
- Form endpoints rate-limited
- No sensitive data logged to console in production

---

## No Fake Claims Rule

The following are strictly forbidden:
- Fake client logos or brand names
- Invented testimonials or made-up quotes
- Fabricated statistics (e.g., "trusted by 10,000+ companies" without proof)
- Fake awards, certifications, or media mentions
- Unrealistic uptime or performance numbers without technical backing

Real qualitative descriptions of capabilities are acceptable. Real team bios and real technology descriptions are acceptable.

---

## Agent Workflow

Use specialist subagents in this order for major changes:

1. **brand-strategy-director** — Audit positioning, copy, and messaging
2. **ux-ui-design-auditor** — Audit design, layout, UX, and visual hierarchy
3. **backend-automation-architect** — Design backend improvements
4. **senior-frontend-engineer** — Implement approved changes
5. **qa-seo-security-reviewer** — Validate the result before any commit

---

## Approval Gate

Before any implementation commit or deployment, present:

- Summary of planned changes
- Page-by-page improvement plan
- Copy changes (before/after)
- Design changes
- Technical changes
- Backend changes
- Risk assessment
- Open questions requiring owner decision

**Do not proceed to implementation until the owner writes:**
`APPROVED_PHASE_2` or `approved` or `onaylıyorum` or `uygula`

---

## Files & Folder Map

```
pax-site/
├── src/
│   ├── App.jsx              ← Main app, routing, Navbar, Footer, HomePage, all inline sections
│   ├── LanguageContext.jsx  ← All translations (TR/EN/RU/ME) + LanguageProvider
│   ├── components/
│   │   ├── Navbar.jsx
│   │   └── ParticleBackground.jsx
│   ├── pages/
│   │   ├── BusinessSettings.jsx
│   │   ├── CalendarPage.jsx
│   │   └── DashboardOverview.jsx
│   ├── layouts/
│   │   └── DashboardLayout.jsx
│   ├── PricingPage.jsx
│   ├── SolutionsPage.jsx
│   ├── BlogPage.jsx
│   ├── BlogPostDetail.jsx
│   ├── CaseStudiesPage.jsx
│   ├── HikayeSayfasi.jsx
│   ├── LegalPages.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── ProtectedRoute.jsx
│   └── utils/businessConfig.js
├── backend/
│   ├── server.js            ← Express app, all routes inline, hardcoded secrets ⚠️
│   ├── models/User.js
│   ├── models/BusinessProfile.js
│   ├── controllers/businessController.js
│   ├── routes/businessRoutes.js
│   └── middleware/authMiddleware.js
├── public/                  ← Static assets (logo.jpeg, etc.)
├── index.html               ← Entry, GA4 tag, Facebook domain verification
├── vite.config.js
├── tailwind.config.js
├── vercel.json              ← SPA rewrite rule
└── .env                     ← Exists (contents unknown)
```
