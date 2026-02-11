import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

export function CTASection() {
  return (
    <section id="how-it-works" className="relative py-32 particle-bg">
      {/* Glow background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[600px] rounded-full bg-primary/8 blur-[150px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 text-xs font-medium text-accent">
            <Sparkles className="h-3.5 w-3.5" />
            Next Generation Platform
          </div>

          <h2 className="font-display text-4xl font-bold text-foreground sm:text-5xl lg:text-6xl">
            The Future of{" "}
            <span className="text-gradient-neon">Voice</span>
            <br />
            <span className="text-gradient-cyan">Interaction</span>
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground font-body">
            One prompt. Fully deployed. Voice-enabled AI agents that think, speak,
            and act — autonomously.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/signup"
              className="btn-neon inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-base font-semibold"
            >
              Open Studio
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
