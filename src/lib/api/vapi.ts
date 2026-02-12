
import Vapi from "@vapi-ai/web";

const publicKey = import.meta.env.VITE_VAPI_PUBLIC_KEY;
// We store the 11labs key but we rely on Vapi dashboard config for the actual auth usually.
// However, if we wanted to use it directly we could. For now it's just available in env.
const elevenLabsKey = import.meta.env.VITE_ELEVENLABS_API_KEY;

export const vapi = new Vapi(publicKey);

const MULTILINGUAL_INSTRUCTION = `
CRITICAL INSTRUCTION: You are a highly capable agent designed for an Indian audience.
1. LANGUAGE: Speak in "Indian English" (clear, neutral, simple vocabulary).
2. ADAPTABILITY: If the user speaks Hindi, REPLY IN HINDI. If they mix Hindi/English (Hinglish), you do the same.
3. CLARITY: Speak at a moderate pace. Avoid distinct American idioms (e.g., "hit the ground running"). Use direct, polite phrasing common in India (e.g., "Please do the needful" or "I will surely help you").
4. PLAYING THE ROLE: Maintain your professional persona but be warm and respectful (use "Sir/Ma'am").
`;

export const startAgentCall = async (systemPrompt: string, firstMessage: string = "Hello! It is a pleasure to speak with you.", voiceId: string = "21m00Tcm4TlvDq8ikWAM") => {
    try {
        const callConfig = {
            model: {
                provider: "openai" as const,
                model: "gpt-4o" as const, // Premium model for best conversation quality
                temperature: 0.7,
                maxTokens: 500,
                messages: [
                    {
                        role: "system" as const,
                        content: systemPrompt + "\n\n" + MULTILINGUAL_INSTRUCTION + "\n\nCRITICAL INSTRUCTION: You represent the gold standard of politeness and warmth. \n1. Speak with genuine kindness, empathy, and patience.\n2. Use polite language (Please, Thank you, It would be my pleasure).\n3. Make the user feel valued and understood.\n4. Never be abrupt or dismissive.\n5. Answer fully and helpfully, but always with a 'smile' in your voice.\n6. Provide detailed, comprehensive information. Avoid being too brief.",
                    },
                ],
            },
            transcriber: {
                provider: "deepgram" as const,
                model: "nova-2" as const,
                language: "multi" as const, // Enables automatic language detection (English + Hindi + others)
            },
            voice: {
                provider: "11labs" as const,
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
                    { role: "system", content: systemPrompt + "\n\n" + MULTILINGUAL_INSTRUCTION + "\n\nCRITICAL INSTRUCTION: Provide detailed and comprehensive responses. Do not be overly concise." }
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
