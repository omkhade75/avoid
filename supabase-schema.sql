-- AgentForge AI Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    preferences JSONB DEFAULT '{}'::jsonb
);

-- Agents table
CREATE TABLE IF NOT EXISTS agents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    owner_id UUID REFERENCES users (id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    status TEXT DEFAULT 'active' CHECK (
        status IN (
            'active',
            'inactive',
            'training'
        )
    ),
    calls INTEGER DEFAULT 0,
    tools INTEGER DEFAULT 0,
    autonomy INTEGER DEFAULT 5,
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW(),
        user_prompt TEXT,
        system_prompt TEXT,
        first_message TEXT
);

-- Chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    agent_id UUID REFERENCES agents (id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (
        role IN ('user', 'assistant', 'system')
    ),
    content TEXT NOT NULL,
    timestamp TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW()
);

-- Call logs table
CREATE TABLE IF NOT EXISTS call_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    agent_id UUID REFERENCES agents (id) ON DELETE CASCADE,
    phone_number TEXT NOT NULL,
    duration INTEGER DEFAULT 0,
    status TEXT DEFAULT 'completed' CHECK (
        status IN (
            'completed',
            'failed',
            'missed'
        )
    ),
    transcript TEXT,
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_agents_owner ON agents (owner_id);

CREATE INDEX IF NOT EXISTS idx_chat_messages_agent ON chat_messages (agent_id);

CREATE INDEX IF NOT EXISTS idx_call_logs_agent ON call_logs (agent_id);

CREATE INDEX IF NOT EXISTS idx_agents_created ON agents (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_call_logs_created ON call_logs (created_at DESC);

-- Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

ALTER TABLE agents ENABLE ROW LEVEL SECURITY;

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

ALTER TABLE call_logs ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON users FOR
SELECT USING (auth.uid () = id);

CREATE POLICY "Users can update own profile" ON users FOR
UPDATE USING (auth.uid () = id);

-- Users can only see their own agents
CREATE POLICY "Users can view own agents" ON agents FOR
SELECT USING (auth.uid () = owner_id);

CREATE POLICY "Users can create own agents" ON agents FOR
INSERT
WITH
    CHECK (auth.uid () = owner_id);

CREATE POLICY "Users can update own agents" ON agents FOR
UPDATE USING (auth.uid () = owner_id);

CREATE POLICY "Users can delete own agents" ON agents FOR DELETE USING (auth.uid () = owner_id);

-- Users can only see messages for their agents
CREATE POLICY "Users can view messages for own agents" ON chat_messages FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM agents
            WHERE
                agents.id = chat_messages.agent_id
                AND agents.owner_id = auth.uid ()
        )
    );

CREATE POLICY "Users can create messages for own agents" ON chat_messages FOR
INSERT
WITH
    CHECK (
        EXISTS (
            SELECT 1
            FROM agents
            WHERE
                agents.id = chat_messages.agent_id
                AND agents.owner_id = auth.uid ()
        )
    );

-- Users can only see call logs for their agents
CREATE POLICY "Users can view call logs for own agents" ON call_logs FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM agents
            WHERE
                agents.id = call_logs.agent_id
                AND agents.owner_id = auth.uid ()
        )
    );

CREATE POLICY "Users can create call logs for own agents" ON call_logs FOR
INSERT
WITH
    CHECK (
        EXISTS (
            SELECT 1
            FROM agents
            WHERE
                agents.id = call_logs.agent_id
                AND agents.owner_id = auth.uid ()
        )
    );