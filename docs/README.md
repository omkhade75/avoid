# 📚 Documentation

This folder contains all project documentation.

## Files:

### Setup & Configuration
- **SUPABASE_SETUP.md** - Step-by-step Supabase setup guide
- **SUPABASE_INTEGRATION_COMPLETE.md** - Supabase integration details
- **SUPABASE_REFERENCE.md** - Quick reference for Supabase

### Features & Architecture
- **USER_SPECIFIC_DATA_COMPLETE.md** - User data isolation implementation
- **RESTRUCTURING_PLAN.md** - Project structure reorganization plan

## Quick Links:

### For Developers:
- Start here: `SUPABASE_SETUP.md`
- API Reference: `SUPABASE_REFERENCE.md`
- Architecture: `USER_SPECIFIC_DATA_COMPLETE.md`

### For Database:
- See: `../database/README.md`
- Schema: `../database/schema.sql`

## Project Structure:
```
agent-factory-pro/
├── src/                    # Frontend source code
│   ├── pages/             # React pages
│   ├── components/        # React components
│   ├── contexts/          # React contexts
│   ├── lib/               # Utilities & services
│   │   ├── database/      # Supabase services
│   │   └── api/           # API integrations
│   └── hooks/             # Custom React hooks
├── database/              # Database schema & migrations
├── docs/                  # This folder
└── public/                # Static assets
```

## Technology Stack:
- **Frontend:** React + TypeScript + Vite
- **Styling:** TailwindCSS + shadcn/ui
- **Database:** Supabase (PostgreSQL)
- **Voice:** Vapi.ai
- **AI:** OpenAI GPT-4o

## Getting Started:
1. Install dependencies: `npm install`
2. Set up environment variables (see `.env.local`)
3. Set up Supabase (see `SUPABASE_SETUP.md`)
4. Run dev server: `npm run dev`
