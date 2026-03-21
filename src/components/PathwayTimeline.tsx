"use client";

import { Course } from "@/types";
import { colors, fonts, radius, spacing, gradients } from "@/styles/tokens";

export default function PathwayTimeline({ pathway }: { pathway: Course[] }) {
  return (
    <div style={s.timeline}>
      {pathway.map((course, i) => (
        <div key={i} style={s.item}>
          <div style={s.left}>
            <div style={s.circle}>{i + 1}</div>
            {i < pathway.length - 1 && <div style={s.line} />}
          </div>
          <div style={s.card}>
            <div style={s.cardHeader}>
              <span style={s.name}>{course.course}</span>
              <span style={s.rating}>⭐ {course.rating}</span>
            </div>
            <div style={s.meta}>
              <span style={s.badge}>{course.level}</span>
              <span style={s.badge}>{course.duration}</span>
              {course.certificate_type && (
                <span style={s.badge}>{course.certificate_type}</span>
              )}
            </div>
            <div style={s.tags}>
              {course.skills_covered.map((skill, j) => (
                <span key={j} style={s.tag}>{skill}</span>
              ))}
            </div>
            {course.prerequisites.length > 0 && (
              <p style={s.prereq}>
                Prerequisites: {course.prerequisites.join(", ")}
              </p>
            )}
            <p style={s.reason}>💡 {course.reason}</p>
          </div>
        </div>
      ))}
    </div>
  );
}


const s: Record<string, React.CSSProperties> = {
  timeline: { display: "flex", flexDirection: "column" },
  item: { display: "flex", gap: spacing.md },
  left: { display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 },
  circle: {
    width: 36, height: 36, borderRadius: "50%",
    background: gradients.accent,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: fonts.display, fontWeight: 700,
    fontSize: 14, color: colors.textDark, flexShrink: 0,
  },
  line: {
    width: 2, flex: 1,
    background: `rgba(0,212,170,0.2)`,
    margin: "4px 0", minHeight: 24,
  },
  card: {
    flex: 1, background: colors.surface,
    border: `1px solid ${colors.borderSubtle}`,
    borderRadius: radius.xl, padding: spacing.xl, marginBottom: spacing.md,
  },
  cardHeader: {
    display: "flex", justifyContent: "space-between",
    alignItems: "flex-start", marginBottom: 10, gap: spacing.sm,
  },
  name: {
    fontFamily: fonts.display, fontWeight: 700,
    fontSize: 16, color: colors.textPrimary, lineHeight: 1.3,
  },
  rating: { fontSize: 13, color: colors.warning, flexShrink: 0 },
  meta: { display: "flex", gap: spacing.sm, flexWrap: "wrap", marginBottom: 10 },
  badge: {
    padding: "3px 10px",
    background: colors.accentBg,
    border: `1px solid ${colors.border}`,
    borderRadius: radius.sm, fontSize: 12, color: colors.accent,
  },
  tags: { display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 },
  tag: {
    padding: "2px 8px", background: colors.blueBg,
    border: `1px solid ${colors.blueBorder}`,
    borderRadius: radius.xs, fontSize: 12, color: colors.blue,
  },
  prereq: { fontSize: 12, color: colors.textMuted, marginBottom: spacing.sm, fontStyle: "italic" },
  reason: {
    fontSize: 13, color: colors.textSub, lineHeight: 1.5,
    borderTop: "1px solid rgba(255,255,255,0.05)",
    paddingTop: 10, marginTop: spacing.xs,
  },
};