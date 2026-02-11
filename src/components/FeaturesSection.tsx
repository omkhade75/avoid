import { motion } from "framer-motion";
import { Bot, Mic, Wrench, Zap, Globe, Shield } from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "Custom AI Agents",
    description: "Generate fully autonomous agents from a single natural language prompt with intelligent intent detection.",
  },
  {
    icon: Mic,
    title: "Natural Voices",
    description: "Real-time bidirectional voice calling with speech-to-text, TTS synthesis, and human interruption handling.",
  },
  {
    icon: Wrench,
    title: "Tool Calling",
    description: "Auto-detected tool routing for calendars, CRMs, emails, databases, and custom API integrations.",
  },
  {
    icon: Zap,
    title: "Ultra-Low Latency",
    description: "Sub-300ms response times with optimized inference pipelines and edge-deployed agent runtimes.",
  },
  {
    icon: Globe,
    title: "Multi-Language",
    description: "Support for 30+ languages with automatic detection and culturally-aware response generation.",
  },
  {
    icon: Shield,
    title: "Enterprise Ready",
    description: "SOC2-ready architecture with audit logging, GDPR compliance, rate limiting, and prompt injection guards.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-24">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="font-display text-4xl font-bold text-foreground sm:text-5xl">
            Everything You <span className="text-gradient-neon">Need</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground font-body">
            A complete platform for building, deploying, and scaling intelligent voice AI agents.
          </p>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="glass-card rounded-2xl p-6"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground font-body">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
