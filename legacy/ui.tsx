import React from 'react';
import { motion } from 'framer-motion';

// Simple Framer Motion Wrapper for smooth fade-ins
export const FadeIn: React.FC<{
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}> = ({ children, delay = 0, duration = 0.5, className = "" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ delay, duration, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Reusable Metric Card for Dashboards
interface MetricCardProps {
  title: string;
  value: string | number;
  sub?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    positive: boolean;
  };
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  sub,
  icon,
  trend,
  className = ""
}) => {
  return (
    <div className={`card p-5 flex items-start justify-between ${className}`}>
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-wider text-ink-500">{title}</p>
        <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink-900">{value}</h2>
        {sub && <p className="text-xs text-ink-500">{sub}</p>}
        {trend && (
          <span className={`pill text-[10px] font-bold ${trend.positive ? "bg-green-100 text-green-700" : "bg-pink-100 text-pink-600"}`}>
            {trend.value}
          </span>
        )}
      </div>
      {icon && <div className="p-2.5 rounded-full bg-cream-100 text-ink-700">{icon}</div>}
    </div>
  );
};
