import { Link } from "react-router-dom";
import { Zap, Github, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/30 py-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary glow-pink">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">
              AgentForge <span className="text-gradient-neon">AI</span>
            </span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Docs</a>
          </div>

          <div className="flex items-center gap-4 text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors"><Github className="h-5 w-5" /></a>
            <a href="#" className="hover:text-foreground transition-colors"><Twitter className="h-5 w-5" /></a>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          © 2026 AgentForge AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
