# 📁 Database Files

This folder contains all database-related files for the AgentForge AI platform.

## Files:

### `schema.sql`
Complete database schema for Supabase including:
- **users** table - User accounts and preferences
- **agents** table - AI agents with configurations
- **chat_messages** table - Chat history
- **call_logs** table - Phone call records
- Row Level Security (RLS) policies
- Indexes for performance

### How to Use:
1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `schema.sql`
4. Click "Run" to create all tables

## Supabase Project:
- **URL:** https://adhpguafiuzrjtniegff.supabase.co
- **Dashboard:** https://supabase.com/dashboard/project/adhpguafiuzrjtniegff

## Tables Overview:

### users
- Stores user account information
- Email, name, preferences
- Created automatically on signup

### agents
- Stores AI agent configurations
- System prompts, greetings, settings
- Linked to user via `owner_id`

### chat_messages
- Stores chat history for each agent
- Role (user/assistant/system)
- Message content and timestamps

### call_logs
- Stores phone call records
- Phone number, duration, status
- Transcript (if available)
- Linked to agent via `agent_id`

## Security:
All tables have Row Level Security (RLS) enabled:
- Users can only see their own data
- Enforced at database level
- No way to access other users' data

## Migrations:
Future database changes should be added to the `migrations/` folder (to be created).
