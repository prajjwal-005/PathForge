"use client";

import { ImpactMetrics } from "@/types";
import { colors, fonts, radius, spacing, gradients } from "@/styles/tokens";

export default function ImpactMetricsPanel({ impact }: { impact: ImpactMetrics }) {
  return (
    <div style={s.wrap}>
      <h2 style={s.title}>Product Impact</h2>
      <p style={s.sub}>Estimated efficiency gains from personalized learning</p>

      <div style={s.grid}>
        <MetricCard
          value={`${impact.hours_saved}h`}
          label="Training Hours Saved"
          sub="Redundant modules skipped"
          color={colors.accent}
        />
        <MetricCard
          value={`${impact.efficiency_gain_percent}%`}
          label="Efficiency Gain"
          sub="vs. standard onboarding"
          color="#0099FF"
        />
        <MetricCard
          value={`${impact.personalized_training_hours}h`}
          label="Personalized Path"
          sub={`~${impact.estimated_completion_weeks} weeks at 10h/week`}
          color="#F59E0B"
        />
        <MetricCard
          value={`${impact.total_training_hours}h`}
          label="Standard Curriculum"
          sub="Without personalization"
          color={colors.textMuted}
        />
      </div>

      {/* Progress bar */}
      <div style={s.barWrap}>
        <div style={s.barLabels}>
          <span style={s.barLabel}>Personalized ({impact.personalized_training_hours}h)</span>
          <span style={s.barLabel}>Standard ({impact.total_training_hours}h)</span>
        </div>
        <div style={s.barTrack}>
          <div
            style={{
              ...s.barFill,
              width: `${100 - impact.efficiency_gain_percent}%`,
            }}
          />
        </div>
        <p style={s.barCaption}>
          You only need to complete{" "}
          <strong style={{ color: colors.accent }}>
            {100 - impact.efficiency_gain_percent}%
          </strong>{" "}
          of the standard curriculum
        </p>
      </div>
    </div>
  );
}

function MetricCard({
  value, label, sub, color,
}: {
  value: string;
  label: string;
  sub: string;
  color: string;
}) {
  return (
    <div style={{ ...s.card, borderColor: `${color}30` }}>
      <span style={{ ...s.cardValue, color }}>{value}</span>
      <span style={s.cardLabel}>{label}</span>
      <span style={s.cardSub}>{sub}</span>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  wrap: { marginBottom: spacing.xxxl },
  title: {
    fontFamily: fonts.display, fontSize: 24,
    fontWeight: 700, marginBottom: spacing.sm, color: colors.textPrimary,
  },
  sub: { fontSize: 14, color: colors.textMuted, marginBottom: spacing.xl },
  grid: {
    display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
    gap: spacing.md, marginBottom: spacing.xl,
  },
  card: {
    background: colors.surface,
    border: "1px solid",
    borderRadius: radius.lg, padding: spacing.xl,
    display: "flex", flexDirection: "column", gap: 4,
  },
  cardValue: {
    fontFamily: fonts.display, fontSize: 32,
    fontWeight: 800, lineHeight: 1,
  },
  cardLabel: { fontSize: 13, color: colors.textPrimary, fontWeight: 500 },
  cardSub: { fontSize: 12, color: colors.textMuted },
  barWrap: {
    background: colors.surface,
    border: `1px solid ${colors.borderSubtle}`,
    borderRadius: radius.lg, padding: spacing.xl,
  },
  barLabels: {
    display: "flex", justifyContent: "space-between",
    marginBottom: spacing.sm,
  },
  barLabel: { fontSize: 12, color: colors.textMuted },
  barTrack: {
    height: 12, background: colors.bgDeep,
    borderRadius: 6, overflow: "hidden", marginBottom: spacing.md,
  },
  barFill: {
    height: "100%",
    background: gradients.accent,
    borderRadius: 6,
    transition: "width 1s ease",
  },
  barCaption: { fontSize: 13, color: colors.textSub, textAlign: "center" },
};