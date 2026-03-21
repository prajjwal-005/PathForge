"use client";

import { useState } from "react";
import { TraceStep } from "@/types";
import { colors, fonts, radius, spacing } from "@/styles/tokens";

export default function TraceAccordion({ trace }: { trace: TraceStep[] }) {
  const [open, setOpen] = useState<number | null>(0);

  const stepConfig = [
    {
      icon: "📄",
      color: "#00D4AA",
      bg: "rgba(0,212,170,0.08)",
      border: "rgba(0,212,170,0.2)",
      inputLabel: "Documents Parsed",
      outputLabel: "Skills Identified",
    },
    {
      icon: "🔍",
      color: "#0099FF",
      bg: "rgba(0,153,255,0.08)",
      border: "rgba(0,153,255,0.2)",
      inputLabel: "JD Requirements",
      outputLabel: "Missing Skills",
    },
    {
      icon: "🗺️",
      color: "#F59E0B",
      bg: "rgba(245,158,11,0.08)",
      border: "rgba(245,158,11,0.2)",
      inputLabel: "Skills to Cover",
      outputLabel: "Courses Selected",
    },
  ];

  return (
    <div style={s.wrap}>
      {trace.map((step, i) => {
        const config = stepConfig[i] || stepConfig[0];
        const isOpen = open === i;

        return (
          <div key={i} style={s.item}>
            {/* Connector line */}
            {i < trace.length - 1 && <div style={s.connector} />}

            <div style={{
              ...s.accordion,
              borderColor: isOpen ? config.border : "rgba(0,212,170,0.08)",
            }}>
              {/* Header */}
              <button
                style={s.header}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <div style={{ ...s.iconWrap, background: config.bg, border: `1px solid ${config.border}` }}>
                  <span style={s.icon}>{config.icon}</span>
                </div>
                <div style={s.headerText}>
                  <span style={{ ...s.stepNum, color: config.color }}>Step {i + 1}</span>
                  <span style={s.stepTitle}>{step.step}</span>
                </div>
                <div style={s.headerRight}>
                  {!isOpen && (
                    <div style={s.previewPills}>
                      {(Array.isArray(step.output) ? step.output : [step.output])
                        .slice(0, 3)
                        .map((item, j) => (
                          <span key={j} style={{ ...s.previewPill, borderColor: config.border, color: config.color }}>
                            {item}
                          </span>
                        ))}
                      {(Array.isArray(step.output) ? step.output : []).length > 3 && (
                        <span style={{ ...s.previewPill, borderColor: config.border, color: config.color }}>
                          +{(step.output as string[]).length - 3}
                        </span>
                      )}
                    </div>
                  )}
                  <span style={{ ...s.chevron, color: config.color }}>
                    {isOpen ? "▲" : "▼"}
                  </span>
                </div>
              </button>

              {/* Body */}
              {isOpen && (
                <div style={s.body}>
                  {/* Input */}
                  <div style={s.section}>
                    <span style={{ ...s.sectionLabel, color: config.color }}>
                      {config.inputLabel}
                    </span>
                    <div style={s.inputBox}>
                      {i === 0 ? (
                        // Step 1 input — show as truncated text preview
                        <p style={s.inputText}>
                          {typeof step.input === "string"
                            ? step.input.replace("Resume: ", "").slice(0, 200) + "..."
                            : (step.input as string[]).join(", ")}
                        </p>
                      ) : (
                        // Steps 2,3 input — show as pills
                        <div style={s.pillRow}>
                          {(Array.isArray(step.input) ? step.input : [step.input]).map((item, j) => (
                            <span key={j} style={{
                              ...s.pill,
                              background: config.bg,
                              borderColor: config.border,
                              color: config.color,
                            }}>
                              {item}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Arrow */}
                  <div style={s.arrow}>↓</div>

                  {/* Output */}
                  <div style={s.section}>
                    <span style={{ ...s.sectionLabel, color: config.color }}>
                      {config.outputLabel}
                    </span>
                    <div style={s.outputBox}>
                      <div style={s.pillRow}>
                        {(Array.isArray(step.output) ? step.output : [step.output]).map((item, j) => (
                          <span key={j} style={{
                            ...s.pill,
                            background: config.bg,
                            borderColor: config.border,
                            color: config.color,
                          }}>
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Reasoning */}
                  <div style={s.section}>
                    <span style={{ ...s.sectionLabel, color: config.color }}>
                      AI Reasoning
                    </span>
                    <div style={{ ...s.reasoningBox, borderColor: config.border }}>
                      <span style={s.quoteIcon}>"</span>
                      <p style={s.reasoningText}>{step.reasoning}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  wrap: { display: "flex", flexDirection: "column", position: "relative" },
  item: { position: "relative", marginBottom: 8 },
  connector: {
    position: "absolute",
    left: 27,
    top: "100%",
    width: 2,
    height: 16,
    background: "rgba(0,212,170,0.2)",
    zIndex: 1,
    marginTop: -4,
  },
  accordion: {
    background: colors.surface,
    border: "1px solid",
    borderRadius: radius.lg,
    overflow: "hidden",
    transition: "border-color 0.2s",
  },
  header: {
    width: "100%", display: "flex", alignItems: "center", gap: 12,
    padding: "14px 16px", background: "transparent", border: "none",
    cursor: "pointer", textAlign: "left",
  },
  iconWrap: {
    width: 40, height: 40, borderRadius: radius.md,
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0,
  },
  icon: { fontSize: 18 },
  headerText: { display: "flex", flexDirection: "column", gap: 2, flex: 1 },
  stepNum: {
    fontSize: 10, fontWeight: 700,
    textTransform: "uppercase", letterSpacing: "0.1em",
  },
  stepTitle: {
    fontFamily: fonts.display, fontWeight: 600,
    fontSize: 15, color: colors.textPrimary,
  },
  headerRight: {
    display: "flex", alignItems: "center", gap: 8, flexShrink: 0,
  },
  previewPills: { display: "flex", gap: 4, flexWrap: "wrap" },
  previewPill: {
    padding: "2px 8px", border: "1px solid",
    borderRadius: radius.xs, fontSize: 11,
  },
  chevron: { fontSize: 10, fontWeight: 700 },
  body: {
    padding: "0 16px 16px",
    display: "flex", flexDirection: "column", gap: 12,
    borderTop: "1px solid rgba(255,255,255,0.04)",
  },
  section: { display: "flex", flexDirection: "column", gap: 8 },
  sectionLabel: {
    fontSize: 10, fontWeight: 700,
    textTransform: "uppercase", letterSpacing: "0.1em",
    marginTop: 12,
  },
  inputBox: {
    background: colors.bgDeep,
    borderRadius: radius.md, padding: 12,
  },
  inputText: {
    fontSize: 12, color: colors.textMuted,
    lineHeight: 1.6, margin: 0, fontFamily: "monospace",
  },
  outputBox: {
    background: colors.bgDeep,
    borderRadius: radius.md, padding: 12,
  },
  pillRow: { display: "flex", flexWrap: "wrap", gap: 6 },
  pill: {
    padding: "4px 10px", border: "1px solid",
    borderRadius: radius.sm, fontSize: 12, fontWeight: 500,
  },
  arrow: {
    textAlign: "center", color: colors.textMuted,
    fontSize: 16, lineHeight: 1,
  },
  reasoningBox: {
    background: colors.bgDeep,
    border: "1px solid", borderRadius: radius.md,
    padding: 16, position: "relative",
  },
  quoteIcon: {
    position: "absolute", top: 8, left: 12,
    fontSize: 32, color: "rgba(0,212,170,0.15)",
    fontFamily: "Georgia, serif", lineHeight: 1,
  },
  reasoningText: {
    fontSize: 13, color: colors.textSub,
    lineHeight: 1.7, margin: 0, paddingLeft: 16,
  },
};