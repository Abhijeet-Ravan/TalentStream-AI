# TalentStream AI Demo Walkthrough

## Prerequisites

- Install dependencies with `npm install`.
- Configure Clerk and `DATABASE_URL`.
- Run migrations with `npm run db:migrate`.
- Start the app with `npm run dev:next`.

## Seed Demo Data

1. Sign in.
2. Select or create a Clerk organization.
3. Open `/recruiter/settings`.
4. Use **Seed demo data**.

The seed action writes jobs, candidates, applications, match scores, screening sessions, and interviews for the active organization only. It avoids duplicate seeding when jobs already exist.

## Recommended Demo Path

1. Open `/recruiter/dashboard`.
2. Open Jobs and create a new job.
3. Open Candidates and add a candidate.
4. Open the candidate detail page and add the candidate to a job.
5. Confirm the deterministic mock match score appears through the application workflow.
6. Open Pipeline and move the application forward.
7. Queue and complete mock screening from Screenings.
8. Share a candidate with the hiring manager mock from Pipeline.
9. Open Handoffs and record a mock manager decision.
10. Open Interviews and schedule an interview.
11. Submit interview feedback where available.
12. Open Analytics to show DB-derived metrics.

## DB-Backed Now

- Jobs, candidates, applications, match scores, screenings, interviews, handoffs, feedback, notifications, consent records, audit logs, and demo seed state are persisted.
- Recruiter pages read organization-scoped database data.
- Workflow actions write audit logs and mock notification records.

## Intentional Mock Limits

- AI JD generation is not implemented.
- PDF generation is not implemented.
- Real sourcing is not implemented.
- AI voice calls, LiveKit, and Snowie are not implemented.
- Real email, WhatsApp, SMS, Outlook, Teams, LinkedIn, and Naukri integrations are not implemented.
- Resume parsing is not implemented.
- Analytics are operational aggregates, not a warehouse-backed analytics product.
- Compliance automation is record-level evidence only, not a full legal workflow.
