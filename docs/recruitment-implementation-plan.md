# TalentStream AI Recruitment Implementation Plan

This note captures the current Ixartz SaaS boilerplate structure before changing product behavior. Phase 1 should stay recruiter-first: dashboard, jobs, candidates, mock AI match scores, candidate details, and application pipeline movement.

## 1. Existing Route Structure

- `src/app/[locale]/layout.tsx` is the localized root layout. It validates `next-intl` locales, calls `setRequestLocale`, wraps pages in `NextIntlClientProvider`, loads `src/styles/global.css`, and renders `DemoBadge`.
- `src/app/[locale]/(marketing)/page.tsx` is the public marketing home page.
- `src/app/[locale]/(auth)/layout.tsx` wraps authenticated and auth-related routes in `ClerkProvider`, applies the Clerk `shadcn` theme, configures localized Clerk UI, and sets sign-in/sign-up/recruiter redirects.
- `src/app/[locale]/(auth)/(center)/layout.tsx` provides the centered layout used by Clerk auth screens.
- `src/app/[locale]/(auth)/(center)/sign-in/[[...sign-in]]/page.tsx` and `src/app/[locale]/(auth)/(center)/sign-up/[[...sign-up]]/page.tsx` host Clerk sign-in and sign-up pages.
- `src/app/[locale]/(auth)/onboarding/organization-selection/page.tsx` hosts Clerk organization selection and redirects selected/created organizations to `/recruiter/dashboard`.
- `src/app/[locale]/(auth)/dashboard/layout.tsx` is the protected dashboard shell.
- `src/app/[locale]/(auth)/dashboard/page.tsx` is a legacy entry point that redirects to `/recruiter/dashboard`.
- `src/app/[locale]/(auth)/dashboard/user-profile/[[...user-profile]]/page.tsx` and `src/app/[locale]/(auth)/dashboard/organization-profile/[[...organization-profile]]/page.tsx` host Clerk profile screens.
- `src/app/[locale]/(auth)/recruiter/layout.tsx` is the canonical recruiter-first authenticated shell for Phase 1 product routes.
- `src/app/sitemap.ts`, `src/app/robots.ts`, and `src/app/global-error.tsx` are app-level support routes/files.

Routing and auth are enforced in `src/proxy.ts`. Protected routes currently include `/dashboard(.*)`, `/:locale/dashboard(.*)`, `/recruiter(.*)`, `/:locale/recruiter(.*)`, `/onboarding(.*)`, and `/:locale/onboarding(.*)`. Auth pages include sign-in and sign-up paths with and without locale prefixes.

## 2. Existing Dashboard/Auth Structure

- Legacy dashboard pages are inside the localized authenticated route group: `src/app/[locale]/(auth)/dashboard`.
- Canonical recruiter pages are inside the localized authenticated route group: `src/app/[locale]/(auth)/recruiter`.
- `recruiter/layout.tsx` renders a shadowed top header and a muted dashboard body with `max-w-7xl` content width.
- The dashboard header uses `src/features/dashboard/DashboardHeader.tsx`, which includes the logo, organization menu, desktop navigation, mobile navigation, locale switcher, separator, and Clerk `UserButton`.
- Current recruiter navigation contains `Dashboard`, `Jobs`, `Candidates`, `Pipeline`, `Screenings`, `Interviews`, `Analytics`, and `Settings`.
- Auth requires both a signed-in Clerk user and an active organization. If a signed-in user has no `orgId` and visits dashboard or recruiter routes, `src/proxy.ts` redirects to `/onboarding/organization-selection`.
- Clerk appearance and localization are configured in `src/app/[locale]/(auth)/layout.tsx` using localizations from `src/utils/AppConfig.ts`.

## 3. Existing Drizzle Schema

- Drizzle schema lives in `src/models/Schema.ts`.
- The current schema only defines `todoSchema`, mapped to the `todo` table:
  - `id`: serial primary key.
  - `ownerId`: required text column named `owner_id`.
  - `title`: required text.
  - `message`: required text.
  - `updatedAt`: timestamp with default `now`, automatic update hook, and `notNull`.
  - `createdAt`: timestamp with default `now` and `notNull`.
- Drizzle connection setup lives in `src/utils/DBConnection.ts` and imports all schemas from `@/models/Schema`.
- The shared database instance lives in `src/libs/DB.ts` and caches the Drizzle connection during development.
- `drizzle.config.ts` points Drizzle Kit at `./src/models/Schema.ts`, writes migrations to `./migrations`, uses PostgreSQL, and reads `DATABASE_URL`.
- Existing migrations are in `migrations/`, currently starting from `migrations/0000_init-db.sql`.

