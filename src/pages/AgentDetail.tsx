import { motion } from "framer-motion";
import { useParams, Link, useLocation } from "react-router-dom";
import { Download, Play, Phone, Copy, ArrowLeft, Bot, MessageSquare, Activity, Zap, Brain, Shield, Globe, Mic, Volume2, UploadCloud, ArrowRight, UserCheck, Settings } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatCard } from "@/components/StatCard";
import { useAuth } from "@/contexts/AuthContext";
import { startAgentCall, stopAgentCall, vapi, makeOutboundCall } from "@/lib/api/vapi"; // Import makeOutboundCall
import { exportAgentAsZip } from "@/lib/agent-exporter";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect, useRef } from "react";
import ChatInterface from "@/components/ChatInterface";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input"; // Import Input

const agentConfig = {
  agent_name: "Luna Sales",
  role_definition: "Real Estate Lead Qualifier & Appointment Setter",
  tone_style: "Professional yet warm, conversational",
  memory_enabled: true,
  voice_enabled: true,
  autonomy_level: 4,
  risk_control: "medium",
  language: "English",
  tools_enabled: ["phone_call", "calendar_api", "crm_update", "email_send", "knowledge_base"],
  system_prompt: `You are Luna, an AI real estate sales agent. Your primary goal is to qualify inbound leads and schedule property viewings.\n\nRules:\n- Always be professional and helpful\n- Ask qualifying questions: budget, timeline, location preferences\n- Handle objections with empathy\n- Book appointments using the calendar tool\n- Log all interactions to CRM\n- Never make promises about pricing\n- Escalate to human agent if prospect is hostile`,
};

const AgentDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const userPrompt = location.state?.prompt;
  const { agents } = useAuth();
  const { toast } = useToast();
  const [isCalling, setIsCalling] = useState(false);
  const [callStatus, setCallStatus] = useState<"idle" | "connecting" | "listening" | "speaking">("idle");
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");
  const [targetPhoneNumber, setTargetPhoneNumber] = useState("");
  const [isOutboundCalling, setIsOutboundCalling] = useState(false);
  const [isIntegrating, setIsIntegrating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const agent = agents.find(a => a.id === id);

  const handleOutboundCall = async () => {
    if (!targetPhoneNumber.trim()) {
      toast({ title: "Phone number required", variant: "destructive" });
      return;
    }

    setIsOutboundCalling(true);
    console.log("📞 INITIATING OUTBOUND CALL");
    console.log("   Agent Name:", agent?.name);
    console.log("   First Message:", agent?.firstMessage);
    console.log("   Has System Prompt:", !!agent?.systemPrompt);

    if (!agent?.firstMessage) {
      console.error("⚠️ WARNING: No firstMessage found in agent data!");
    }

    toast({ title: "Initiating Outbound Call", description: `Calling ${targetPhoneNumber}...` });

    try {
      const greeting = agent?.firstMessage || `Hello! I'm calling from ${agent?.name || 'our organization'} to discuss an important matter with you.`;
      console.log("🎯 SENDING GREETING TO VAPI:", greeting);

      await makeOutboundCall(targetPhoneNumber, agent?.systemPrompt || "", greeting);
      toast({ title: "Call Successful", description: "Your phone should be ringing now!" });
    } catch (error: any) {
      console.error("❌ OUTBOUND CALL ERROR:", error);
      toast({
        title: "Outbound Call Failed",
        description: error.message || "Failed to initiate call. Check API configuration.",
        variant: "destructive"
      });
    } finally {
      setIsOutboundCalling(false);
    }
  };

  useEffect(() => {
    // Vapi Event Listeners for debugging and UI feedback
    const onCallStart = () => {
      console.log("Call started");
      setIsCalling(true);
      setCallStatus("listening");
      toast({ title: "Connected", description: "Agent is listening. Go ahead and speak." });
    };

    const onCallEnd = () => {
      console.log("Call ended");
      setIsCalling(false);
      setCallStatus("idle");
      setVolumeLevel(0);
    };

    const onSpeechStart = () => {
      setCallStatus("listening"); // User is speaking
    };

    const onSpeechEnd = () => {
      setCallStatus("speaking"); // Agent is processing/speaking
    };

    const onVolumeLevel = (level: number) => {
      setVolumeLevel(level);
    };

    const onError = (error: any) => {
      console.error("Vapi Error:", error);
      setCallStatus("idle");
      setIsCalling(false);
      toast({
        title: "Connection Error",
        description: "Lost connection to the voice server. Please check your microphone permissions.",
        variant: "destructive"
      });
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("volume-level", onVolumeLevel);
    vapi.on("error", onError);

    return () => {
      // Cleanup listeners
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("volume-level", onVolumeLevel);
      vapi.off("error", onError);
    };
  }, []);

  if (!agent) {
    return (
      <DashboardLayout>
        <div className="p-8 text-center bg-black/50 min-h-screen flex flex-col items-center justify-center">
          <Bot className="h-20 w-20 text-muted-foreground mb-4 opacity-20" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-2">Agent Not Found</h1>
          <p className="text-muted-foreground mb-6">The agent you are looking for does not exist or has been removed.</p>
          <Link to="/dashboard" className="text-primary hover:text-primary/80 transition-colors flex items-center gap-2 font-medium">
            <ArrowLeft className="h-4 w-4" /> Return to Dashboard
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const displayConfig = {
    ...agentConfig,
    agent_name: agent.name,
    role_definition: agent.role,
    autonomy_level: agent.autonomy,
    system_prompt: agent.systemPrompt || agentConfig.system_prompt,
    tools_enabled: ["phone_call", "calendar_api", "crm_update", "email_send", "knowledge_base"],
    voice_enabled: true,
    memory_enabled: true,
  };

  const userPromptToDisplay = agent.userPrompt || userPrompt;

  const handleCallToggle = async () => {
    if (isCalling) {
      stopAgentCall();
      setIsCalling(false);
      toast({ title: "Call Ended" });
    } else {
      try {
        const greeting = agent.firstMessage || `Hello! I am ${agent.name}. How can I help you today?`;
        await startAgentCall(displayConfig.system_prompt, greeting);
        setIsCalling(true);
      } catch (error) {
        toast({ title: "Call Failed", description: "Could not connect to voice server.", variant: "destructive" });
        setIsCalling(false);
      }
    }
  };

  const handleDownload = async () => {
    toast({ title: "Packaging Agent...", description: "Preparing ZIP download." });

    await exportAgentAsZip({
      name: agent.name,
      role: agent.role,
      systemPrompt: agent.systemPrompt || "",
      tools: [],
      autonomy: agent.autonomy
    });

    toast({ title: "Download Started", description: "Your agent package is ready." });
  };

  const handleIntegrateClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsIntegrating(true);
      toast({ title: "Processing Project", description: "Injecting agent widget into your files..." });

      const { integrateAgentToProject } = await import("@/lib/project-injector");
      await integrateAgentToProject(file, agent);

      toast({ title: "Integration Complete!", description: "Your project has been updated and downloaded." });
    } catch (error) {
      console.error(error);
      toast({ title: "Integration Failed", description: "Could not process the zip file. Please ensure it is a valid ZIP.", variant: "destructive" });
    } finally {
      setIsIntegrating(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };


  return (
    <DashboardLayout>
      <div className="p-8 space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
          <Link to="/dashboard" className="mb-6 inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-primary transition-colors bg-secondary/50 px-3 py-1.5 rounded-full border border-white/5">
            <ArrowLeft className="h-3 w-3" /> Back to Dashboard
          </Link>
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-3xl opacity-30 group-hover:opacity-60 blur transition duration-500"></div>
                <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-black border border-white/10 shadow-2xl">
                  <Bot className="h-10 w-10 text-primary drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]" />
                </div>
                <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-green-500 rounded-full border-[3px] border-black shadow-lg"></div>
              </div>
              <div className="space-y-1">
                <h1 className="text-4xl font-bold text-white tracking-tight">
                  {displayConfig.agent_name}
                </h1>
                <p className="text-lg text-muted-foreground font-medium flex items-center gap-2">
                  {displayConfig.role_definition}
                  <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full font-bold tracking-wider border border-primary/20">PRO</span>
                </p>
              </div>
            </div>

            <div className="flex gap-3 self-center md:self-start items-center">
              {isCalling && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 rounded-full border border-white/10 backdrop-blur-sm animate-in fade-in zoom-in duration-300">
                  <div className={`h-2 w-2 rounded-full ${callStatus === 'listening' ? 'bg-green-500 animate-pulse' : 'bg-blue-500 animate-bounce'}`} />
                  <span className="text-xs font-medium text-white uppercase tracking-wider">
                    {callStatus === 'listening' ? "Listening" : callStatus === 'speaking' ? "Speaking" : "Connecting..."}
                  </span>
                </div>
              )}

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".zip"
                className="hidden"
              />

              <button
                onClick={handleIntegrateClick}
                disabled={isIntegrating}
                className="btn-outline-neon flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-white/5 transition-all border border-white/10 hover:border-primary/50"
              >
                {isIntegrating ? (
                  <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                ) : (
                  <UploadCloud className="h-4 w-4" />
                )}
                Add into Project
              </button>

              <button
                onClick={handleDownload}
                className="btn-outline-neon flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-white/5 transition-all border border-white/10 hover:border-primary/50"
              >
                <Download className="h-4 w-4" /> Export Config
              </button>
              <button
                onClick={handleCallToggle}
                className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold shadow-lg transition-all hover:scale-105 active:scale-95 ${isCalling
                  ? "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 animate-pulse"
                  : "bg-gradient-to-r from-primary to-purple-600 text-white hover:shadow-primary/25 border border-white/10"}`}
              >
                {isCalling ? <Phone className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}
                {isCalling ? "End Call" : "Voice Call"}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={MessageSquare} label="Messages" value={agent ? (agent.messages || 0).toString() : "0"} change="+12 today" changeType="positive" />
          <StatCard icon={Phone} label="Total Calls" value={agent ? agent.calls.toString() : "0"} change="+0 today" changeType="neutral" />
          <StatCard icon={Activity} label="Knowledge" value="High" change="Expert" changeType="positive" />
          <StatCard icon={Zap} label="Response Time" value="0.8s" change="-0.2s" changeType="positive" />
        </motion.div>

        {/* Tabs Content */}
        <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="bg-secondary/30 p-1 rounded-xl mb-6 border border-white/5 inline-flex h-auto">
            <TabsTrigger value="overview" className="rounded-lg px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
              Overview
            </TabsTrigger>
            <TabsTrigger value="chat" className="rounded-lg px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all flex items-center gap-2">
              <MessageSquare className="h-4 w-4" /> Live Chat
              {agent?.messages > 0 && <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse" />}
            </TabsTrigger>
            <TabsTrigger value="settings" className="rounded-lg px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
              Settings
            </TabsTrigger>
            <TabsTrigger value="tasks" className="rounded-lg px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all flex items-center gap-2">
              <Activity className="h-4 w-4" /> Tasks & Flows
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="lg:col-span-2 space-y-6">
                {userPromptToDisplay && (
                  <div className="glass-card rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors"></div>
                    <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-foreground uppercase tracking-wider">
                      <Bot className="h-4 w-4 text-primary" /> Core Objective
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed italic">
                      "{userPromptToDisplay}"
                    </p>
                  </div>
                )}

                <div className="glass-card rounded-2xl p-6">
                  <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-foreground uppercase tracking-wider">
                    <Brain className="h-4 w-4 text-primary" /> System Directives
                  </h3>
                  <div className="relative">
                    <pre className="whitespace-pre-wrap rounded-xl bg-black/40 p-5 font-mono text-xs leading-relaxed text-gray-300 border border-white/5 max-h-[300px] overflow-auto custom-scrollbar">
                      {displayConfig.system_prompt}
                    </pre>
                    <div className="absolute top-2 right-2 flex gap-2">
                      <button className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors" title="Copy"><Copy className="h-3 w-3 text-muted-foreground" /></button>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-6">
                <div className="glass-card rounded-2xl p-6 border border-primary/20 bg-primary/5 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors"></div>
                  <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-foreground uppercase tracking-wider">
                    <Phone className="h-4 w-4 text-primary" /> Try Outbound Now
                  </h3>
                  <div className="space-y-4">
                    <p className="text-xs text-muted-foreground">Enter your phone number to get a real call from this agent on your mobile device.</p>
                    <div className="relative">
                      <Input
                        placeholder="+1234567890"
                        value={targetPhoneNumber}
                        onChange={(e) => setTargetPhoneNumber(e.target.value)}
                        className="bg-black/40 border-white/10 h-11 pl-4 rounded-xl text-sm"
                      />
                    </div>
                    <button
                      onClick={handleOutboundCall}
                      disabled={isOutboundCalling}
                      className="w-full btn-neon py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isOutboundCalling ? (
                        <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      ) : <Zap className="h-4 w-4" />}
                      {isOutboundCalling ? "Calling..." : "Try Now"}
                    </button>
                    <p className="text-[10px] text-center text-muted-foreground">Using Vapi Phone ID: ...4ce2d</p>
                  </div>
                </div>

                <div className="glass-card rounded-2xl p-6">
                  <h3 className="mb-5 text-sm font-bold text-foreground uppercase tracking-wider">Capabilities</h3>
                  <div className="flex flex-wrap gap-2">
                    {displayConfig.tools_enabled.map((tool) => (
                      <span key={tool} className="rounded-xl bg-secondary/50 px-3 py-1.5 text-xs font-semibold text-foreground border border-white/5 capitalize hover:border-primary/50 hover:text-primary transition-colors cursor-default">
                        {tool.replace(/_/g, " ")}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="glass-card rounded-2xl p-6">
                  <h3 className="mb-5 text-sm font-bold text-foreground uppercase tracking-wider">Autonomy Matrix</h3>
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground font-medium">Reasoning Level</span>
                        <span className="text-primary font-bold">Lvl {displayConfig.autonomy_level}</span>
                      </div>
                      <div className="h-2 rounded-full bg-secondary overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-primary shadow-[0_0_10px_rgba(236,72,153,0.5)]" style={{ width: `${(displayConfig.autonomy_level / 5) * 100}%` }} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="bg-secondary/30 p-3 rounded-xl border border-white/5 flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-green-500/20 flex items-center justify-center"><Shield className="h-4 w-4 text-green-500" /></div>
                        <div><p className="text-xs font-bold">Safety</p><p className="text-[10px] text-muted-foreground">High</p></div>
                      </div>
                      <div className="bg-secondary/30 p-3 rounded-xl border border-white/5 flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-blue-500/20 flex items-center justify-center"><Globe className="h-4 w-4 text-blue-500" /></div>
                        <div><p className="text-xs font-bold">Network</p><p className="text-[10px] text-muted-foreground">Enabled</p></div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="chat" className="mt-0">
            <ChatInterface agentId={agent.id} systemPrompt={displayConfig.system_prompt} agentName={displayConfig.agent_name} />
          </TabsContent>

          <TabsContent value="tasks" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">Mass Outbound Campaign</h3>
                    <p className="text-xs text-muted-foreground">Upload contacts for autonomous calling.</p>
                  </div>
                </div>
                <div className="border border-dashed border-white/20 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-white/5 transition-colors cursor-pointer dashed-area">
                  <UploadCloud className="h-8 w-8 text-muted-foreground mb-3" />
                  <p className="text-sm font-medium">Drop CSV file here</p>
                  <p className="text-xs text-muted-foreground mt-1">Name, Phone Number, Context</p>
                </div>
                <button className="w-full btn-neon py-2 rounded-xl text-sm font-bold">Start Campaign</button>
              </div>

              <div className="glass-card rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Download className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">Autonomous File Retrieval</h3>
                    <p className="text-xs text-muted-foreground">instruct agent to find and download assets.</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <input className="flex-1 bg-secondary/50 border border-white/10 rounded-xl px-4 py-2 text-sm" placeholder="e.g. 'Download Q3 finanical reports for Tesla'" />
                  <button className="bg-secondary/80 hover:bg-secondary p-2 rounded-xl border border-white/10"><ArrowRight className="h-4 w-4" /></button>
                </div>
                <div className="bg-black/20 rounded-xl p-4 min-h-[120px] flex items-center justify-center text-xs text-muted-foreground">
                  Agent is idle. No active downloads.
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Agent Identity */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-6 space-y-4">
                <h3 className="flex items-center gap-2 text-sm font-bold text-foreground uppercase tracking-wider mb-4">
                  <UserCheck className="h-4 w-4 text-primary" /> Agent Identity
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-muted-foreground font-medium">Agent Name</label>
                    <p className="text-sm font-bold text-white mt-1">{agent.name}</p>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground font-medium">Role</label>
                    <p className="text-sm font-bold text-white mt-1">{agent.role}</p>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground font-medium">Status</label>
                    <div className="flex items-center gap-2 mt-1">
                      <div className={`h-2 w-2 rounded-full ${agent.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}`} />
                      <p className="text-sm font-bold text-white capitalize">{agent.status}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground font-medium">Created</label>
                    <p className="text-sm text-white mt-1">{new Date(agent.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                </div>
              </motion.div>

              {/* First Message (Greeting) */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-2xl p-6 space-y-4">
                <h3 className="flex items-center gap-2 text-sm font-bold text-foreground uppercase tracking-wider mb-4">
                  <MessageSquare className="h-4 w-4 text-primary" /> First Message (Greeting)
                </h3>
                <div className="bg-black/40 rounded-xl p-4 border border-white/5">
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {agent.firstMessage || "Hello! How can I assist you today?"}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  This is the first thing the agent says when a call connects.
                </p>
              </motion.div>

              {/* Configuration */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-2xl p-6 space-y-4">
                <h3 className="flex items-center gap-2 text-sm font-bold text-foreground uppercase tracking-wider mb-4">
                  <Settings className="h-4 w-4 text-primary" /> Configuration
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-muted-foreground font-medium">Autonomy Level</label>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-primary" style={{ width: `${(agent.autonomy / 5) * 100}%` }} />
                      </div>
                      <span className="text-sm font-bold text-primary">Level {agent.autonomy}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground font-medium">Tools Enabled</label>
                    <p className="text-sm font-bold text-white mt-1">{agent.tools} tools</p>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground font-medium">Voice Provider</label>
                    <p className="text-sm text-white mt-1">ElevenLabs (Rachel)</p>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground font-medium">AI Model</label>
                    <p className="text-sm text-white mt-1">GPT-4o (OpenAI)</p>
                  </div>
                </div>
              </motion.div>

              {/* User Prompt */}
              {agent.userPrompt && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card rounded-2xl p-6 space-y-4">
                  <h3 className="flex items-center gap-2 text-sm font-bold text-foreground uppercase tracking-wider mb-4">
                    <Bot className="h-4 w-4 text-primary" /> Original Request
                  </h3>
                  <div className="bg-black/40 rounded-xl p-4 border border-white/5">
                    <p className="text-sm text-gray-300 italic">"{agent.userPrompt}"</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This was your original description when creating this agent.
                  </p>
                </motion.div>
              )}

              {/* System Prompt */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card rounded-2xl p-6 space-y-4 lg:col-span-2">
                <h3 className="flex items-center gap-2 text-sm font-bold text-foreground uppercase tracking-wider mb-4">
                  <Brain className="h-4 w-4 text-primary" /> Complete System Prompt
                </h3>
                <div className="relative">
                  <pre className="whitespace-pre-wrap rounded-xl bg-black/40 p-5 font-mono text-xs leading-relaxed text-gray-300 border border-white/5 max-h-[400px] overflow-auto custom-scrollbar">
                    {agent.systemPrompt || "No system prompt configured."}
                  </pre>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(agent.systemPrompt || "");
                      toast({ title: "Copied!", description: "System prompt copied to clipboard" });
                    }}
                    className="absolute top-2 right-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <Copy className="h-3 w-3 text-muted-foreground" />
                  </button>
                </div>
              </motion.div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AgentDetail;
