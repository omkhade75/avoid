import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
}

export function StatCard({ icon: Icon, label, value, change, changeType = "neutral" }: StatCardProps) {
  const changeColor = {
    positive: "text-success",
    negative: "text-destructive",
    neutral: "text-muted-foreground",
  }[changeType];

  return (
    <div className="glass-3d rounded-2xl p-5 hover:scale-105 transition-transform duration-300">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-xs font-medium text-muted-foreground font-body">{label}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
        </div>
        {change && (
          <span className={`text-xs font-semibold ${changeColor}`}>{change}</span>
        )}
      </div>
    </div>
  );
}
