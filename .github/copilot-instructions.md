## Project Overview

This is a Next.js portfolio website built with TypeScript, React, Tailwind CSS, and Framer Motion. It features a public-facing main application and a separate admin panel. Data is primarily managed through a file-based JSON store (`src/data/site-data.json`) and accessed via API routes.

## Architecture

- **Next.js App Router**: The application uses the Next.js App Router for routing, with distinct route groups for the main application (`src/app/(main)`) and the admin panel (`src/app/(admin)`).
- **API Routes**: Backend functionality is exposed through API routes located in `src/app/api`. These routes handle data fetching, form submissions (e.g., contact form), and admin operations.
- **Component Structure**: Reusable UI components are organized in `src/components`:
    - `src/components/layout`: Global layout components (Navbar, Footer, etc.).
    - `src/components/sections`: Components representing distinct sections of the portfolio (About, Projects, Skills, etc.).
    - `src/components/ui`: Generic, highly reusable UI elements.
- **Data Layer**: The `src/data/site-data.json` file serves as the central data store for the application's content. Data access and manipulation utilities are found in `src/lib/db.ts`.

## Data Flow

- **Central Data Store**: All static content for the portfolio (hero section, about, skills, projects, etc.) is defined in `src/data/site-data.json`.
- **Data Access**: The `src/lib/db.ts` module provides functions to read and potentially update this data. On Vercel deployments, a temporary file (`/tmp/site-data.json`) might be used for data persistence.
- **Data Seeding**: The `scripts/seed.mjs` script is used to initialize or reset the `site-data.json` with default values.

## Key Technologies

- **Framework**: Next.js
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Email**: Nodemailer (for contact form submissions)
- **Code Highlighting**: Prism.js

## Developer Workflows

- **Start Development Server**: `npm run dev`
- **Build for Production**: `npm run build`
- **Start Production Server**: `npm run start`
- **Run Linter**: `npm run lint`
- **Seed Data**: `npm run seed` (This will populate `src/data/site-data.json` with initial data.)

## Conventions and Patterns

- **File-based Data Management**: Prioritize updating `src/data/site-data.json` for content changes, and use `src/lib/db.ts` for programmatic data interactions.
- **API Route Design**: API endpoints follow a REST-like structure within `src/app/api/[section]/route.ts`.
- **Styling**: Utilize Tailwind CSS classes for all styling. Custom styles should be added to `src/app/globals.css` if necessary, but prefer Tailwind utilities.

## Integration Points

- **Contact Form**: Submissions are handled by the `src/app/api/send-email/route.ts` API route, which uses Nodemailer to send emails.
- **Code Display**: Code snippets (e.g., in project descriptions) are highlighted using Prism.js.
