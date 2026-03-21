"use client";

import { useEffect, useRef, useState } from "react";
import { ImpactMetrics } from "@/types";
import { colors, fonts, radius, spacing, gradients } from "@/styles/tokens";

// ── Animated Counter ───────────────────────────────────────────────────────
function AnimatedNumber({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [current, setCurrent] = useState(0);
  const startRef = useRef<number | null>(null);
  const duration = 1200;

  useEffect(() => {
    let animId: number;
    function step(ts: number) {
      if (!startRef.current) startRef.current = ts;
      const progress = Math.min((ts - startRef.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCurrent(Math.round(eased * target));
      if (progress < 1) animId = requestAnimationFrame(step);
    }
    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [target]);

  return <>{current}{suffix}</>;
}

export default function ImpactMetricsPanel({ impact }: { impact: ImpactMetrics }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const pct = 100 - impact.efficiency_gain_percent;

  return (
    <div ref={ref} style={s.wrap}>
      <div style={s.titleRow}>
        <div>
          <h2 style={s.title}>⚡ Impact Metrics</h2>
          <p style={s.sub}>Estimated efficiency gains from your personalized pathway</p>
        </div>
        <div style={s.badge}>
          <span style={s.badgeDot} />
          <span style={s.badgeText}>
            {visible ? <AnimatedNumber target={impact.efficiency_gain_percent} suffix="%" /> : "0%"} efficiency gain
          </span>
        </div>
      </div>

      <div style={s.grid}>
        <MetricCard
          icon="⏱"
          value={visible ? <AnimatedNumber target={impact.hours_saved} suffix="h" /> : "0h"}
          label="Training Hours Saved"
          sub="Redundant modules skipped"
          color={colors.accent}
          delay={0}
        />
        <MetricCard
          icon="🚀"
          value={visible ? <AnimatedNumber target={impact.efficiency_gain_percent} suffix="%" /> : "0%"}
          label="Efficiency Gain"
          sub="vs. standard onboarding"
          color={colors.accentBlue}
          delay={1}
        />
        <MetricCard
          icon="📅"
          value={visible ? <AnimatedNumber target={impact.personalized_training_hours} suffix="h" /> : "0h"}
          label="Your Learning Path"
          sub={`~${impact.estimated_completion_weeks} weeks at 10h/week`}
          color={colors.warning}
          delay={2}
        />
        <MetricCard
          icon="📚"
          value={visible ? <AnimatedNumber target={impact.total_training_hours} suffix="h" /> : "0h"}
          label="Standard Curriculum"
          sub="Without personalization"
          color={colors.textMuted}
          delay={3}
        />
      </div>

      {/* Progress visualization */}
      <div style={s.progressWrap} className="hover-glow">
        <div style={s.progressHeader}>
          <div>
            <p style={s.progressTitle}>Your Path vs Standard Curriculum</p>
            <p style={s.progressSub}>
              You only need{" "}
              <strong style={{ color: colors.accent }}>
                {visible ? <AnimatedNumber target={pct} suffix="%" /> : `${pct}%`}
              </strong>{" "}
              of the standard curriculum
            </p>
          </div>
          <div style={s.progressLegend}>
            <span style={s.legendItem}>
              <span style={{ ...s.legendDot, background: gradients.accent }} />
              Personalized ({impact.personalized_training_hours}h)
            </span>
            <span style={s.legendItem}>
              <span style={{ ...s.legendDot, background: colors.textMuted }} />
              Standard ({impact.total_training_hours}h)
            </span>
          </div>
        </div>

        {/* Track */}
        <div style={s.barTrack}>
          {/* Background fill */}
          <div style={s.barBg} />
          {/* Animated fill */}
          <div style={{
            ...s.barFill,
            width: visible ? `${pct}%` : "0%",
            transition: "width 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }} />
          {/* Glow dot at end */}
          <div style={{
            position: "absolute",
            top: "50%", transform: "translateY(-50%)",
            left: visible ? `calc(${pct}% - 6px)` : "0%",
            width: 12, height: 12,
            borderRadius: "50%",
            background: colors.accent,
            boxShadow: `0 0 12px ${colors.accent}`,
            transition: "left 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }} />
        </div>

        {/* Tick marks */}
        <div style={s.ticks}>
          {[0, 25, 50, 75, 100].map((tick) => (
            <span key={tick} style={s.tick}>{tick}%</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── MetricCard ─────────────────────────────────────────────────────────────
function MetricCard({
  icon, value, label, sub, color, delay,
}: {
  icon: string;
  value: React.ReactNode;
  label: string;
  sub: string;
  color: string;
  delay: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        ...s.card,
        borderColor: hovered ? `${color}50` : `${color}20`,
        boxShadow: hovered ? `0 8px 32px ${color}15` : "none",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        transition: "all 0.3s ease",
        animation: `cardEntrance 0.5s ease ${delay * 0.1}s both`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span style={{ fontSize: 24 }}>{icon}</span>
        <div style={{
          width: 6, height: 6, borderRadius: "50%",
          background: color, boxShadow: `0 0 8px ${color}`,
          animation: "pulseGlow 2s ease-in-out infinite",
        }} />
      </div>
      <span style={{ ...s.cardValue, color }}>{value}</span>
      <span style={s.cardLabel}>{label}</span>
      <span style={s.cardSub}>{sub}</span>
    </div>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────
const s: Record<string, React.CSSProperties> = {
  wrap: { marginBottom: spacing.xxxl },
  titleRow: {
    display: "flex", justifyContent: "space-between",
    alignItems: "flex-start", marginBottom: spacing.xl,
    flexWrap: "wrap", gap: spacing.md,
  },
  title: {
    fontFamily: fonts.display, fontSize: 24,
    fontWeight: 700, marginBottom: spacing.xs,
    color: colors.textPrimary,
  },
  sub: { fontSize: 14, color: colors.textMuted },
  badge: {
    display: "flex", alignItems: "center", gap: 8,
    padding: "8px 16px",
    background: "rgba(0,212,170,0.08)",
    border: "1px solid rgba(0,212,170,0.2)",
    borderRadius: 20,
  },
  badgeDot: {
    width: 8, height: 8, borderRadius: "50%",
    background: colors.accent,
    boxShadow: "0 0 8px rgba(0,212,170,0.8)",
    animation: "pulseGlow 2s ease-in-out infinite",
  },
  badgeText: {
    fontSize: 13, color: colors.accent, fontWeight: 600,
  },
  grid: {
    display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
    gap: spacing.md, marginBottom: spacing.xl,
  },
  card: {
    background: "rgba(13,27,42,0.8)",
    backdropFilter: "blur(10px)",
    border: "1px solid",
    borderRadius: radius.lg, padding: spacing.xl,
    display: "flex", flexDirection: "column", gap: 6,
    cursor: "default",
  },
  cardValue: {
    fontFamily: fonts.display, fontSize: 32,
    fontWeight: 800, lineHeight: 1,
  },
  cardLabel: { fontSize: 13, color: colors.textPrimary, fontWeight: 500 },
  cardSub: { fontSize: 12, color: colors.textMuted },
  progressWrap: {
    background: "rgba(13,27,42,0.8)",
    backdropFilter: "blur(10px)",
    border: `1px solid ${colors.borderSubtle}`,
    borderRadius: radius.lg, padding: spacing.xl,
    transition: "all 0.3s ease",
  },
  progressHeader: {
    display: "flex", justifyContent: "space-between",
    alignItems: "flex-start", marginBottom: spacing.xl,
    flexWrap: "wrap", gap: spacing.md,
  },
  progressTitle: { fontSize: 15, color: colors.textPrimary, fontWeight: 600, marginBottom: 4 },
  progressSub: { fontSize: 13, color: colors.textMuted },
  progressLegend: { display: "flex", gap: spacing.xl },
  legendItem: {
    display: "flex", alignItems: "center", gap: 6,
    fontSize: 12, color: colors.textMuted,
  },
  legendDot: {
    display: "inline-block",
    width: 10, height: 10, borderRadius: 2,
  },
  barTrack: {
    position: "relative",
    height: 14, borderRadius: 7,
    background: "rgba(255,255,255,0.04)",
    overflow: "visible",
    marginBottom: spacing.sm,
  },
  barBg: {
    position: "absolute", inset: 0,
    borderRadius: 7,
    background: "rgba(255,255,255,0.04)",
  },
  barFill: {
    position: "absolute", top: 0, left: 0, bottom: 0,
    borderRadius: 7,
    background: gradients.accent,
    boxShadow: "0 0 20px rgba(0,212,170,0.4)",
  },
  ticks: {
    display: "flex", justifyContent: "space-between",
    padding: "0 2px",
  },
  tick: { fontSize: 11, color: colors.textMuted },
};
