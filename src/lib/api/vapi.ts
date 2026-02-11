
import Vapi from "@vapi-ai/web";

const publicKey = import.meta.env.VITE_VAPI_PUBLIC_KEY;
// We store the 11labs key but we rely on Vapi dashboard config for the actual auth usually.
// However, if we wanted to use it directly we could. For now it's just available in env.
const elevenLabsKey = import.meta.env.VITE_ELEVENLABS_API_KEY;

export const vapi = new Vapi(publicKey);

const MULTILINGUAL_INSTRUCTION = `
CRITICAL INSTRUCTION: You are a highly capable bilingual agent.
1. AUTOMATICALLY DETECT the user's language (English or Hindi).
2. If the user speaks Hindi, YOU MUST REPLY IN HINDI (using Devanagari script or Hinglish as appropriate).
3. If the user speaks English, reply in English.
4. If the user switches language mid-conversation, YOU MUST SWITCH IMMEDIATELY.
5. Always maintain your persona and politeness, regardless of the language used.
`;

export const startAgentCall = async (systemPrompt: string, firstMessage: string = "Hello! It is a pleasure to speak with you.", voiceId: string = "21m00Tcm4TlvDq8ikWAM") => {
    try {
        const callConfig: any = {
            model: {
                provider: "openai",
                model: "gpt-4-turbo", // Upgrade for better conversation quality
                temperature: 0.7,
                maxTokens: 500,
                messages: [
                    {
                        role: "system",
                        content: systemPrompt + "\n\n" + MULTILINGUAL_INSTRUCTION + "\n\nCRITICAL INSTRUCTION: You represent the gold standard of politeness and warmth. \n1. Speak with genuine kindness, empathy, and patience.\n2. Use polite language (Please, Thank you, It would be my pleasure).\n3. Make the user feel valued and understood.\n4. Never be abrupt or dismissive.\n5. Answer fully and helpfully, but always with a 'smile' in your voice.",
                    },
                ],
            },
            transcriber: {
                provider: "deepgram",
                model: "nova-2",
                language: "multi", // Enables automatic language detection (English + Hindi + others)
            },
            voice: {
                provider: "11labs",
                voiceId: voiceId, // Default to "Rachel" (Warm/Polite)
            },
            firstMessage: firstMessage,
        };

        await vapi.start(callConfig);
    } catch (error) {
        console.error("Failed to start call:", error);
        throw error;
    }
};

export const stopAgentCall = () => {
    vapi.stop();
};

export const makeOutboundCall = async (phoneNumber: string, systemPrompt: string, firstMessage?: string, voiceId: string = "21m00Tcm4TlvDq8ikWAM") => {
    const phoneNumberId = "84af6220-9e4b-473a-a98f-84da5694ce2d"; // User provided ID
    const privateKey = import.meta.env.VITE_VAPI_PRIVATE_KEY;

    const requestBody = {
        phoneNumberId: phoneNumberId,
        customer: {
            number: phoneNumber
        },
        assistant: {
            name: "Dynamic Agent",
            firstMessage: firstMessage || "Hello! I'm calling to discuss the details you provided.",
            transcriber: {
                provider: "deepgram",
                model: "nova-2",
                language: "multi",
            },
            model: {
                provider: "openai",
                model: "gpt-4o",
                messages: [
                    { role: "system", content: systemPrompt + "\n\n" + MULTILINGUAL_INSTRUCTION }
                ],
                temperature: 0.7,
            },
            voice: {
                provider: "11labs",
                voiceId: voiceId,
            }
        }
    };

    console.log("🚀 VAPI REQUEST BODY:", JSON.stringify(requestBody, null, 2));

    try {
        const response = await fetch("https://api.vapi.ai/call/phone", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${privateKey}`,
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const error = await response.json();
            console.error("❌ VAPI ERROR RESPONSE:", error);
            throw new Error(error.message || "Failed to initiate outbound call");
        }

        const result = await response.json();
        console.log("✅ VAPI SUCCESS:", result);
        return result;
    } catch (error) {
        console.error("Outbound Call Error:", error);
        throw error;
    }
};
