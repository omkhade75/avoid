import { motion } from "framer-motion";
import { Bot, Plus, Search, Phone, MessageSquare, Activity } from "lucide-react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatCard } from "@/components/StatCard";
import { AgentCard } from "@/components/AgentCard";

import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const { agents, user } = useAuth();

  const stats = [
    { icon: Bot, label: "Active Agents", value: agents.filter(a => a.status === 'active').length.toString(), change: "+0 this week", changeType: "neutral" as const },
    { icon: Phone, label: "Total Calls", value: agents.reduce((acc, curr) => acc + curr.calls, 0).toLocaleString(), change: "+0%", changeType: "neutral" as const },
    { icon: MessageSquare, label: "Messages", value: agents.reduce((acc, curr) => acc + curr.messages, 0).toLocaleString(), change: "+0%", changeType: "neutral" as const },
    { icon: Activity, label: "Success Rate", value: agents.length > 0 ? "94.2%" : "0%", change: "+0%", changeType: "neutral" as const },
  ];

  return (
    <DashboardLayout>
      <div className="p-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Command <span className="text-gradient-neon">Center</span>
          </h1>
          <p className="mt-1 text-muted-foreground font-body">
            Welcome back, {user?.name || 'Commander'}. Monitor and manage your autonomous AI agents.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => <StatCard key={stat.label} {...stat} />)}
        </motion.div>

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Your Agents</h2>
          <div className="flex items-center gap-3">
            <div className="glass flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted-foreground">
              <Search className="h-4 w-4" />
              <span>Search agents...</span>
            </div>
            <Link to="/create" className="btn-neon flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold">
              <Plus className="h-4 w-4" /> New Agent
            </Link>
          </div>
        </div>

        {agents.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center p-12 glass-card rounded-3xl text-center">
            <Bot className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-foreground mb-2">No agents deployed</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              You haven't created any AI agents yet. Start by creating your first autonomous agent.
            </p>
            <Link to="/create" className="btn-neon flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold">
              <Plus className="h-4 w-4" /> Create First Agent
            </Link>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {agents.map((agent, i) => (
              <motion.div key={agent.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}>
                <AgentCard {...agent} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
