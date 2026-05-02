# /pax-full-revamp-mvp

This command runs the full PAX GROUP website revamp workflow in sequential phases.

**Trigger phrase**: `/pax-full-revamp-mvp`

**Safety rule**: The workflow STOPS before Phase 6 (Implementation) and WAITS for the owner to write `APPROVED_PHASE_2` or equivalent explicit approval.

---

## PHASE 1 — Discovery & Codebase Audit

Tasks:
- Inspect the full repository structure (`src/`, `backend/`, `public/`, config files)
- Identify tech stack (framework, versions, package manager, build scripts)
- Identify existing backend capabilities and gaps
- Identify current routes and pages
- Identify styling system and design token usage
- Check whether `.env` exists and what variables it contains (names only, not values)
- Check `vercel.json`, `vite.config.js`, `tailwind.config.js`
- Note any obvious bugs, broken links, or security risks

Output: Tech Stack Summary, File Map, Backend Capability Map, Risk List

---

## PHASE 2 — Brand Audit

Agent: **brand-strategy-director**

Tasks:
- Audit homepage hero copy (title, subtitle, badge, CTAs)
- Audit solutions section copy
- Audit stats section (check for exaggerated or fake numbers)
- Audit testimonials (are they attributed properly, do they read as real?)
- Audit vision/about section copy
- Audit navigation labels
- Audit pricing page copy
- Audit contact form labels and CTAs
- Audit footer
- Check all four language versions (TR/EN/RU/ME) for consistency
- Flag any language that sounds generic, cheap, or locally-focused
- Produce recommended copy rewrites for approved sections

Output: Brand Audit Report with BEFORE/AFTER copy recommendations

---

## PHASE 3 — UX/UI Design Audit

Agent: **ux-ui-design-auditor**

Tasks:
- Audit visual hierarchy on desktop and mobile
- Audit the hero section (CTA placement, headline size, visual interest)
- Audit typography consistency (font sizes, weights, spacing)
- Audit color usage and brand consistency
- Audit CTA buttons (contrast, size, placement, copy)
- Audit component card design (radius, shadow, spacing consistency)
- Audit the Navbar (desktop + mobile hamburger menu)
- Audit the Footer design
- Audit mobile layout of all key sections
- Audit Framer Motion animations (performance, value, smoothness)
- Identify design patterns that look generic or template-like
- Identify missing trust signals (social proof, certifications, logos)

Output: UX/UI Audit Report with specific component-level recommendations

---

## PHASE 4 — Backend Architecture Plan

Agent: **backend-automation-architect**

Tasks:
- Map current backend capabilities (routes, models, auth system)
- Identify critical security issues (hardcoded secrets, plaintext passwords, open CORS)
- Design lead capture endpoint architecture
- Design n8n webhook integration plan
- Recommend database model changes
- Propose environment variable structure
- Recommend authentication hardening steps
- Assess admin panel feasibility
- Estimate what can be done in MVP vs. later phases

Output: Backend Architecture Plan document

---

## PHASE 5 — Combined Implementation Plan + Owner Approval Gate

Tasks:
- Consolidate findings from Phases 2, 3, and 4
- Prioritize all changes by: impact (high/med/low) × effort (high/med/low)
- Produce a page-by-page improvement plan
- List all files likely to change in Phase 6
- Produce copy changes table (before/after for each page)
- Produce design changes list (component-level)
- Produce backend changes list (endpoints, security fixes)
- Assess risks (what could break)
- List open decisions requiring owner input

**⛔ STOP HERE.**

Present the full implementation plan to the owner and wait for:
- `APPROVED_PHASE_2`
- `approved`
- `onaylıyorum`
- `uygula`

Do not proceed to Phase 6 without explicit written approval.

---

## PHASE 6 — Implementation

**Only runs after explicit owner approval.**

Agents: **senior-frontend-engineer** + **backend-automation-architect**

Sub-phases (execute in order, present results between each):

### 6A — Critical Security Fixes (Backend)
- Move MONGO_URI, JWT_SECRET to .env
- Add bcrypt password hashing
- Replace hardcoded JWT secret
- Restrict CORS to production domain
- Add npm start script to backend/package.json

### 6B — SEO Foundation
- Add unique `<title>` and `<meta description>` to every route
- Add Open Graph tags
- Add `lang` attribute management to index.html or per-route
- Create robots.txt
- Create basic sitemap.xml

### 6C — Copy Implementation
- Apply approved brand copy rewrites from Phase 2
- Update LanguageContext.jsx with improved translations (EN priority)
- Update page-level copy in SolutionsPage, PricingPage, HikayeSayfasi, CaseStudiesPage

### 6D — Design Implementation
- Apply approved UX/UI improvements from Phase 3
- Fix CTA button issues
- Fix mobile layout issues
- Improve visual hierarchy in hero and solutions sections

### 6E — Lead Capture Backend
- Implement POST /api/leads endpoint
- Implement POST /api/contact endpoint
- Add input validation and rate limiting
- Add n8n webhook trigger
- Update contact form in App.jsx to use internal endpoint

### 6F — Social Links
- Update all `href="#"` social links in Footer with real URLs or mark as TBD

---

## PHASE 7 — QA Review

Agent: **qa-seo-security-reviewer**

Tasks:
- Run `npm run build` — must pass with zero errors
- Run `npm run lint` — must pass with zero errors
- Audit all routes for broken links
- Audit SEO metadata on all pages
- Re-check all security fixes from 6A
- Audit mobile layout on all changed pages
- Audit accessibility basics
- Run final performance check

Output: QA Report with PASS/FAIL verdict per category

---

## PHASE 8 — Final Report & Deployment Readiness

Present to owner:

```
## PAX GROUP Revamp — Final Report

### Files Changed
- [file]: [what changed and why]

### Copy Changes
- [page/section]: [before → after]

### Design Changes
- [component]: [what changed]

### Backend Changes
- [endpoint/file]: [what changed]

### Tests Run
- [test]: [result]

### Remaining Risks
- [risk]: [mitigation plan]

### Deployment Steps
1. [step]
2. [step]

### Open Items for Owner Decision
- [item]
```

**⛔ STOP HERE. Do not commit, push, or deploy without explicit owner approval.**

Owner must write `DEPLOY_APPROVED` or `commit et` or equivalent to proceed.
