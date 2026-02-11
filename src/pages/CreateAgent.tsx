
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, ArrowRight, Phone, Calendar, Mail, Database, Brain, Sparkles, MessageSquare, Shield, Globe, UserCheck, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { generateAgentConfig, AgentOptions, generateInterviewQuestions } from "@/lib/api/agent-generator";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const toolSuggestions = [
  { icon: Phone, label: "Voice Calling" },
  { icon: Calendar, label: "Calendar API" },
  { icon: Mail, label: "Email Automation" },
  { icon: Database, label: "Memory / KB" },
];

const CreateAgent = () => {
  const [step, setStep] = useState<"describe" | "analyze" | "interview" | "customize" | "generate">("describe");
  const [prompt, setPrompt] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [config, setConfig] = useState<AgentOptions>({
    tone: "Professional and Helpful",
    expertise: "senior",
    language: "English",
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const navigate = useNavigate();
  const { addAgent } = useAuth();
  const { toast } = useToast();

  const generationSteps = [
    "Analyzing intent & logic...",
    "PHASE 1: Architecting core logic...",
    "PHASE 2: Neural refinement protocols...",
    "Injecting domain expertise...",
    "Forging mandatory greeting logic...",
    "Crafting specialized persona...",
    "Executing boundary stress-tests...",
    "Deploying to elite neural network...",
  ];

  const handleNext = async () => {
    if (step === "describe" && prompt.trim()) {
      setStep("analyze");
      try {
        const q = await generateInterviewQuestions(prompt);
        setQuestions(q);
        setStep("interview");
        setCurrentQuestionIndex(0);
      } catch (e) {
        setStep("customize");
      }
    } else if (step === "interview") {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        setStep("customize");
      }
    }
  };

  const handleBack = () => {
    if (step === "customize") {
      setStep("interview");
    } else if (step === "interview") {
      if (currentQuestionIndex > 0) {
        setCurrentQuestionIndex(prev => prev - 1);
      } else {
        setStep("describe");
      }
    }
  };

  const handleGenerate = async () => {
    setStep("generate");
    setIsGenerating(true);
    setGenerationStep(0);

    const progressInterval = setInterval(() => {
      setGenerationStep((prev) => (prev < generationSteps.length - 1 ? prev + 1 : prev));
    }, 2500); // Slowed down for proper perception of deep work

    try {
      const generatedConfig = await generateAgentConfig(prompt, {
        ...config,
        contextualAnswers: answers
      });

      clearInterval(progressInterval);
      setGenerationStep(generationSteps.length - 1);

      setTimeout(() => {
        console.log("💾 SAVING AGENT WITH GREETING:", generatedConfig.firstMessage);
        const newAgentId = addAgent({
          name: generatedConfig.name,
          role: generatedConfig.role,
          status: "active",
          tools: generatedConfig.tools.length,
          autonomy: generatedConfig.autonomy,
          userPrompt: prompt,
          systemPrompt: generatedConfig.systemPrompt,
          firstMessage: generatedConfig.firstMessage
        });

        console.log("✅ AGENT SAVED. ID:", newAgentId);

        toast({
          title: "Agent Forged Successfully",
          description: `${generatedConfig.name} is now online.`,
        });

        navigate(`/agent/${newAgentId}`);
      }, 800);

    } catch (error) {
      console.error("Generation failed:", error);
      clearInterval(progressInterval);
      setIsGenerating(false);
      setStep("customize");
      toast({
        title: "Generation Failed",
        description: "There was an error while forging your agent.",
        variant: "destructive"
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="flex min-h-screen items-center justify-center p-8 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent">
        <div className="w-full max-w-3xl">
          <AnimatePresence mode="wait">
            {step === "describe" && (
              <motion.div
                key="describe"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 border border-primary/20 shadow-[0_0_30px_rgba(236,72,153,0.2)] animate-glow-pulse">
                    <Brain className="h-10 w-10 text-primary" />
                  </div>
                  <h1 className="text-5xl font-extrabold text-white tracking-tight">
                    Forge Your <span className="text-gradient-neon">AI Vision</span>
                  </h1>
                  <p className="mt-4 text-muted-foreground text-lg max-w-lg mx-auto leading-relaxed">
                    Start by describing the core purpose of your agent. Be as detailed or as simple as you like.
                  </p>
                </div>

                <div className="glass-card rounded-3xl p-1.5 shadow-2xl transition-all focus-within:ring-2 ring-primary/50 relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-3xl blur opacity-10 group-focus-within:opacity-30 transition duration-1000"></div>
                  <div className="relative bg-[#0A0A0B] rounded-3xl p-4">
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="e.g., Build an AI that helps users find the best laptops based on their budget and needs..."
                      rows={5}
                      className="w-full resize-none bg-transparent px-4 py-3 text-white placeholder:text-muted-foreground/50 focus:outline-none text-lg leading-relaxed"
                    />
                    <div className="flex items-center justify-between mt-4 border-t border-white/5 pt-4">
                      <div className="flex gap-3">
                        {toolSuggestions.map((tool) => (
                          <div key={tool.label} className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-1.5 text-xs font-medium text-muted-foreground border border-white/5">
                            <tool.icon className="h-3.5 w-3.5 text-primary" />
                            {tool.label}
                          </div>
                        ))}
                      </div>
                      <Button
                        onClick={handleNext}
                        disabled={!prompt.trim()}
                        className="bg-primary hover:bg-primary/90 text-white rounded-2xl px-8 h-12 text-sm font-bold shadow-lg shadow-primary/20"
                      >
                        Next Step <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 opacity-60">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <p className="text-xs text-muted-foreground font-medium">World-class GPT-4 reasoning</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4">
                    <Shield className="h-5 w-5 text-primary" />
                    <p className="text-xs text-muted-foreground font-medium">Auto-scaling infrastructure</p>
                  </div>
                </div>
              </motion.div>
            )}

            {step === "analyze" && (
              <motion.div
                key="analyze"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-20 space-y-6"
              >
                <div className="h-16 w-16 bg-primary/20 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
                <p className="text-xl font-bold text-white">AI is analyzing your vision...</p>
              </motion.div>
            )}

            {step === "interview" && (
              <motion.div
                key="interview"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <span className="text-primary font-bold tracking-widest uppercase text-xs">Requirement gathering</span>
                  <h2 className="text-3xl font-bold text-white mt-2">Just a few more details...</h2>
                  <div className="flex justify-center gap-1 mt-4">
                    {questions.map((_, i) => (
                      <div key={i} className={`h-1.5 w-8 rounded-full transition-all ${i <= currentQuestionIndex ? "bg-primary" : "bg-white/10"}`} />
                    ))}
                  </div>
                </div>

                <div className="glass-card rounded-[40px] p-10 border border-white/10 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px]" />
                  <div className="relative space-y-6">
                    <Label className="text-2xl font-bold text-white block text-center mb-8">
                      {questions[currentQuestionIndex]}
                    </Label>
                    <Input
                      autoFocus
                      value={answers[questions[currentQuestionIndex]] || ""}
                      onChange={(e) => setAnswers({ ...answers, [questions[currentQuestionIndex]]: e.target.value })}
                      onKeyDown={(e) => e.key === "Enter" && answers[questions[currentQuestionIndex]] && handleNext()}
                      className="h-16 bg-white/5 border-white/10 rounded-2xl text-xl px-6 focus:ring-primary focus:border-primary text-center"
                      placeholder="Type your answer here..."
                    />
                    <div className="flex justify-between items-center pt-8">
                      <Button variant="ghost" onClick={handleBack} className="text-muted-foreground hover:text-white">
                        <ChevronLeft className="h-4 w-4 mr-2" /> Previous
                      </Button>
                      <Button
                        onClick={handleNext}
                        disabled={!answers[questions[currentQuestionIndex]]}
                        className="bg-primary hover:bg-primary/90 text-white rounded-2xl px-10 h-12 font-bold"
                      >
                        {currentQuestionIndex === questions.length - 1 ? "Customize Tone" : "Next Detail"} <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === "customize" && (
              <motion.div
                key="customize"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="icon" onClick={handleBack} className="rounded-full hover:bg-white/5 border border-white/5 h-12 w-12">
                    <ChevronLeft className="h-6 w-6 text-white" />
                  </Button>
                  <div>
                    <h2 className="text-3xl font-bold text-white">Fine-tune Personality</h2>
                    <p className="text-muted-foreground text-sm">Define exactly how your agent should behave and speak.</p>
                  </div>
                </div>

                <div className="glass-card rounded-3xl p-8 space-y-10 border border-white/10">
                  {/* Tone Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <MessageSquare className="h-5 w-5 text-primary" />
                      <Label className="text-lg font-bold text-white">Voice Tone</Label>
                    </div>
                    <RadioGroup
                      value={config.tone}
                      onValueChange={(v) => setConfig({ ...config, tone: v })}
                      className="grid grid-cols-2 md:grid-cols-4 gap-3"
                    >
                      {["Professional", "Friendly", "Authoritative", "Kind & Patient", "Humorous", "Minimalist"].map((t) => (
                        <div key={t}>
                          <RadioGroupItem value={t} id={t} className="peer sr-only" />
                          <Label
                            htmlFor={t}
                            className="flex h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-sm font-medium peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 peer-data-[state=checked]:text-primary cursor-pointer hover:bg-white/10 transition-all"
                          >
                            {t}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  {/* Expertise Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <UserCheck className="h-5 w-5 text-primary" />
                        <Label className="text-lg font-bold text-white">Expertise Level</Label>
                      </div>
                      <Select
                        value={config.expertise}
                        onValueChange={(v: any) => setConfig({ ...config, expertise: v })}
                      >
                        <SelectTrigger className="bg-white/5 border-white/10 h-14 rounded-2xl">
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#0A0A0B] border-white/10 text-white">
                          <SelectItem value="junior">Junior Assistant</SelectItem>
                          <SelectItem value="mid-level">Professional Expert</SelectItem>
                          <SelectItem value="senior">Senior Specialist</SelectItem>
                          <SelectItem value="executive">Strategic Advisor</SelectItem>
                          <SelectItem value="world-class">World-Class Authority</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Globe className="h-5 w-5 text-primary" />
                        <Label className="text-lg font-bold text-white">Primary Language</Label>
                      </div>
                      <Select
                        value={config.language}
                        onValueChange={(v) => setConfig({ ...config, language: v })}
                      >
                        <SelectTrigger className="bg-white/5 border-white/10 h-14 rounded-2xl">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#0A0A0B] border-white/10 text-white">
                          <SelectItem value="English">English</SelectItem>
                          <SelectItem value="Spanish">Spanish</SelectItem>
                          <SelectItem value="French">French</SelectItem>
                          <SelectItem value="German">German</SelectItem>
                          <SelectItem value="Japanese">Japanese</SelectItem>
                          <SelectItem value="Hindi">Hindi</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end p-2 px-10">
                  <Button
                    onClick={handleGenerate}
                    className="bg-primary hover:bg-primary/90 text-white rounded-2xl px-12 h-14 text-base font-bold shadow-2xl shadow-primary/30 animate-in fade-in slide-in-from-bottom-2"
                  >
                    Forge Dynamic Agent <Sparkles className="h-5 w-5 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === "generate" && (
              <motion.div
                key="generate"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card rounded-[40px] p-12 text-center space-y-8 border border-white/10 shadow-[0_0_100px_rgba(236,72,153,0.15)]"
              >
                <div className="relative mx-auto h-32 w-32 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                  <Sparkles className="h-12 w-12 text-primary animate-pulse" />
                </div>

                <div className="space-y-2">
                  <h2 className="text-3xl font-bold text-white">Building Your AI Consultant</h2>
                  <p className="text-muted-foreground">Integrating {config.expertise} knowledge with {config.tone} personality...</p>
                </div>

                <div className="space-y-4 max-w-sm mx-auto">
                  {generationSteps.map((s, i) => (
                    <motion.div
                      key={s}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{
                        opacity: i <= generationStep ? 1 : 0.2,
                        scale: i === generationStep ? 1.05 : 1,
                        y: 0
                      }}
                      className="flex items-center gap-3"
                    >
                      <div className={`h-2.5 w-2.5 rounded-full transition-all duration-500 ${i < generationStep ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]" : i === generationStep ? "bg-primary animate-ping" : "bg-white/10"}`} />
                      <span className={`text-sm font-bold ${i <= generationStep ? "text-white" : "text-muted-foreground"}`}>{s}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateAgent;
