# High-Velocity Light Design System

High-Velocity Light is the TalentStream AI interface foundation for recruiter-first AI recruitment operations. It is light mode first, corporate, precise, high contrast, and optimized for dense operational workflows.

## Color Usage

- Background and main surface: `#faf8ff`.
- Cards and lowest containers: `#ffffff`.
- Muted surfaces: `#f4f3fc`.
- Section/container surfaces: `#eeedf7`.
- Borders and outline variants: `#e2e1eb`.
- Primary text/on-surface: `#1a1b22`.
- Secondary text/on-surface variant: `#5a4136`.
- Primary action orange: `#ff6b00`.
- Primary hover/pressed orange: `#a04100`.
- Error/destructive: `#ba1a1a`.

Use orange only for primary actions, active navigation, focus rings, and critical highlights. Avoid orange as a general background wash.

## Typography

Inter is the primary UI font. The global CSS exposes these text conventions:

- `display-lg`: 48px / 56px / 700.
- `headline-lg`: 32px / 40px / 600.
- `headline-md`: 24px / 32px / 600.
- `body-lg`: 18px / 28px / 400.
- `body-md`: 16px / 24px / 400.
- `label-md`: 14px / 20px / 500.
- `label-sm`: 12px / 16px / 600, suitable for uppercase labels.

Use large display styles sparingly. Recruiter workflows should favor compact headings, strong labels, and readable tabular density.

## Components

- Primary buttons use `#ff6b00` with white text and `#a04100` on hover or pressed states.
- Secondary and outline buttons should stay neutral, bordered, and low-emphasis.
- Inputs use white backgrounds, `#e2e1eb` borders, and orange focus rings.
- Cards use white backgrounds, subtle borders, and minimal or no shadow.
- Badges and chips should be compact, readable, and reserved for status, score, stage, or priority indicators.

## Dashboard Visual Rules

- Prefer subtle borders over shadows.
- Avoid glassmorphism, heavy gradients, decorative blobs, and soft marketing visuals in the recruiter app.
- Keep dashboard surfaces structured for scanning, filtering, comparison, and repeated action.
- Use orange for the current section, primary call to action, high-priority match insight, or critical alert only.
- Maintain clear hierarchy between navigation, page title, operational controls, and data surfaces.
