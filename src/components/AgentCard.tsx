import { Bot, Phone, MessageSquare, Zap } from "lucide-react";
import { Link } from "react-router-dom";

interface AgentCardProps {
  id: string;
  name: string;
  role: string;
  status: "active" | "inactive" | "training";
  calls: number;
  messages: number;
  tools: number;
  autonomy: number;
}

export function AgentCard({ id, name, role, status, calls, messages, tools, autonomy }: AgentCardProps) {
  const statusStyles = {
    active: "bg-success/20 text-success",
    inactive: "bg-muted text-muted-foreground",
    training: "bg-warning/20 text-warning",
  };

  return (
    <Link
      to={`/agent/${id}`}
      className="group block glass-card card-3d rounded-2xl p-5 shimmer glow-3d"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
            <Bot className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{name}</h3>
            <p className="text-xs text-muted-foreground font-body">{role}</p>
          </div>
        </div>
        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${statusStyles[status]}`}>
          {status}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Phone className="h-3 w-3" />
          <span>{calls} calls</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MessageSquare className="h-3 w-3" />
          <span>{messages} msgs</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Zap className="h-3 w-3" />
          <span>{tools} tools</span>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Autonomy</span>
          <span className="font-mono text-primary">{autonomy}/5</span>
        </div>
        <div className="mt-1.5 h-1.5 rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-neon-purple transition-all"
            style={{ width: `${(autonomy / 5) * 100}%` }}
          />
        </div>
      </div>
    </Link>
  );
}
