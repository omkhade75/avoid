
import React, { createContext, useContext, useState, useEffect } from "react";

type User = {
    id: string;
    name: string;
    email: string;
    preferences?: {
        notifications: boolean;
        marketing: boolean;
    };
};

export type ChatMessage = {
    role: "user" | "assistant" | "system";
    content: string;
    timestamp: string;
};

type Agent = {
    id: string;
    ownerId: string;
    name: string;
    role: string;
    status: "active" | "inactive" | "training";
    calls: number;
    messages: number;
    tools: number;
    autonomy: number;
    createdAt: string;
    userPrompt?: string;
    systemPrompt?: string;
    firstMessage?: string;
    chatHistory?: ChatMessage[];
};

type AuthContextType = {
    user: User | null;
    login: (email: string, pass: string) => Promise<boolean>;
    signup: (name: string, email: string, pass: string) => Promise<boolean>;
    logout: () => void;
    agents: Agent[];
    addAgent: (agent: Omit<Agent, "id" | "ownerId" | "createdAt" | "calls" | "messages">) => string;
    updateAgent: (agentId: string, updates: Partial<Agent>) => void;
    updateUser: (updates: Partial<User>) => void;
    loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(true);

    // Load user from local storage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem("agent_factory_user");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            loadAgents(parsedUser.id);
        }
        setLoading(false);
    }, []);

    const loadAgents = async (userId: string) => {
        try {
            // Try to load from Supabase first
            const { agentService } = await import("@/lib/database/supabase-service");
            const supabaseAgents = await agentService.getAgents(userId);

            if (supabaseAgents && supabaseAgents.length > 0) {
                console.log("✅ Loaded agents from Supabase:", supabaseAgents.length);
                setAgents(supabaseAgents);
                return;
            }
        } catch (error) {
            console.log("⚠️ Supabase not available, using localStorage:", error);
        }

        // Fallback to localStorage
        const storedAgents = localStorage.getItem("agent_factory_agents");
        if (storedAgents) {
            const allAgents: Agent[] = JSON.parse(storedAgents);
            const userAgents = allAgents.filter((a) => a.ownerId === userId);
            setAgents(userAgents);
        } else {
            setAgents([]);
        }
    };

    const login = async (email: string, pass: string) => {
        // Simulate API call
        return new Promise<boolean>((resolve) => {
            setTimeout(() => {
                const users = JSON.parse(localStorage.getItem("agent_factory_users") || "[]");
                const foundUser = users.find((u: any) => u.email === email && u.password === pass);

                if (foundUser) {
                    const { password, ...safeUser } = foundUser;
                    setUser(safeUser);
                    localStorage.setItem("agent_factory_user", JSON.stringify(safeUser));
                    loadAgents(safeUser.id);
                    resolve(true);
                } else {
                    resolve(false);
                }
            }, 800);
        });
    };

    const signup = async (name: string, email: string, pass: string) => {
        // Simulate API call
        return new Promise<boolean>((resolve) => {
            setTimeout(() => {
                const users = JSON.parse(localStorage.getItem("agent_factory_users") || "[]");

                if (users.find((u: any) => u.email === email)) {
                    resolve(false); // User exists
                    return;
                }

                const newUser = {
                    id: crypto.randomUUID(),
                    name,
                    email,
                    password: pass,
                    preferences: { notifications: true, marketing: false }
                };

                users.push(newUser);
                localStorage.setItem("agent_factory_users", JSON.stringify(users));

                const { password, ...safeUser } = newUser;
                setUser(safeUser);
                localStorage.setItem("agent_factory_user", JSON.stringify(safeUser));
                loadAgents(safeUser.id);

                resolve(true);
            }, 800);
        });
    };

    const logout = () => {
        setUser(null);
        setAgents([]);
        localStorage.removeItem("agent_factory_user");
    };

    const addAgent = (agentData: Omit<Agent, "id" | "ownerId" | "createdAt" | "calls" | "messages">) => {
        if (!user) return "";

        const id = crypto.randomUUID();
        const newAgent: Agent = {
            ...agentData,
            id,
            ownerId: user.id,
            createdAt: new Date().toISOString(),
            calls: 0,
            messages: 0,
            chatHistory: [],
        };

        // Save to Supabase (async, don't wait)
        (async () => {
            try {
                const { agentService } = await import("@/lib/database/supabase-service");
                await agentService.createAgent(newAgent);
                console.log("✅ Agent saved to Supabase:", newAgent.name);
            } catch (error) {
                console.error("❌ Failed to save agent to Supabase:", error);
            }
        })();

        // Save to localStorage (sync, for immediate access)
        const storedAgents = localStorage.getItem("agent_factory_agents");
        const allAgents: Agent[] = storedAgents ? JSON.parse(storedAgents) : [];
        allAgents.push(newAgent);
        localStorage.setItem("agent_factory_agents", JSON.stringify(allAgents));

        // Update local state
        setAgents((prev) => [...prev, newAgent]);
        return id;
    };

    const updateAgent = (agentId: string, updates: Partial<Agent>) => {
        if (!user) return;

        // Update local state
        setAgents(prev => prev.map(agent => agent.id === agentId ? { ...agent, ...updates } : agent));

        // Update Supabase (async, don't wait)
        (async () => {
            try {
                const { agentService } = await import("@/lib/database/supabase-service");
                await agentService.updateAgent(agentId, updates);
                console.log("✅ Agent updated in Supabase");
            } catch (error) {
                console.error("❌ Failed to update agent in Supabase:", error);
            }
        })();

        // Update localStorage (sync)
        const storedAgents = JSON.parse(localStorage.getItem("agent_factory_agents") || "[]");
        const updatedAgents = storedAgents.map((a: Agent) => a.id === agentId ? { ...a, ...updates } : a);
        localStorage.setItem("agent_factory_agents", JSON.stringify(updatedAgents));
    };

    const updateUser = (updates: Partial<User>) => {
        if (!user) return;

        let updatedUser = { ...user, ...updates };
        if (updates.preferences && user.preferences) {
            updatedUser.preferences = { ...user.preferences, ...updates.preferences };
        }

        setUser(updatedUser);
        localStorage.setItem("agent_factory_user", JSON.stringify(updatedUser));

        const users = JSON.parse(localStorage.getItem("agent_factory_users") || "[]");
        const updatedUsers = users.map((u: any) => u.id === user.id ? { ...u, ...updates, preferences: updatedUser.preferences } : u);
        localStorage.setItem("agent_factory_users", JSON.stringify(updatedUsers));
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, agents, addAgent, updateAgent, updateUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
