"use client";

import { useState } from "react";
import { SkillGap } from "@/types";
import { colors, fonts, radius, spacing } from "@/styles/tokens";

export default function SkillGapChart({ skillGap }: { skillGap: SkillGap }) {
  const [open, setOpen]             = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [filter, setFilter]         = useState<"all" | "have" | "missing">("all");

  const allData = [
    ...skillGap.resume_skills.map((s) => ({ skill: s, status: "have" as const })),
    ...skillGap.missing_skills.map((s) => ({ skill: s, status: "missing" as const })),
  ];

  const data         = filter === "all" ? allData : allData.filter((d) => d.status === filter);
  const haveCount    = skillGap.resume_skills.length;
  const missingCount = skillGap.missing_skills.length;
  const total        = haveCount + missingCount;
  const havePercent  = Math.round((haveCount / total) * 100);

  return (
    <div style={s.outerWrap}>

      {/* ── Dropdown Toggle Button ─────────────────────── */}
      <button
        style={{
          ...s.toggleBtn,
          borderBottomLeftRadius:  open ? 0 : 20,
          borderBottomRightRadius: open ? 0 : 20,
          borderBottom: open
            ? "1px solid rgba(0,212,170,0.06)"
            : "1px solid rgba(0,212,170,0.1)",
          background: open
            ? "rgba(0,212,170,0.07)"
            : "rgba(13,27,42,0.85)",
        }}
        onClick={() => setOpen(!open)}
      >
        {/* Left: icon + text */}
        <div style={s.toggleLeft}>
          <span style={{ fontSize: 20 }}>📊</span>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <span style={s.toggleTitle}>Skill Gap Analysis</span>
            <span style={s.toggleMeta}>
              {haveCount} have · {missingCount} missing · {havePercent}% coverage
            </span>
          </div>
        </div>

        {/* Right: mini bar + percent + chevron */}
        <div style={s.toggleRight}>
          {/* Mini progress track */}
          <div style={s.miniTrack}>
            <div style={{
              ...s.miniFill,
              width: `${havePercent}%`,
            }} />
          </div>
          <span style={{ fontSize: 13, color: colors.accent, fontWeight: 700, minWidth: 36 }}>
            {havePercent}%
          </span>
          <span style={{
            fontSize: 11, color: colors.textMuted,
            display: "inline-block",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.35s ease",
          }}>
            ▼
          </span>
        </div>
      </button>

      {/* ── Collapsible Panel ──────────────────────────── */}
      <div style={{
        maxHeight: open ? "2000px" : "0px",
        overflow: "hidden",
        transition: "max-height 0.45s cubic-bezier(0.4,0,0.2,1)",
      }}>
        <div style={s.panel}>

          {/* Header row: summary + filter pills */}
          <div style={s.header}>
            <p style={s.subtitle}>
              You have{" "}
              <strong style={{ color: colors.accent }}>{haveCount}</strong> of{" "}
              <strong style={{ color: colors.textPrimary }}>{total}</strong> required skills
            </p>
            <div style={s.filterRow}>
              {(["all", "have", "missing"] as const).map((f) => (
                <button
                  key={f}
                  style={{
                    ...s.filterBtn,
                    ...(filter === f ? {
                      background: f === "missing"
                        ? "rgba(255,107,107,0.15)"
                        : "rgba(0,212,170,0.12)",
                      borderColor: f === "missing" ? colors.danger : colors.accent,
                      color: f === "missing" ? colors.danger : colors.accent,
                    } : {}),
                  }}
                  onClick={() => setFilter(f)}
                >
                  {f === "all"
                    ? `All (${total})`
                    : f === "have"
                    ? `✓ Have (${haveCount})`
                    : `✗ Missing (${missingCount})`}
                </button>
              ))}
            </div>
          </div>

          {/* Overall progress bar */}
          <div style={s.progressSection}>
            <div style={s.progressLabels}>
              <span style={{ fontSize: 12, color: colors.textMuted }}>Skill Coverage</span>
              <span style={{ fontSize: 12, color: colors.accent, fontWeight: 700 }}>{havePercent}%</span>
            </div>
            <div style={s.progressTrack}>
              <div style={{
                ...s.progressFill,
                width: `${havePercent}%`,
                transition: open ? "width 1s cubic-bezier(0.34,1.56,0.64,1) 0.2s" : "none",
              }} />
              <div style={{
                position: "absolute", top: "50%",
                left: `${havePercent}%`,
                transform: "translate(-50%, -50%)",
                width: 12, height: 12, borderRadius: "50%",
                background: colors.accent,
                boxShadow: `0 0 10px ${colors.accent}`,
                transition: open ? "left 1s cubic-bezier(0.34,1.56,0.64,1) 0.2s" : "none",
              }} />
            </div>
            <div style={s.progressLabels}>
              <span style={{ fontSize: 11, color: colors.accent }}>▓ {haveCount} skills you have</span>
              <span style={{ fontSize: 11, color: colors.danger }}>░ {missingCount} skills missing</span>
            </div>
          </div>

          {/* Skill bars */}
          <div style={s.barsWrap}>
            {data.map((entry, i) => {
              const isHave    = entry.status === "have";
              const isHovered = hoveredIndex === i;
              const barColor  = isHave ? colors.accent : colors.danger;

              return (
                <div
                  key={i}
                  style={{
                    ...s.row,
                    background: isHovered ? `${barColor}08` : "transparent",
                    borderRadius: 10,
                    transition: "background 0.2s ease",
                  }}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Status icon */}
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                    background: isHave ? "rgba(0,212,170,0.12)" : "rgba(255,107,107,0.12)",
                    border: `1px solid ${barColor}40`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, color: barColor,
                    transition: "all 0.2s ease",
                    transform: isHovered ? "scale(1.1)" : "scale(1)",
                  }}>
                    {isHave ? "✓" : "✗"}
                  </div>

                  {/* Skill label */}
                  <div style={{
                    width: 180, flexShrink: 0,
                    fontSize: 13,
                    color: isHovered ? colors.textPrimary : colors.textSub,
                    fontFamily: fonts.body,
                    fontWeight: isHovered ? 500 : 400,
                    transition: "all 0.2s ease",
                    wordBreak: "break-word" as const,
                    lineHeight: 1.3,
                    paddingRight: 8,
                  }}>
                    {entry.skill}
                  </div>

                  {/* Bar */}
                  <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                      flex: 1, height: 10, borderRadius: 5,
                      background: "rgba(255,255,255,0.04)",
                      overflow: "hidden", position: "relative",
                    }}>
                      <div style={{
                        height: "100%",
                        width: isHovered ? "100%" : "96%",
                        borderRadius: 5,
                        background: isHave
                          ? `linear-gradient(90deg, ${colors.accent}CC, ${colors.accent})`
                          : `linear-gradient(90deg, ${colors.danger}CC, ${colors.danger})`,
                        boxShadow: isHovered ? `0 0 12px ${barColor}60` : "none",
                        transition: "width 0.4s ease, box-shadow 0.2s ease",
                        position: "relative",
                      }}>
                        <div style={{
                          position: "absolute", inset: 0,
                          background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)",
                          backgroundSize: "200% 100%",
                          animation: isHovered ? "shimmer 1.5s infinite" : "none",
                        }} />
                      </div>
                    </div>

                    {/* Badge */}
                    <span style={{
                      fontSize: 11, flexShrink: 0,
                      padding: "2px 8px", borderRadius: 4,
                      background: isHave ? "rgba(0,212,170,0.1)" : "rgba(255,107,107,0.1)",
                      border: `1px solid ${barColor}30`,
                      color: barColor, fontWeight: 600,
                      minWidth: 58, textAlign: "center" as const,
                      transition: "all 0.2s ease",
                      opacity: isHovered ? 1 : 0.7,
                    }}>
                      {isHave ? "Have ✓" : "Missing"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div style={s.legend}>
            <div style={s.legendItem}>
              <div style={{ ...s.legendDot, background: colors.accent, boxShadow: `0 0 8px ${colors.accent}` }} />
              <span>Skills you already have</span>
            </div>
            <div style={s.legendItem}>
              <div style={{ ...s.legendDot, background: colors.danger, boxShadow: `0 0 8px ${colors.danger}` }} />
              <span>Skills you need to learn</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────
const s: Record<string, React.CSSProperties> = {
  outerWrap: {
    display: "flex", flexDirection: "column",
  },

  // Toggle button
  toggleBtn: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", gap: 16,
    width: "100%", padding: "16px 24px",
    border: "1px solid rgba(0,212,170,0.1)",
    borderRadius: 20,
    cursor: "pointer",
    transition: "all 0.3s ease",
    textAlign: "left" as const,
  },
  toggleLeft: { display: "flex", alignItems: "center", gap: 12 },
  toggleTitle: {
    fontFamily: fonts.display, fontSize: 16,
    fontWeight: 700, color: colors.textPrimary,
    display: "block",
  },
  toggleMeta: {
    fontSize: 12, color: colors.textMuted,
    fontFamily: fonts.body, display: "block",
  },
  toggleRight: {
    display: "flex", alignItems: "center",
    gap: 10, flexShrink: 0,
  },
  miniTrack: {
    width: 80, height: 6, borderRadius: 3,
    background: "rgba(255,107,107,0.2)",
    overflow: "hidden", position: "relative",
  },
  miniFill: {
    height: "100%", borderRadius: 3,
    background: "linear-gradient(90deg, #00D4AA, #0099FF)",
    boxShadow: "0 0 8px rgba(0,212,170,0.4)",
    transition: "width 0.8s ease",
  },

  // Panel
  panel: {
    background: "rgba(13,27,42,0.85)",
    backdropFilter: "blur(16px)",
    border: "1px solid rgba(0,212,170,0.1)",
    borderTop: "none",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    padding: "24px 24px 20px",
    overflow: "hidden",
  },
  header: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", marginBottom: 20,
    flexWrap: "wrap" as const, gap: 12,
  },
  subtitle: {
    fontSize: 13, color: colors.textMuted,
    fontFamily: fonts.body,
  },
  filterRow: { display: "flex", gap: 8, flexWrap: "wrap" as const },
  filterBtn: {
    padding: "5px 14px", fontSize: 12,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 20, color: colors.textMuted,
    cursor: "pointer", fontFamily: fonts.body,
    transition: "all 0.2s ease", fontWeight: 500,
  },
  progressSection: {
    marginBottom: 24, padding: "14px 18px",
    background: "rgba(0,212,170,0.03)",
    border: "1px solid rgba(0,212,170,0.08)",
    borderRadius: 12,
  },
  progressLabels: {
    display: "flex", justifyContent: "space-between", marginBottom: 8,
  },
  progressTrack: {
    height: 10, borderRadius: 5,
    background: "rgba(255,107,107,0.2)",
    overflow: "visible", position: "relative", marginBottom: 8,
  },
  progressFill: {
    height: "100%", borderRadius: 5,
    background: "linear-gradient(90deg, #00D4AA, #0099FF)",
    boxShadow: "0 0 16px rgba(0,212,170,0.4)",
    position: "relative",
  },
  barsWrap: {
    display: "flex", flexDirection: "column", gap: 6, marginBottom: 20,
  },
  row: {
    display: "flex", alignItems: "center",
    gap: 12, padding: "8px 10px", cursor: "default",
  },
  legend: {
    display: "flex", gap: 24, justifyContent: "center",
    paddingTop: 16,
    borderTop: "1px solid rgba(255,255,255,0.04)",
    flexWrap: "wrap" as const,
  },
  legendItem: {
    display: "flex", alignItems: "center", gap: 7,
    fontSize: 12, color: colors.textMuted, fontFamily: fonts.body,
  },
  legendDot: {
    width: 10, height: 10, borderRadius: 3, flexShrink: 0,
  },
};
