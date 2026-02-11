import { supabase } from './supabase';

// Agent database operations
export const agentService = {
    // Get all agents for a user
    async getAgents(userId: string) {
        const { data, error } = await supabase
            .from('agents')
            .select('*')
            .eq('owner_id', userId);

        if (error) throw error;

        // Convert snake_case to camelCase
        return (data || []).map((agent: any) => ({
            id: agent.id,
            ownerId: agent.owner_id,
            name: agent.name,
            role: agent.role,
            status: agent.status,
            calls: agent.calls || 0,
            messages: 0,
            tools: agent.tools || 0,
            autonomy: agent.autonomy || 5,
            createdAt: agent.created_at,
            userPrompt: agent.user_prompt,
            systemPrompt: agent.system_prompt,
            firstMessage: agent.first_message,
            chatHistory: []
        }));
    },

    // Create a new agent
    async createAgent(agent: any) {
        const { data, error } = await supabase.from('agents').insert([{
            id: agent.id,
            owner_id: agent.ownerId,
            name: agent.name,
            role: agent.role,
            status: agent.status,
            calls: agent.calls,
            tools: agent.tools,
            autonomy: agent.autonomy,
            created_at: agent.createdAt,
            user_prompt: agent.userPrompt,
            system_prompt: agent.systemPrompt,
            first_message: agent.firstMessage
        }]).select();

        if (error) throw error;
        return data;
    },

    // Update an agent
    async updateAgent(agentId: string, updates: any) {
        const supabaseUpdates: any = {};
        if (updates.name) supabaseUpdates.name = updates.name;
        if (updates.role) supabaseUpdates.role = updates.role;
        if (updates.status) supabaseUpdates.status = updates.status;
        if (updates.calls !== undefined) supabaseUpdates.calls = updates.calls;
        if (updates.tools !== undefined) supabaseUpdates.tools = updates.tools;
        if (updates.autonomy !== undefined) supabaseUpdates.autonomy = updates.autonomy;
        if (updates.userPrompt) supabaseUpdates.user_prompt = updates.userPrompt;
        if (updates.systemPrompt) supabaseUpdates.system_prompt = updates.systemPrompt;
        if (updates.firstMessage) supabaseUpdates.first_message = updates.firstMessage;

        const { data, error } = await supabase
            .from('agents')
            .update(supabaseUpdates)
            .eq('id', agentId)
            .select();

        if (error) throw error;
        return data;
    },

    // Delete an agent
    async deleteAgent(agentId: string) {
        const { error } = await supabase
            .from('agents')
            .delete()
            .eq('id', agentId);

        if (error) throw error;
    }
};

// User database operations
export const userService = {
    // Get user by ID
    async getUser(userId: string) {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) throw error;
        return data;
    },

    // Create a new user
    async createUser(user: any) {
        const { data, error } = await supabase.from('users').insert([{
            id: user.id,
            email: user.email,
            name: user.name,
            preferences: user.preferences || {}
        }]).select();

        if (error) throw error;
        return data;
    },

    // Update user
    async updateUser(userId: string, updates: any) {
        const { data, error } = await supabase
            .from('users')
            .update(updates)
            .eq('id', userId)
            .select();

        if (error) throw error;
        return data;
    }
};

// Call logs operations
export const callLogService = {
    // Get call logs for an agent
    async getCallLogs(agentId: string) {
        const { data, error } = await supabase
            .from('call_logs')
            .select('*')
            .eq('agent_id', agentId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    // Create a call log
    async createCallLog(callLog: any) {
        const { data, error } = await supabase.from('call_logs').insert([{
            agent_id: callLog.agentId,
            phone_number: callLog.phoneNumber,
            duration: callLog.duration || 0,
            status: callLog.status || 'completed',
            transcript: callLog.transcript || null
        }]).select();

        if (error) throw error;
        return data;
    }
};
