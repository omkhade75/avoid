export type User = {
    id: string;
    name: string;
    email: string;
    preferences?: {
        notifications: boolean;
        marketing: boolean;
    };
};

export type LocalStorageUser = User & { password?: string };

export type ChatMessage = {
    role: "user" | "assistant" | "system";
    content: string;
    timestamp: string;
};

export type Agent = {
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
    voiceId?: string;
    voiceName?: string;
};
