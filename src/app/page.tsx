"use client";
import dynamic from "next/dynamic";


import { useState, useEffect } from "react";
import { Tab } from "@/types";
import { useAnalyze } from "@/hooks/useAnalyze";
import UploadForm from "@/components/UploadForm";
import ResultTabs from "@/components/ResultTabs";
import { colors, fonts, radius, spacing, gradients } from "@/styles/tokens";
import DownloadReport, { CopyButton } from "@/components/DownloadReport";


export default function Home() {
  const { loading, loadingStep, error, result, analyze, reset } = useAnalyze();
  const [activeTab, setActiveTab] = useState<Tab>("gap");

  // Inject fonts
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');`;
    document.head.appendChild(style);
  }, []);

  return (
    <div style={s.page}>
      <div style={s.grid} />

      {/* Header */}
      <header style={s.header}>
        <div style={s.logo}>
          <span style={s.logoIcon}>⬡</span>
          <span style={s.logoText}>PathForge</span>
        </div>
        <p style={s.tagline}>AI-Adaptive Onboarding Engine</p>
      </header>

      {/* Upload or Results */}
      {!result ? (
        <UploadForm
          onAnalyze={analyze}
          loading={loading}
          loadingStep={loadingStep}  
          error={error}
        />
      ) : (
        <main style={s.results}>
          {/* Summary Pills */}
          <div style={s.summary}>
            <Pill label="Skills You Have" value={result.skill_gap.resume_skills.length} />
            <Pill label="Skills Missing" value={result.skill_gap.missing_skills.length} danger />
            <Pill label="Courses Recommended" value={result.pathway.length} accent />
            <Pill label="Grounding Score" value={`${result.grounding.total_grounded}/${result.grounding.total_recommended}`} accent
          />
          </div>
          {result.skill_gap.missing_skills.length === 0 ? (
            <div style={{
              textAlign: "center",
              padding: "60px 24px",
              background: colors.surface,
              border: `1px solid ${colors.border}`,
              borderRadius: radius.xxl,
              marginBottom: 32,
            }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
              <h2 style={{
                fontFamily: fonts.display,
                fontSize: 24, fontWeight: 700,
                color: colors.accent, marginBottom: 8,
              }}>
                Perfect Match!
              </h2>
              <p style={{ color: colors.textMuted, fontSize: 16 }}>
                Your resume already covers all the required skills for this role.
                No additional training needed.
              </p>
            </div>
          ) : (
            <ResultTabs result={result} activeTab={activeTab} onTabChange={setActiveTab} />
          )}
          <ResultTabs result={result} activeTab={activeTab} onTabChange={setActiveTab} />

          
          
         <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
          <button style={s.backBtn} onClick={reset}>← New Analysis</button>
          <CopyButton result={result} />
          <DownloadReport result={result} />
        </div>


        </main>
      )}
    </div>
  );
}

function Pill({ label, value, danger, accent }: {
  label: string;
  value: number | string; 
  danger?: boolean;
  accent?: boolean;
}) {
  return (
    <div style={{
      ...s.pill,
      ...(danger ? s.pillDanger : {}),
      ...(accent ? s.pillAccent : {}),
    }}>
      <span style={s.pillLabel}>{label}</span>
      <span style={s.pillValue}>{value}</span>
    </div>
  );
}


const s: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh", background: colors.bg,
    fontFamily: fonts.body, color: colors.textPrimary,
    position: "relative", overflowX: "hidden",
  },
  grid: {
    position: "fixed", inset: 0,
    backgroundImage: gradients.grid,
    backgroundSize: "40px 40px",
    pointerEvents: "none", zIndex: 0,
  },
  header: {
    position: "relative", zIndex: 1,
    display: "flex", alignItems: "center",
    justifyContent: "space-between",
    padding: "24px 48px",
    borderBottom: `1px solid ${colors.borderSubtle}`,
  },
  logo: { display: "flex", alignItems: "center", gap: 10 },
  logoIcon: { fontSize: 28, color: colors.accent },
  logoText: {
    fontFamily: fonts.display, fontWeight: 800,
    fontSize: 22, color: colors.textPrimary, letterSpacing: "-0.5px",
  },
  tagline: { fontSize: 13, color: "#4A6FA5", letterSpacing: "0.05em", textTransform: "uppercase" },
  results: {
    position: "relative", zIndex: 1,
    maxWidth: 960, margin: "0 auto", padding: "40px 24px 80px",
  },
  summary: { display: "flex", gap: spacing.md, marginBottom: spacing.xxl, flexWrap: "wrap" },
  pill: {
    flex: 1, minWidth: 160, background: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: radius.lg, padding: "16px 24px",
    display: "flex", flexDirection: "column", gap: spacing.xs,
  },
  pillDanger: { borderColor: colors.borderDanger },
  pillAccent: { borderColor: colors.accent, background: colors.accentBg },
  pillLabel: {
    fontSize: 12, color: colors.textMuted,
    textTransform: "uppercase", letterSpacing: "0.05em",
  },
  pillValue: {
    fontFamily: fonts.display, fontSize: 32,
    fontWeight: 800, color: colors.textPrimary,
  },
  backBtn: {
    marginTop: spacing.xxl, background: "transparent",
    border: `1px solid ${colors.border}`,
    color: colors.accent, padding: "8px 20px",
    borderRadius: radius.md, cursor: "pointer",
    fontFamily: fonts.body, fontSize: 14,
  },
};