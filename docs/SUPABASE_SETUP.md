# Supabase Setup Instructions

## Step 1: Create a Supabase Account
1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub or email

## Step 2: Create a New Project
1. Click "New Project"
2. Choose a name: `agentforge-ai`
3. Create a strong database password (save it!)
4. Select a region close to you
5. Click "Create new project" (takes ~2 minutes)

## Step 3: Run the Database Schema
1. In your Supabase dashboard, click "SQL Editor" in the left sidebar
2. Click "New Query"
3. Copy the entire contents of `supabase-schema.sql`
4. Paste it into the SQL editor
5. Click "Run" to create all tables

## Step 4: Get Your API Keys
1. Click "Settings" (gear icon) in the left sidebar
2. Click "API" under Project Settings
3. You'll see two keys:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

## Step 5: Add Keys to Your .env.local File
Add these two lines to your `.env.local` file:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace with your actual values from Step 4.

## Step 6: Restart Your Dev Server
```bash
# Stop the current server (Ctrl+C)
npm run dev
```

## Step 7: Test the Connection
1. Open your app in the browser
2. Try creating a new agent
3. Check your Supabase dashboard → "Table Editor" → "agents"
4. You should see your new agent saved!

## Database Tables Created:
- **users** - User accounts and preferences
- **agents** - AI agents with all configurations
- **chat_messages** - Chat history for each agent
- **call_logs** - Phone call records and transcripts

## Security Features:
✅ Row Level Security (RLS) enabled
✅ Users can only see their own data
✅ Automatic timestamps
✅ Foreign key constraints
✅ Indexed for fast queries

## Migration from localStorage:
Your existing data in localStorage will be automatically migrated to Supabase on first login after setup!
