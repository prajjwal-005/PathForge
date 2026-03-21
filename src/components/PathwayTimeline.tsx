"use client";

import { useState } from "react";
import { Course } from "@/types";
import { colors, fonts, radius, spacing, gradients } from "@/styles/tokens";

export default function PathwayTimeline({ pathway }: { pathway: Course[] }) {
  return (
    <div style={s.timeline}>
      {pathway.map((course, i) => (
        <CourseCard key={i} course={course} index={i} total={pathway.length} />
      ))}
    </div>
  );
}

function CourseCard({ course, index, total }: { course: Course; index: number; total: number }) {
  const [hovered, setHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      style={{
        ...s.item,
        animation: `cardEntrance 0.5s ease ${index * 0.08}s both`,
      }}
    >
      {/* Left column: number + line */}
      <div style={s.left}>
        <div style={{
          ...s.circle,
          boxShadow: hovered
            ? "0 0 20px rgba(0,212,170,0.5), 0 0 40px rgba(0,212,170,0.2)"
            : "0 0 10px rgba(0,212,170,0.2)",
          transform: hovered ? "scale(1.1)" : "scale(1)",
          transition: "all 0.3s ease",
        }}>
          {index + 1}
        </div>
        {index < total - 1 && (
          <div style={{
            ...s.line,
            background: hovered
              ? "linear-gradient(to bottom, rgba(0,212,170,0.5), rgba(0,212,170,0.1))"
              : "linear-gradient(to bottom, rgba(0,212,170,0.2), rgba(0,212,170,0.05))",
            transition: "background 0.3s ease",
          }} />
        )}
      </div>

      {/* Card */}
      <div
        style={{
          ...s.card,
          borderColor: hovered ? "rgba(0,212,170,0.3)" : "rgba(0,212,170,0.08)",
          boxShadow: hovered
            ? "0 8px 40px rgba(0,212,170,0.1), inset 0 0 40px rgba(0,212,170,0.02)"
            : "none",
          transform: hovered ? "translateX(4px)" : "translateX(0)",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Top glow line on hover */}
        <div style={{
          position: "absolute", top: 0, left: "5%", right: "5%",
          height: 1,
          background: "linear-gradient(90deg, transparent, rgba(0,212,170,0.5), transparent)",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.3s ease",
        }} />

        <div style={s.cardHeader}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{
                fontSize: 11, color: colors.accent,
                textTransform: "uppercase", letterSpacing: "0.08em",
                fontWeight: 600,
              }}>
                Course {index + 1}
              </span>
              {index === 0 && (
                <span style={s.startBadge}>START HERE</span>
              )}
            </div>
            <span style={s.name}>{course.course}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
            <span style={s.rating}>⭐ {course.rating}</span>
            <button
              style={s.expandBtn}
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? "Less ▲" : "More ▼"}
            </button>
          </div>
        </div>

        <div style={s.meta}>
          {[course.level, course.duration, course.certificate_type].filter(Boolean).map((b, i) => (
            <span key={i} style={s.badge}>{b}</span>
          ))}
        </div>

        <div style={s.tags}>
          {course.skills_covered.map((skill, j) => (
            <span key={j} style={s.tag}>{skill}</span>
          ))}
        </div>

        {/* Expandable section */}
        <div style={{
          maxHeight: expanded ? 200 : 0,
          overflow: "hidden",
          transition: "max-height 0.4s ease",
        }}>
          <div style={{ paddingTop: spacing.md, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            {course.prerequisites.length > 0 && (
              <p style={s.prereq}>
                <span style={{ color: colors.warning }}>⚠</span>{" "}
                Prerequisites: {course.prerequisites.join(", ")}
              </p>
            )}
            <p style={s.reason}>💡 {course.reason}</p>
          </div>
        </div>

        {/* Always show reason if not expandable */}
        {!expanded && (
          <p style={s.reasonPreview}>
            💡 {course.reason.length > 100 ? course.reason.slice(0, 100) + "..." : course.reason}
          </p>
        )}
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  timeline: { display: "flex", flexDirection: "column" },
  item: { display: "flex", gap: spacing.md },
  left: { display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 },
  circle: {
    width: 38, height: 38, borderRadius: "50%",
    background: gradients.accent,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: fonts.display, fontWeight: 700,
    fontSize: 14, color: colors.textDark, flexShrink: 0,
  },
  line: {
    width: 2, flex: 1,
    margin: "4px 0", minHeight: 24,
  },
  card: {
    flex: 1,
    background: "rgba(13,27,42,0.8)",
    backdropFilter: "blur(10px)",
    border: "1px solid",
    borderRadius: radius.xl, padding: spacing.xl,
    marginBottom: spacing.md,
    position: "relative", overflow: "hidden",
    cursor: "default",
  },
  cardHeader: {
    display: "flex", justifyContent: "space-between",
    alignItems: "flex-start", marginBottom: 10, gap: spacing.sm,
  },
  name: {
    fontFamily: fonts.display, fontWeight: 700,
    fontSize: 16, color: colors.textPrimary, lineHeight: 1.3,
  },
  startBadge: {
    fontSize: 10, fontWeight: 700,
    background: "rgba(0,212,170,0.15)",
    border: "1px solid rgba(0,212,170,0.3)",
    color: colors.accent, padding: "2px 7px",
    borderRadius: 4, letterSpacing: "0.05em",
  },
  rating: { fontSize: 13, color: colors.warning, flexShrink: 0 },
  expandBtn: {
    fontSize: 11, color: colors.textMuted,
    background: "transparent", border: "none",
    cursor: "pointer", padding: "2px 6px",
    borderRadius: 4,
    transition: "color 0.2s",
  },
  meta: { display: "flex", gap: spacing.sm, flexWrap: "wrap", marginBottom: 10 },
  badge: {
    padding: "3px 10px",
    background: "rgba(0,212,170,0.06)",
    border: "1px solid rgba(0,212,170,0.15)",
    borderRadius: radius.sm, fontSize: 12, color: colors.accent,
  },
  tags: { display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 },
  tag: {
    padding: "2px 8px",
    background: "rgba(0,153,255,0.06)",
    border: "1px solid rgba(0,153,255,0.15)",
    borderRadius: radius.xs, fontSize: 12, color: colors.blue,
  },
  prereq: {
    fontSize: 12, color: colors.textMuted,
    marginBottom: spacing.sm, fontStyle: "italic",
  },
  reason: {
    fontSize: 13, color: colors.textSub, lineHeight: 1.6,
  },
  reasonPreview: {
    fontSize: 13, color: colors.textMuted, lineHeight: 1.5,
    borderTop: "1px solid rgba(255,255,255,0.04)",
    paddingTop: 8, marginTop: 4,
    fontStyle: "italic",
  },
};
