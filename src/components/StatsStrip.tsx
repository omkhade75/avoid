import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";

const stats = [
  { value: 148, suffix: "M+", label: "API Calls" },
  { value: 1.5, suffix: "M+", label: "Agents Built", decimals: 1 },
  { value: 344, suffix: "K+", label: "Developers" },
  { value: 300, prefix: "<", suffix: "ms", label: "Latency" },
];

function AnimatedNumber({ value, suffix, prefix, decimals = 0 }: { value: number; suffix: string; prefix?: string; decimals?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const duration = 1500;
    const steps = 40;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, value]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl font-extrabold text-gradient-neon sm:text-5xl">
        {prefix}
        {decimals > 0 ? count.toFixed(decimals) : Math.floor(count)}
        {suffix}
      </div>
      <div className="mt-2 text-sm font-medium text-muted-foreground">{stats.find(s => s.value === value)?.label}</div>
    </div>
  );
}

export function StatsStrip() {
  return (
    <section className="relative z-10 border-y border-border bg-card/30">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 gap-8 md:grid-cols-4"
        >
          {stats.map((stat) => (
            <AnimatedNumber key={stat.label} {...stat} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
