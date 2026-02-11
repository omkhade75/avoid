import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database Types
export interface Database {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string;
                    email: string;
                    name: string;
                    created_at: string;
                    preferences: any;
                };
                Insert: {
                    id?: string;
                    email: string;
                    name: string;
                    created_at?: string;
                    preferences?: any;
                };
                Update: {
                    id?: string;
                    email?: string;
                    name?: string;
                    created_at?: string;
                    preferences?: any;
                };
            };
            agents: {
                Row: {
                    id: string;
                    owner_id: string;
                    name: string;
                    role: string;
                    status: 'active' | 'inactive' | 'training';
                    calls: number;
                    tools: number;
                    autonomy: number;
                    created_at: string;
                    user_prompt: string | null;
                    system_prompt: string | null;
                    first_message: string | null;
                };
                Insert: {
                    id?: string;
                    owner_id: string;
                    name: string;
                    role: string;
                    status?: 'active' | 'inactive' | 'training';
                    calls?: number;
                    tools?: number;
                    autonomy?: number;
                    created_at?: string;
                    user_prompt?: string | null;
                    system_prompt?: string | null;
                    first_message?: string | null;
                };
                Update: {
                    id?: string;
                    owner_id?: string;
                    name?: string;
                    role?: string;
                    status?: 'active' | 'inactive' | 'training';
                    calls?: number;
                    tools?: number;
                    autonomy?: number;
                    created_at?: string;
                    user_prompt?: string | null;
                    system_prompt?: string | null;
                    first_message?: string | null;
                };
            };
            chat_messages: {
                Row: {
                    id: string;
                    agent_id: string;
                    role: 'user' | 'assistant' | 'system';
                    content: string;
                    timestamp: string;
                };
                Insert: {
                    id?: string;
                    agent_id: string;
                    role: 'user' | 'assistant' | 'system';
                    content: string;
                    timestamp?: string;
                };
                Update: {
                    id?: string;
                    agent_id?: string;
                    role?: 'user' | 'assistant' | 'system';
                    content?: string;
                    timestamp?: string;
                };
            };
            call_logs: {
                Row: {
                    id: string;
                    agent_id: string;
                    phone_number: string;
                    duration: number;
                    status: 'completed' | 'failed' | 'missed';
                    transcript: string | null;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    agent_id: string;
                    phone_number: string;
                    duration?: number;
                    status?: 'completed' | 'failed' | 'missed';
                    transcript?: string | null;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    agent_id?: string;
                    phone_number?: string;
                    duration?: number;
                    status?: 'completed' | 'failed' | 'missed';
                    transcript?: string | null;
                    created_at?: string;
                };
            };
        };
    };
}