## 4. Canonical Recruitment Routes

Phase 1 recruitment screens live under the protected recruiter shell so Clerk, organization gating, i18n infrastructure, and authenticated navigation continue to work:

- `src/app/[locale]/(auth)/recruiter/dashboard/page.tsx`: recruiter dashboard overview.
- `src/app/[locale]/(auth)/recruiter/jobs/page.tsx`: jobs list and create-job entry point.
- `src/app/[locale]/(auth)/recruiter/jobs/new/page.tsx`: create job form.
- `src/app/[locale]/(auth)/recruiter/candidates/page.tsx`: candidate list and add-candidate entry point.
- `src/app/[locale]/(auth)/recruiter/candidates/[candidateId]/page.tsx`: candidate detail.
- `src/app/[locale]/(auth)/recruiter/pipeline/page.tsx`: recruiter pipeline board for moving applications between stages.
- `src/app/[locale]/(auth)/recruiter/screenings/page.tsx`: screening workflow placeholder.
- `src/app/[locale]/(auth)/recruiter/interviews/page.tsx`: interview workflow placeholder.
- `src/app/[locale]/(auth)/recruiter/analytics/page.tsx`: recruiter analytics placeholder.
- `src/app/[locale]/(auth)/recruiter/settings/page.tsx`: recruiter settings placeholder.

The current canonical tree is:

```text
src/app/[locale]/(auth)/recruiter/
  dashboard/
  jobs/
  jobs/new/
  candidates/
  candidates/[candidateId]/
  pipeline/
  screenings/
  interviews/
  analytics/
  settings/
```

Supporting recruitment code should follow existing project boundaries:

- `src/features/recruitment/` for domain-based recruitment components and page sections. This namespace can later contain jobs, candidates, applications, scoring, screening, interviews, analytics, audit logs, and integration abstractions.
- `src/features/recruitment/layout/RecruiterShell.tsx` for the recruiter console frame.
- `src/features/recruitment/layout/RecruiterSidebar.tsx` for the persistent desktop navigation and primary recruiter action.
- `src/features/recruitment/layout/RecruiterTopbar.tsx` for page context, search, notifications, locale, organization, and profile controls.
- `src/features/recruitment/layout/RecruiterNavItem.tsx` for active-state-aware recruiter navigation links.
- `src/models/Schema.ts` later for database-backed recruitment tables after typed mock data is proven.
- `src/locales/en.json` and `src/locales/fr.json` for visible copy, following the current `next-intl` pattern.
- `src/app/[locale]/(auth)/recruiter/layout.tsx` only when adding recruiter navigation items to the existing authenticated header pattern.
- `src/app/[locale]/(auth)/dashboard/page.tsx` may remain as a legacy redirect to `/recruiter/dashboard`; do not delete dashboard routes yet.

## 5. Files That Should Not Be Touched Yet

Do not delete boilerplate files in this phase. Avoid changing these until the recruitment workflow needs them:

- Clerk/auth infrastructure: `src/app/[locale]/(auth)/layout.tsx`, auth pages under `(center)`, Clerk profile routes, and Clerk organization-selection route.
- Route protection and organization gating: `src/proxy.ts`.
- i18n foundation: `src/libs/I18nRouting.ts`, `src/libs/I18nNavigation.ts`, `src/libs/I18n.ts`, locale prefix behavior in `src/utils/AppConfig.ts`.
- Drizzle connection plumbing: `src/libs/DB.ts`, `src/utils/DBConnection.ts`, `drizzle.config.ts`, existing `migrations/`.
- shadcn setup and base UI primitives: `components.json`, `src/components/ui/*`, and `src/styles/global.css` except for narrowly scoped design-system additions.
- Billing/subscription placeholders: `src/features/billing/*`, `src/types/Subscription.ts`, and `src/utils/PricingPlans.ts`.
- Observability/test/config scaffolding: `src/instrumentation.ts`, `src/instrumentation-client.ts`, `checkly.config.ts`, `playwright.config.ts`, `vitest.config.ts`, `eslint.config.mjs`, `knip.config.ts`, `lefthook.yml`, and CI-related config files.
- Public boilerplate assets under `public/assets/images/` unless explicitly replacing branding in a later product-branding milestone.
