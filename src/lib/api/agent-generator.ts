
import OpenAI from "openai";

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

const openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true, // Only for this prototype running locally
});

export interface GeneratedAgentConfig {
    name: string;
    role: string;
    systemPrompt: string;
    firstMessage: string;
    tools: string[];
    autonomy: number;
}

export interface AgentOptions {
    tone: string;
    expertise: "junior" | "mid-level" | "senior" | "executive" | "world-class";
    language: string;
    contextualAnswers?: Record<string, string>;
}

export async function generateInterviewQuestions(userPrompt: string): Promise<string[]> {
    // Return fixed, clear questions that match our template expectations
    return [
        "What is the name of your organization or university?",
        "What is the main purpose of this call? (e.g., invite students, schedule appointments, etc.)",
        "What name should the AI agent use when introducing itself?"
    ];
}

export async function generateAgentConfig(userPrompt: string, options?: AgentOptions): Promise<GeneratedAgentConfig> {
    try {
        console.log("🔧 DIRECT TEMPLATE GENERATION (No API calls needed)");

        // Extract key entities from context
        const contextValues = options?.contextualAnswers ? Object.values(options.contextualAnswers) : [];
        const organizationName = contextValues[0] || "our organization";
        const primaryGoal = contextValues[1] || "discuss an important opportunity";
        const agentName = contextValues[2] || "Alex";

        console.log("📋 EXTRACTED CONTEXT:", { organizationName, primaryGoal, agentName });

        // Build the greeting using the EXACT template
        const firstMessage = `Hello! My name is ${agentName} and I'm calling from ${organizationName}. I'm reaching out to you today because we'd like to ${primaryGoal}. Would you be interested in learning more?`;

        console.log("✅ GENERATED GREETING:", firstMessage);

        // Build a comprehensive system prompt
        const systemPrompt = `You are ${agentName}, a professional representative from ${organizationName}.

YOUR IDENTITY:
- Your name is ${agentName}
- You work for ${organizationName}
- Your primary mission is to ${primaryGoal}
- You speak with a ${options?.tone || 'professional and friendly'} tone
- You are an ${options?.expertise || 'expert'} in your field

COMMUNICATION STYLE:
- Always be polite, warm, and professional
- Listen carefully to the person's responses
- Answer questions thoroughly and honestly
- If you don't know something, admit it and offer to find out
- Use the person's name when they share it
- Be empathetic and understanding

YOUR GOAL:
Your primary objective is to ${primaryGoal}. You should:
1. Introduce yourself clearly (you already did this in your first message)
2. Explain the purpose of your call
3. Listen to their interests and concerns
4. Provide helpful information about ${organizationName}
5. Answer any questions they have
6. If appropriate, schedule a follow-up or next step

HANDLING OBJECTIONS:
- If they're busy: "I completely understand. Would there be a better time I could call you back?"
- If they're not interested: "I appreciate your honesty. May I ask what concerns you have?"
- If they have questions: Answer thoroughly and professionally

IMPORTANT RULES:
- Never be pushy or aggressive
- Respect their time and decisions
- Always represent ${organizationName} with professionalism
- Focus on how you can help them, not just on making a sale
- End calls gracefully, whether positive or negative

Remember: You are the voice and face of ${organizationName}. Every interaction should leave a positive impression.`;

        const config: GeneratedAgentConfig = {
            name: agentName,
            role: `Professional Representative at ${organizationName}`,
            systemPrompt: systemPrompt,
            firstMessage: firstMessage,
            tools: ["phone_call", "calendar_api", "email_send", "knowledge_base"],
            autonomy: 5
        };

        console.log("🎯 AGENT CONFIG CREATED:", config);
        return config;

    } catch (error) {
        console.error("❌ GENERATION FAILED:", error);
        return {
            name: "Professional Consultant",
            role: "Strategic Advisor",
            systemPrompt: "You are a professional consultant. Always be courteous, knowledgeable, and helpful.",
            firstMessage: `Hello! I'm calling to discuss an important matter with you. How are you today?`,
            tools: ["knowledge_base", "phone_call"],
            autonomy: 5,
        };
    }
}
