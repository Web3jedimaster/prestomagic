# PrestoMagic ✦

AI-powered app builder for non-technical creators. Describe your idea in plain English — PrestoMagic turns it into a working React app instantly. Built with Next.js, Kimi K2, Together AI, and AINL.

**Tagline:** No code. Just a little magic.

## Features

- 🪄 **Plain-English to React**: Type what you want, get a working app instantly
- 💻 **Live Preview**: See your app rendered in real-time via Sandpack
- 🎨 **Beautiful UI**: Warm, friendly design built with Tailwind CSS
- ⚡ **Token Efficient**: Uses AINL deterministic workflows for cost-effective inference
- 🌐 **Next.js 14**: Modern full-stack React framework with App Router

## Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Code Preview**: @codesandbox/sandpack-react
- **LLM**: Kimi K2 via Together AI
- **Workflow Orchestration**: AINL (AI Native Lang) — optional for token caching
- **Package Manager**: npm

## Development Setup

### Prerequisites

- Node.js 18+
- Python 3.8+ (for AINL, optional)
- Together AI API key from [api.together.ai](https://api.together.ai)

### Quick Start (Two Terminals)

**Terminal 1 — Start the Next.js dev server:**

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:3000`

**Terminal 2 (Optional) — Start AINL runner for deterministic workflows:**

```bash
git clone https://github.com/sbhooley/ainativelang.git ainl
cd ainl
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -e ".[dev,web]"
ainl-runner-service
```

The AINL runner will be available at `http://localhost:8770`

### Environment Variables

Copy `.env.local.example` to `.env.local` and add your real API keys:

```bash
cp .env.local.example .env.local
```

Then edit `.env.local`:

```
TOGETHER_API_KEY=your_together_ai_api_key_here
AINL_RUNNER_URL=http://localhost:8770
```

Get your Together AI API key from [api.together.ai/account/keys](https://api.together.ai/account/keys). It starts with `sk-`.

### Build & Deploy

```bash
npm run build
npm run start
```

## Architecture

### API Route: `/api/generateCode`

Receives a user prompt and returns generated React component code.

**Request:**
```json
{
  "prompt": "A habit tracker with daily checkboxes"
}
```

**Response:**
```json
{
  "code": "import React, { useState } from 'react';\nexport default function App() { ... }",
  "usage": { "input_tokens": 1200, "output_tokens": 450 }
}
```

### Frontend: `/app/page.tsx`

- Centered input form with purple theme
- Real-time Sandpack preview below
- Pulsing star animation during generation
- Mobile-responsive layout

### System Prompt

The AI receives a frozen system prompt (1024+ tokens) that ensures consistent, high-quality React component generation. The prompt is never modified at runtime to enable prefix caching on Together AI endpoints.

## Prompt Caching Strategy

PrestoMagic uses prefix caching to reduce token costs:

1. **System message always comes first** — provides stable context
2. **System prompt frozen at module level** — never constructed dynamically
3. **User prompt comes last** — only the variable part

This structure triggers automatic caching on Together AI dedicated endpoints and Groq.

## File Structure

```
prestomagic/
├── app/
│   ├── api/
│   │   └── generateCode/
│   │       └── route.ts          # API endpoint
│   ├── globals.css               # Global styles + animations
│   ├── layout.tsx                # Root layout & metadata
│   ├── page.tsx                  # Main UI component
│   └── fonts/                    # System fonts
├── public/                       # Static assets
├── .env.local.example            # Environment template
├── .env.local                    # Real keys (gitignored)
├── tailwind.config.ts            # Tailwind config + brand colors
├── tsconfig.json                 # TypeScript config
├── next.config.mjs               # Next.js config
└── package.json                  # Dependencies
```

## Brand Colors

- **Primary Purple**: `#534AB7`
- **Accent Amber**: `#EF9F27`
- **Light Purple BG**: `#EEEDFE`
- **Text/Ink**: `#2C2C2A`

## Troubleshooting

### "TOGETHER_API_KEY is not configured"

Make sure `.env.local` exists with a valid Together AI API key.

### Sandpack preview not showing

Check browser console for errors. Make sure the generated code is valid TypeScript/React.

### AINL runner connection failed

The app works fine without AINL — it calls Together AI directly. AINL is optional for cost-optimized token usage.

## Contributing

This project is built with clear, deterministic workflows. When adding features, maintain the philosophy: **No code. Just a little magic.**

## License

MIT

---

**PrestoMagic** · *The magic is in the simplicity.*
