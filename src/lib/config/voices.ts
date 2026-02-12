
export interface VoiceOption {
    id: string;
    name: string;
    provider: "11labs" | "openai" | "playht";
    description: string;
    gender: "male" | "female";
}

export const AVAILABLE_VOICES: VoiceOption[] = [
    {
        id: "21m00Tcm4TlvDq8ikWAM",
        name: "Rachel",
        provider: "11labs",
        description: "American, calm, conversational - Great for narration/assistants",
        gender: "female"
    },
    {
        id: "AZnzlk1XvdvUeBnXmlld",
        name: "Domi",
        provider: "11labs",
        description: "American, strong, emphatic - Good for news/authoritative",
        gender: "female"
    },
    {
        id: "EXAVITQu4vr4xnSDxMaL",
        name: "Bella",
        provider: "11labs",
        description: "American, soft, pleasant - Good for fast-paced conversation",
        gender: "female"
    },
    {
        id: "ErXwobaYiN019PkySvjV",
        name: "Antoni",
        provider: "11labs",
        description: "American, well-rounded - Good for general purpose",
        gender: "male"
    },
    {
        id: "TxGEqnHWrfWFTfGW9XjX",
        name: "Josh",
        provider: "11labs",
        description: "American, deep, resonant - Good for storytelling",
        gender: "male"
    },
    {
        id: "VR6AewLTigWg4xSOukaG",
        name: "Arnold",
        provider: "11labs",
        description: "American, crisp, professional - Good for technical content",
        gender: "male"
    },
    {
        id: "MF3mGyEYCl7XYWbV9V6O",
        name: "Elli",
        provider: "11labs",
        description: "American, clear, youthful - Good for friendly assistants",
        gender: "female"
    }
];

export const DEFAULT_VOICE_ID = "21m00Tcm4TlvDq8ikWAM"; // Rachel
