"use client";

import { Tab, AnalysisResult } from "@/types";
import SkillGapChart from "./SkillGapChart";
import PathwayTimeline from "./PathwayTimeline";
import MermaidRoadmap from "./MermaidRoadmap";
import TraceAccordion from "./TraceAccordion";
import { colors, fonts, radius, spacing } from "@/styles/tokens";
import ImpactMetricsPanel from "./ImpactMetrics";

interface Props {
  result: AnalysisResult;
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const TABS: { id: Tab; label: string }[] = [
  { id: "gap", label: "📊 Skill Gap" },
  { id: "roadmap", label: "🗺️ Roadmap" },
  { id: "trace", label: "🔍 Reasoning Trace" },
];

export default function ResultTabs({ result, activeTab, onTabChange }: Props) {
  
  return (
    <div>
       {/* Impact Metrics */}
      <ImpactMetricsPanel impact={result.impact} />
      {/* Tab Bar */}
      <div style={s.tabBar}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            style={{ ...s.tabBtn, ...(activeTab === tab.id ? s.tabActive : {}) }}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={s.content}>
        {activeTab === "gap" && (
          <div>
            <Section title="Skill Gap Analysis">
              <SkillGapChart skillGap={result.skill_gap} />
            </Section>
            {result.uncoveredSkills?.length > 0 && (
              <div style={{
                background: "rgba(255,107,107,0.05)",
                border: "1px solid rgba(255,107,107,0.2)",
                borderRadius: 10,
                padding: "12px 16px",
                marginBottom: 24,
                fontSize: 13,
                color: "#FF6B6B",
              }}>
                ⚠️ No courses found in catalog for:{" "}
                <strong>{result.uncoveredSkills.join(", ")}</strong>.
                Consider expanding your course catalog.
              </div>
            )}

            <Section title="Learning Pathway">
              <PathwayTimeline pathway={result.pathway} />
            </Section>
          </div>
        )}
        {activeTab === "roadmap" && (
          <Section title="Learning Roadmap" sub="Visual flow from missing skills → recommended courses">
            <MermaidRoadmap result={result} />
          </Section>
        )}
        {activeTab === "trace" && (
          <Section title="Reasoning Trace" sub="Step-by-step explanation of how your pathway was generated">
            <TraceAccordion trace={result.trace} />
          </Section>
        )}
      </div>
    </div>
  );
}

function Section({ title, sub, children }: {
  title: string;
  sub?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={s.section}>
      <h2 style={s.sectionTitle}>{title}</h2>
      {sub && <p style={s.sectionSub}>{sub}</p>}
      {children}
    </div>
  );
}


const s: Record<string, React.CSSProperties> = {
  tabBar: {
    display: "flex", gap: spacing.xs,
    background: "rgba(13,27,42,0.8)",
    border: `1px solid ${colors.borderSubtle}`,
    borderRadius: radius.lg, padding: 6, marginBottom: spacing.xxl,
  },
  tabBtn: {
    flex: 1, padding: "10px 16px",
    background: "transparent", border: "none",
    borderRadius: radius.md, color: colors.textMuted,
    fontFamily: fonts.body, fontSize: 15,
    cursor: "pointer", transition: "all 0.2s",
  },
  tabActive: { background: colors.accentBgStrong, color: colors.accent, fontWeight: 500 },
  content: { animation: "fadeIn 0.3s ease" },
  section: { marginBottom: spacing.xxxl },
  sectionTitle: {
    fontFamily: fonts.display, fontSize: 24,
    fontWeight: 700, marginBottom: spacing.sm, color: colors.textPrimary,
  },
  sectionSub: { fontSize: 14, color: colors.textMuted, marginBottom: spacing.xl },
};