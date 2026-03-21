"use client";

import { useState } from "react";
import { TraceStep } from "@/types";
import { colors, fonts, radius, spacing } from "@/styles/tokens";


export default function TraceAccordion({ trace }: { trace: TraceStep[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div style={s.wrap}>
      {trace.map((step, i) => (
        <div key={i} style={s.accordion}>
          <button
            style={s.header}
            onClick={() => setOpen(open === i ? null : i)}
          >
            <span style={s.stepLabel}>Step {i + 1}</span>
            <span style={s.stepTitle}>{step.step}</span>
            <span style={s.chevron}>{open === i ? "▲" : "▼"}</span>
          </button>

          {open === i && (
            <div style={s.body}>
              <div style={s.row}>
                <span style={s.label}>Input</span>
                <span style={s.value}>
                  {Array.isArray(step.input) ? step.input.join(", ") : step.input}
                </span>
              </div>
              <div style={s.row}>
                <span style={s.label}>Output</span>
                <span style={s.value}>
                  {Array.isArray(step.output) ? step.output.join(", ") : step.output}
                </span>
              </div>
              <div style={s.reasoningWrap}>
                <span style={s.label}>Reasoning</span>
                <p style={s.reasoning}>{step.reasoning}</p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}


const s: Record<string, React.CSSProperties> = {
  wrap: { display: "flex", flexDirection: "column", gap: spacing.sm },
  accordion: {
    background: colors.surface,
    border: `1px solid ${colors.borderSubtle}`,
    borderRadius: radius.lg, overflow: "hidden",
  },
  header: {
    width: "100%", display: "flex", alignItems: "center", gap: radius.lg,
    padding: "16px 20px", background: "transparent", border: "none",
    cursor: "pointer", textAlign: "left", color: colors.textPrimary,
  },
  stepLabel: {
    fontSize: 11, color: colors.accent, textTransform: "uppercase",
    letterSpacing: "0.1em", fontWeight: 600, minWidth: 52,
  },
  stepTitle: { flex: 1, fontFamily: fonts.display, fontWeight: 600, fontSize: 16 },
  chevron: { fontSize: 11, color: colors.textMuted },
  body: { padding: "0 20px 20px", display: "flex", flexDirection: "column", gap: spacing.md },
  row: { display: "flex", gap: spacing.md, alignItems: "flex-start" },
  label: {
    fontSize: 11, color: colors.accent, textTransform: "uppercase",
    letterSpacing: "0.08em", fontWeight: 600, minWidth: 70, paddingTop: 2,
  },
  value: { fontSize: 14, color: colors.textSub },
  reasoningWrap: { display: "flex", flexDirection: "column", gap: 6 },
  reasoning: {
    fontSize: 14, color: colors.textSub, lineHeight: 1.6,
    background: colors.borderSubtle,
    border: `1px solid ${colors.borderSubtle}`,
    borderRadius: radius.md, padding: radius.lg, margin: 0,
  },
};