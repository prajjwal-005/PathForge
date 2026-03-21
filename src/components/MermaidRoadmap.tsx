"use client";

import { useEffect, useRef, useState } from "react";
import { AnalysisResult } from "@/types";
import { colors, fonts, radius, spacing } from "@/styles/tokens";

// ── Build roadmap data from result ────────────────────────────────────────
function buildRoadmapData(data: AnalysisResult) {
  const ACCENT_COLORS = [
    "#00D4AA", "#0099FF", "#F59E0B", "#A78BFA",
    "#F472B6", "#34D399", "#FB923C", "#60A5FA",
  ];

  const stages = data.pathway.map((course, i) => {
    const leftNodes: { label: string; tags?: string[] }[] = [];
    const rightNodes: { label: string; tags?: string[] }[] = [];

    // Left: prerequisites + first half of skills
    if (course.prerequisites.length > 0) {
      leftNodes.push({ label: "Prerequisites", tags: course.prerequisites });
    }
    const skillsLeft = course.skills_covered.filter((_, j) => j % 2 === 0);
    if (skillsLeft.length > 0) {
      leftNodes.push({ label: "Skills Covered", tags: skillsLeft });
    }

    // Right: level/duration + second half of skills
    rightNodes.push({
      label: course.level,
      tags: [course.duration, ...(course.certificate_type ? [course.certificate_type] : []), `⭐ ${course.rating}`],
    });
    const skillsRight = course.skills_covered.filter((_, j) => j % 2 !== 0);
    if (skillsRight.length > 0) {
      rightNodes.push({ label: "Topics", tags: skillsRight });
    }

    return {
      centerLabel: course.course,
      centerSub: course.reason.slice(0, 65) + (course.reason.length > 65 ? "…" : ""),
      leftNodes,
      rightNodes,
      accentColor: ACCENT_COLORS[i % ACCENT_COLORS.length],
    };
  });

  return { stages, missingSkills: data.skill_gap.missing_skills };
}

