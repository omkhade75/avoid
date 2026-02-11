import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Play } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center particle-bg bg-gradient-hero">
      <div className="relative z-10 mx-auto max-w-5xl px-6 pt-32 pb-20 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          Now with Ultra-Low Latency Voice AI
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display text-5xl font-extrabold leading-tight tracking-tight text-foreground sm:text-6xl lg:text-7xl"
        >
          Build Custom{" "}
          <span className="text-gradient-neon">Voice AI</span>
          <br />
          Agents in Minutes
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mx-auto mt-6 max-w-2xl text-lg font-body text-muted-foreground leading-relaxed"
        >
          Create, customize, and deploy autonomous AI agents with voice calling,
          LLM integration, tool-calling capabilities, and real-time analytics —
          all from a single prompt.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link
            to="/signup"
            className="btn-neon inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-base font-semibold"
          >
            Start Building
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/login"
            className="btn-outline-neon inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-base font-semibold"
          >
            <Play className="h-4 w-4" />
            Try Live Demo         </Link>
        </motion.div>

        {/* Hero glow orb */}
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />
        </div>
      </div>
    </section>
  );
}
