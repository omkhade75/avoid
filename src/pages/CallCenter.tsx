import { motion } from "framer-motion";
import { Phone, Search, Clock, User, Filter, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { callLogService } from "@/lib/database/supabase-service";

const CallCenter = () => {
    const { agents } = useAuth();
    const [recentCalls, setRecentCalls] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Load call history for all user agents
    useEffect(() => {
        loadAllCallLogs();
    }, [agents]);

    const loadAllCallLogs = async () => {
        try {
            setLoading(true);
            const allCalls: any[] = [];

            // Load call logs for each agent
            for (const agent of agents) {
                try {
                    const logs = await callLogService.getCallLogs(agent.id);
                    const formattedLogs = logs.map(log => ({
                        id: log.id,
                        agentName: agent.name,
                        agentId: agent.id,
                        customer: log.phone_number,
                        duration: formatDuration(log.duration),
                        status: log.status,
                        type: "outbound",
                        time: getRelativeTime(log.created_at),
                        timestamp: new Date(log.created_at).getTime()
                    }));
                    allCalls.push(...formattedLogs);
                } catch (error) {
                    console.error(`Failed to load logs for agent ${agent.name}:`, error);
                }
            }

            // Sort by most recent first
            allCalls.sort((a, b) => b.timestamp - a.timestamp);
            setRecentCalls(allCalls.slice(0, 10)); // Show last 10 calls
        } catch (error) {
            console.error("Failed to load call logs:", error);
            setRecentCalls([]);
        } finally {
            setLoading(false);
        }
    };

    const formatDuration = (seconds: number) => {
        if (seconds === 0) return "0s";
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
    };

    const getRelativeTime = (timestamp: string) => {
        const now = new Date().getTime();
        const then = new Date(timestamp).getTime();
        const diff = Math.floor((now - then) / 1000); // seconds

        if (diff < 60) return `${diff} secs ago`;
        if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
        return `${Math.floor(diff / 86400)} days ago`;
    };

    return (
        <DashboardLayout>
            <div className="p-8 space-y-8">
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">
                            Call <span className="text-gradient-neon">Center</span>
                        </h1>
                        <p className="mt-1 text-muted-foreground font-body">Manage active calls and view interaction history</p>
                    </div>
                    <div className="flex gap-3">
                        <div className="glass flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted-foreground">
                            <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                            <span>Vapi Network: Online</span>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Active Agents / Dialer */}
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 space-y-6">
                        <div className="glass-card rounded-2xl p-6">
                            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Phone className="h-5 w-5 text-primary" />
                                Quick Dialer
                            </h2>

                            <div className="relative mb-6">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Search agents or numbers..." className="pl-10 bg-secondary/50 border-white/10" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {agents.length > 0 ? (
                                    agents.map((agent) => (
                                        <div key={agent.id} className="p-4 rounded-xl bg-secondary/30 border border-white/5 hover:border-primary/50 transition-all group">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{agent.name}</h3>
                                                    <p className="text-xs text-muted-foreground">{agent.role}</p>
                                                </div>
                                                <div className={`h-2 w-2 rounded-full ${agent.status === 'active' ? 'bg-success' : 'bg-warning'}`} />
                                            </div>
                                            <div className="flex gap-2 mt-4">
                                                <Link to={`/agent/${agent.id}`} className="flex-1">
                                                    <Button variant="outline" className="w-full h-8 text-xs border-white/10 hover:bg-primary/10 hover:text-primary">
                                                        View
                                                    </Button>
                                                </Link>
                                                <Link to={`/agent/${agent.id}`} className="flex-1">
                                                    <Button className="w-full h-8 text-xs bg-primary/20 text-primary hover:bg-primary/30 border border-primary/20">
                                                        <Phone className="h-3 w-3 mr-1" /> Call
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-2 text-center py-8 text-muted-foreground">
                                        No agents available. <Link to="/create" className="text-primary underline">Create one</Link> to start calling.
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Recent History */}
                    <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-6">
                        <div className="glass-card rounded-2xl p-6 h-full">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-semibold flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-primary" />
                                    Recent Activity
                                </h2>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={loadAllCallLogs}>
                                    <Filter className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="space-y-4">
                                {loading ? (
                                    <div className="text-center py-8 text-muted-foreground text-sm">
                                        Loading call history...
                                    </div>
                                ) : recentCalls.length > 0 ? (
                                    recentCalls.map((call) => (
                                        <div key={call.id} className="p-3 rounded-xl bg-secondary/20 border border-white/5 hover:border-primary/30 transition-all">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    {call.type === "outbound" ? (
                                                        <ArrowUpRight className="h-4 w-4 text-primary" />
                                                    ) : (
                                                        <ArrowDownLeft className="h-4 w-4 text-blue-400" />
                                                    )}
                                                    <span className="text-xs font-semibold text-foreground">{call.agentName}</span>
                                                </div>
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full ${call.status === 'completed' ? 'bg-success/20 text-success' :
                                                    call.status === 'failed' ? 'bg-destructive/20 text-destructive' :
                                                        'bg-warning/20 text-warning'
                                                    }`}>
                                                    {call.status}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                                                <User className="h-3 w-3" />
                                                <span>{call.customer}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                                                <span>{call.duration}</span>
                                                <span>{call.time}</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground text-sm">
                                        No call history yet. Make your first call to see activity here.
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default CallCenter;