// ── SubNode box (left/right branches) ─────────────────────────────────────
function SubNode({
  label, tags, color, align,
}: {
  label: string; tags?: string[]; color: string; align: "left" | "right";
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        display: "inline-flex", flexDirection: "column",
        alignItems: align === "left" ? "flex-end" : "flex-start",
        gap: 4,
        padding: "8px 12px",
        background: hovered ? `${color}14` : `${color}09`,
        border: `1px solid ${hovered ? color + "50" : color + "25"}`,
        borderRadius: 8,
        transition: "all 0.25s ease",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hovered ? `0 4px 16px ${color}20` : "none",
        cursor: "default",
        maxWidth: 220,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span style={{
        fontSize: 11, color: color,
        fontFamily: fonts.display, fontWeight: 700,
        textTransform: "uppercase" as const,
        letterSpacing: "0.06em",
      }}>
        {label}
      </span>
      {tags && tags.length > 0 && (
        <div style={{
          display: "flex", flexWrap: "wrap" as const,
          gap: 4,
          justifyContent: align === "left" ? "flex-end" : "flex-start",
        }}>
          {tags.map((tag, i) => (
            <span key={i} style={{
              padding: "2px 8px",
              background: `${color}12`,
              border: `1px solid ${color}28`,
              borderRadius: 4,
              fontSize: 11, color: colors.textSub,
              fontFamily: fonts.body,
              whiteSpace: "nowrap" as const,
            }}>
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Center course node ─────────────────────────────────────────────────────
function CenterNode({
  label, sub, color, stepNum,
}: {
  label: string; sub?: string; color: string; stepNum: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        position: "relative",
        background: hovered
          ? `linear-gradient(135deg, ${color}28, ${color}14)`
          : `linear-gradient(135deg, ${color}1C, ${color}0A)`,
        border: `2px solid ${hovered ? color : color + "AA"}`,
        borderRadius: 12,
        padding: "14px 18px",
        textAlign: "center" as const,
        minWidth: 170, maxWidth: 200,
        cursor: "default",
        transition: "all 0.3s ease",
        transform: hovered ? "scale(1.04)" : "scale(1)",
        boxShadow: hovered
          ? `0 0 32px ${color}45, 0 8px 24px ${color}20`
          : `0 0 16px ${color}20`,
        zIndex: 2,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Step badge */}
      <div style={{
        position: "absolute", top: -12, left: "50%",
        transform: "translateX(-50%)",
        background: color,
        color: "#0A0F1E",
        width: 24, height: 24, borderRadius: "50%",
        fontSize: 12, fontWeight: 800,
        fontFamily: fonts.display,
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: `0 0 12px ${color}`,
        border: "2px solid rgba(10,15,30,0.8)",
      }}>
        {stepNum}
      </div>

      <div style={{
        fontSize: 13, fontWeight: 700,
        fontFamily: fonts.display,
        color: color,
        lineHeight: 1.35,
        marginTop: 6,
        wordBreak: "break-word" as const,
      }}>
        {label}
      </div>

      {sub && (
        <div style={{
          fontSize: 10, color: colors.textMuted,
          marginTop: 6, lineHeight: 1.4,
          fontFamily: fonts.body,
          wordBreak: "break-word" as const,
        }}>
          {sub}
        </div>
      )}
    </div>
  );
}

// ── Connector (dotted horizontal line between node and branch) ─────────────
function Connector({ color, side }: { color: string; side: "left" | "right" }) {
  return (
    <div style={{
      width: 28, height: 2, flexShrink: 0,
      background: `repeating-linear-gradient(
        90deg,
        ${color}70 0px, ${color}70 4px,
        transparent 4px, transparent 8px
      )`,
      alignSelf: "center",
    }} />
  );
}

// ── Stage Row ──────────────────────────────────────────────────────────────
function StageRow({
  stage, index, isLast,
}: {
  stage: ReturnType<typeof buildRoadmapData>["stages"][0];
  index: number;
  isLast: boolean;
}) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const { accentColor: color } = stage;

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: `opacity 0.5s ease ${index * 0.07}s, transform 0.5s ease ${index * 0.07}s`,
      }}
    >
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 8px 200px 8px 1fr",
        alignItems: "stretch",
        minHeight: 80,
      }}>
        {/* LEFT branch column */}
        <div style={{
          display: "flex", flexDirection: "column",
          alignItems: "flex-end",
          justifyContent: "center",
          gap: 8, paddingRight: 0,
        }}>
          {stage.leftNodes.length > 0 ? (
            <div style={{
              display: "flex", alignItems: "center", gap: 0,
            }}>
              <SubNode
                label={stage.leftNodes[0].label}
                tags={stage.leftNodes[0].tags}
                color={color}
                align="left"
              />
              <Connector color={color} side="left" />
            </div>
          ) : (
            <div style={{ height: 40 }} />
          )}
          {stage.leftNodes[1] && (
            <div style={{ display: "flex", alignItems: "center" }}>
              <SubNode
                label={stage.leftNodes[1].label}
                tags={stage.leftNodes[1].tags}
                color={color}
                align="left"
              />
              <div style={{ width: 56 }} />
            </div>
          )}
        </div>

        {/* LEFT connector to spine */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          {stage.leftNodes.length > 0 && (
            <div style={{
              width: "100%", height: 2,
              background: `repeating-linear-gradient(90deg, ${color}60 0, ${color}60 4px, transparent 4px, transparent 8px)`,
            }} />
          )}
        </div>

        {/* CENTER SPINE */}
        <div style={{
          display: "flex", flexDirection: "column",
          alignItems: "center",
        }}>
          {/* Spine line above */}
          <div style={{
            width: 2, height: 16, flexShrink: 0,
            background: `linear-gradient(to bottom, ${color}30, ${color}80)`,
          }} />

          <CenterNode
            label={stage.centerLabel}
            sub={stage.centerSub}
            color={color}
            stepNum={index + 1}
          />

          {/* Spine line below */}
          {!isLast ? (
            <div style={{
              width: 2, flex: 1, minHeight: 20,
              background: `linear-gradient(to bottom, ${color}80, ${color}20)`,
            }} />
          ) : (
            <div style={{ width: 2, height: 16, background: `${color}40` }} />
          )}
        </div>

        {/* RIGHT connector from spine */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          {stage.rightNodes.length > 0 && (
            <div style={{
              width: "100%", height: 2,
              background: `repeating-linear-gradient(90deg, ${color}60 0, ${color}60 4px, transparent 4px, transparent 8px)`,
            }} />
          )}
        </div>

        {/* RIGHT branch column */}
        <div style={{
          display: "flex", flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          gap: 8,
        }}>
          {stage.rightNodes.length > 0 ? (
            <div style={{ display: "flex", alignItems: "center" }}>
              <Connector color={color} side="right" />
              <SubNode
                label={stage.rightNodes[0].label}
                tags={stage.rightNodes[0].tags}
                color={color}
                align="right"
              />
            </div>
          ) : (
            <div style={{ height: 40 }} />
          )}
          {stage.rightNodes[1] && (
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ width: 56 }} />
              <SubNode
                label={stage.rightNodes[1].label}
                tags={stage.rightNodes[1].tags}
                color={color}
                align="right"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Missing Skills Header ──────────────────────────────────────────────────
function SkillsHeader({ skills }: { skills: string[] }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column",
      alignItems: "center", marginBottom: 8,
      paddingBottom: 24,
    }}>
      <div style={{
        padding: "10px 28px",
        background: "rgba(255,107,107,0.1)",
        border: "1px solid rgba(255,107,107,0.35)",
        borderRadius: 10,
        fontSize: 13, fontWeight: 700,
        color: "#FF8C8C", fontFamily: fonts.display,
        letterSpacing: "0.03em",
        marginBottom: 14,
        boxShadow: "0 0 20px rgba(255,107,107,0.1)",
      }}>
        🎯 Skills to Acquire
      </div>

      <div style={{
        display: "flex", flexWrap: "wrap",
        gap: 7, justifyContent: "center",
        maxWidth: 640, marginBottom: 20,
      }}>
        {skills.map((skill, i) => (
          <span key={i} style={{
            padding: "4px 12px",
            background: "rgba(255,107,107,0.07)",
            border: "1px solid rgba(255,107,107,0.25)",
            borderRadius: 6, fontSize: 12,
            color: colors.textSub, fontFamily: fonts.body,
            animation: `cardEntrance 0.4s ease ${i * 0.04}s both`,
          }}>
            {skill}
          </span>
        ))}
      </div>

      {/* Arrow into spine */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
        <div style={{ width: 2, height: 24, background: "rgba(0,212,170,0.35)" }} />
        <div style={{
          width: 0, height: 0,
          borderLeft: "7px solid transparent",
          borderRight: "7px solid transparent",
          borderTop: "9px solid rgba(0,212,170,0.45)",
        }} />
      </div>
    </div>
  );
}

// ── Legend ─────────────────────────────────────────────────────────────────
function Legend() {
  const items = [
    { color: "#00D4AA", label: "Course (Step 1–3)" },
    { color: "#F59E0B", label: "Level & Duration" },
    { color: "#0099FF", label: "Skills Covered" },
    { color: "#FF6B6B", label: "Missing Skills" },
  ];
  return (
    <div style={{
      display: "flex", gap: 20, justifyContent: "center",
      marginTop: 28, flexWrap: "wrap",
      paddingTop: 20,
      borderTop: "1px solid rgba(0,212,170,0.08)",
    }}>
      {items.map((item, i) => (
        <div key={i} style={{
          display: "flex", alignItems: "center", gap: 6,
          fontSize: 12, color: colors.textMuted, fontFamily: fonts.body,
        }}>
          <div style={{
            width: 10, height: 10, borderRadius: 3,
            background: item.color,
            boxShadow: `0 0 6px ${item.color}80`,
          }} />
          {item.label}
        </div>
      ))}
    </div>
  );
}

// ── Main Export ────────────────────────────────────────────────────────────
export default function MermaidRoadmap({ result }: { result: AnalysisResult }) {
  const { stages, missingSkills } = buildRoadmapData(result);

  return (
    <div style={{
      background: "rgba(10,15,30,0.92)",
      backdropFilter: "blur(20px)",
      border: "1px solid rgba(0,212,170,0.12)",
      borderRadius: 20,
      padding: 32,
      minHeight: 400,
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Subtle background grid */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: `
          linear-gradient(rgba(0,212,170,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,212,170,0.025) 1px, transparent 1px)
        `,
        backgroundSize: "32px 32px",
        zIndex: 0,
      }} />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "center", marginBottom: 28,
          paddingBottom: 18,
          borderBottom: "1px solid rgba(0,212,170,0.1)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 26 }}>🗺️</span>
            <div>
              <div style={{
                fontFamily: fonts.display, fontSize: 20,
                fontWeight: 800, color: colors.textPrimary,
              }}>
                Learning Roadmap
              </div>
              <div style={{ fontSize: 12, color: colors.textMuted, marginTop: 2 }}>
                {stages.length} courses · {missingSkills.length} skills to acquire
              </div>
            </div>
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: 7,
            padding: "6px 14px",
            background: "rgba(0,212,170,0.06)",
            border: "1px solid rgba(0,212,170,0.2)",
            borderRadius: 20,
          }}>
            <span style={{
              width: 7, height: 7, borderRadius: "50%",
              background: colors.accent,
              display: "inline-block",
              boxShadow: "0 0 6px rgba(0,212,170,0.8)",
              animation: "pulseGlow 2s ease-in-out infinite",
            }} />
            <span style={{ fontSize: 12, color: colors.accent, fontWeight: 600 }}>
              AI Generated
            </span>
          </div>
        </div>

        {/* Missing skills */}
        <SkillsHeader skills={missingSkills} />

        {/* Stages */}
        {stages.map((stage, i) => (
          <StageRow key={i} stage={stage} index={i} isLast={i === stages.length - 1} />
        ))}

        {/* End marker */}
        <div style={{
          display: "flex", flexDirection: "column",
          alignItems: "center", marginTop: 8,
        }}>
          <div style={{ width: 2, height: 20, background: "rgba(0,212,170,0.4)" }} />
          <div style={{
            padding: "10px 32px",
            background: "linear-gradient(135deg, rgba(0,212,170,0.18), rgba(0,153,255,0.18))",
            border: "1px solid rgba(0,212,170,0.45)",
            borderRadius: 10,
            fontSize: 14, fontWeight: 700,
            color: colors.accent,
            fontFamily: fonts.display,
            boxShadow: "0 0 24px rgba(0,212,170,0.15)",
            letterSpacing: "0.03em",
          }}>
            🏆 Role Ready
          </div>
        </div>

        <Legend />
      </div>
    </div>
  );
}
