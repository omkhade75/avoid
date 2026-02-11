import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Bot,
  LayoutDashboard,
  Plus,
  Settings,
  BarChart3,
  Phone,
  Zap,
  ArrowLeft,
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Plus, label: "Create Agent", path: "/create" },
  { icon: Phone, label: "Call Center", path: "/calls" },
  { icon: BarChart3, label: "Analytics", path: "/analytics" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export function DashboardLayout({ children }: { children: ReactNode }) {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-gradient-dark">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-border bg-card/50 backdrop-blur-xl">
        <div className="flex h-16 items-center gap-3 border-b border-border px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary glow-pink">
            <Zap className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground">
            AgentForge
          </span>
          <span className="text-xs font-semibold text-gradient-neon">AI</span>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          <Link
            to="/"
            className="mb-4 flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3 w-3" /> Back to Home
          </Link>

          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${isActive
                    ? "bg-primary/10 text-primary glow-pink"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
          <Link
            to="/login"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            Logout
          </Link>
        </nav>

        <div className="border-t border-border p-4">
          <div className="glass-card flex items-center gap-3 rounded-xl px-3 py-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
              AF
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-foreground">Free Plan</p>
              <p className="text-xs text-muted-foreground">3 agents remaining</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 flex-1">
        <div className="bg-grid-pattern min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
}
