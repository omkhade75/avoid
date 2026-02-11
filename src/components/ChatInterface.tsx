
import { useState, useRef, useEffect } from "react";
import { Send, User, Bot, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import OpenAI from "openai";
import { useToast } from "@/components/ui/use-toast";

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
});

interface ChatInterfaceProps {
    agentId: string;
    systemPrompt: string;
    agentName: string;
}

const ChatInterface = ({ agentId, systemPrompt, agentName }: ChatInterfaceProps) => {
    const { agents, updateAgent } = useAuth();
    const agent = agents.find(a => a.id === agentId);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();

    const messages = agent?.chatHistory || [];

    useEffect(() => {
        if (scrollRef.current) {
            setTimeout(() => {
                scrollRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 100);
        }
    }, [messages.length]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { role: "user" as const, content: input, timestamp: new Date().toISOString() };
        const newHistory = [...messages, userMsg];

        // Update local state and persist immediate user message
        updateAgent(agentId, { chatHistory: newHistory });
        setInput("");
        setIsLoading(true);

        try {
            const completion = await openai.chat.completions.create({
                model: "gpt-4-turbo",
                messages: [
                    { role: "system", content: systemPrompt },
                    ...newHistory.map(m => ({ role: m.role, content: m.content }))
                ],
            });

            const responseContent = completion.choices[0].message.content || "I apologize, I couldn't generate a response.";
            const assistantMsg = { role: "assistant" as const, content: responseContent, timestamp: new Date().toISOString() };

            const assistantHistory = [...newHistory, assistantMsg];
            updateAgent(agentId, {
                chatHistory: assistantHistory,
                messages: (agent?.messages || 0) + 2
            });

        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "Failed to get response from AI.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    const clearChat = () => {
        if (confirm("Are you sure you want to clear the conversation history?")) {
            updateAgent(agentId, { chatHistory: [] });
        }
    }

    return (
        <div className="flex flex-col h-[600px] glass-card rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-white/10 bg-black/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center animate-glow-pulse">
                        <Bot className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-foreground flex items-center gap-2">{agentName} <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded border border-primary/20">GPT-4 Turbo</span></h3>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" /> Online & Ready
                        </p>
                    </div>
                </div>
                <Button variant="ghost" size="icon" onClick={clearChat} title="Clear Chat" className="text-muted-foreground hover:text-white">
                    <RefreshCw className="h-4 w-4" />
                </Button>
            </div>

            <ScrollArea className="flex-1 p-4 bg-gradient-to-b from-transparent to-black/20">
                <div className="space-y-6">
                    {messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-muted-foreground">
                            <div className="h-16 w-16 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
                                <Bot className="h-8 w-8 opacity-50" />
                            </div>
                            <p className="text-sm font-medium">No messages yet.</p>
                            <p className="text-xs opacity-70">Start a conversation to test your agent.</p>
                        </div>
                    )}

                    {messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                <Avatar className="h-8 w-8 mt-1 border border-white/10">
                                    <AvatarFallback className={msg.role === 'user' ? 'bg-blue-600/20 text-blue-400' : 'bg-primary/20 text-primary'}>
                                        {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                                    </AvatarFallback>
                                </Avatar>
                                <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                    <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'user'
                                            ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-tr-none'
                                            : 'bg-secondary/80 backdrop-blur-sm text-foreground rounded-tl-none border border-white/5'
                                        }`}>
                                        {msg.content}
                                    </div>
                                    <span className="text-[10px] text-muted-foreground mt-1 opacity-50 px-1">
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="flex gap-3 max-w-[85%]">
                                <Avatar className="h-8 w-8 mt-1 border border-white/10">
                                    <AvatarFallback className="bg-primary/20 text-primary">
                                        <Bot className="h-4 w-4" />
                                    </AvatarFallback>
                                </Avatar>
                                <div className="px-4 py-3 rounded-2xl bg-secondary/50 backdrop-blur-sm text-foreground rounded-tl-none border border-white/5">
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="h-3 w-3 animate-spin text-primary" />
                                        <span className="text-xs font-medium text-muted-foreground">Thinking...</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={scrollRef} />
                </div>
            </ScrollArea>

            <div className="p-4 bg-black/40 border-t border-white/10 backdrop-blur-md">
                <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-3 relative">
                    <Input
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder={`Message ${agentName}...`}
                        className="bg-secondary/50 border-white/10 focus-visible:ring-primary h-12 pr-12 text-sm shadow-inner"
                        disabled={isLoading}
                    />
                    <Button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="absolute right-1 top-1 h-10 w-10 bg-primary hover:bg-primary/90 rounded-lg p-0 shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default ChatInterface;
