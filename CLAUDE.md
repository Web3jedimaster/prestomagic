# PrestoMagic

AI-powered app builder that converts plain-English descriptions into working React components. "No code. Just a little magic."

## Architecture

**Stack**: Next.js 14, React 18, TypeScript, Tailwind CSS, Clerk (auth), Sandpack (live preview)

**AI**: Together AI API → DeepSeek-R1-Distill-Qwen-14B model generates React/TypeScript code

**Key files**:
- `app/page.tsx` — Main UI: prompt input, template picker, Sandpack preview, history panel
- `app/api/generateCode/route.ts` — POST endpoint: validates Clerk auth, calls Together AI, returns code
- `app/layout.tsx` — Root layout with ClerkProvider
- `middleware.ts` — Clerk auth middleware protecting all routes
- `tailwind.config.ts` — Custom brand colors: `purple-brand`, `amber-brand`, `purple-light`, `ink`

## User Flow

1. User signs in via Clerk
2. Enters a plain-English prompt (or picks a template / uses voice input)
3. Frontend POSTs to `/api/generateCode`
4. API validates auth, sends system prompt + user prompt to Together AI
5. Returns generated React component displayed live in Sandpack

## Features

- 8 quick-start templates (Todo, Weather, Habit Tracker, etc.)
- Voice input via Web Speech API
- Language selection: React+TypeScript, Vue 3, Vanilla JS
- Code edit mode (textarea), copy, download, share via URL encoding
- AI refinement suggestions based on generated code
- Session history in `localStorage` (key: `prestomagic-history`, max 20 entries)

## Environment Variables

```
TOGETHER_API_KEY=          # Required: Together AI API key
AINL_RUNNER_URL=           # Optional: http://localhost:8770
```

Clerk keys are set via `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`.

## Development

```bash
npm run dev    # Start dev server on port 3000
npm run build  # Production build
npm run lint   # ESLint
```

## Persistence

Currently **client-side only** via `localStorage`. No backend database. History is per-browser and not tied to user accounts.

## API Notes

- `POST /api/generateCode` requires Clerk JWT (401 if unauthenticated)
- System prompt enforces: single component, Tailwind-only styling, no external imports, no markdown in output
- Token usage logged to console for cache hit monitoring
