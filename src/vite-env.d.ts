
/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_VAPI_PUBLIC_KEY: string
    readonly VITE_OPENAI_API_KEY: string
    readonly VITE_GEMINI_API_KEY: string
    readonly VITE_ELEVENLABS_API_KEY: string
    readonly VITE_TWILIO_API_KEY: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
