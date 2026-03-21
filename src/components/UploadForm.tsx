"use client";

import { useState } from "react";
import { InputMode } from "@/types";
import { colors, fonts, radius, spacing, gradients } from "@/styles/tokens";

interface Props {
  onAnalyze: (params: {
    resumeMode: InputMode;
    jdMode: InputMode;
    resumeText: string;
    jdText: string;
    resumeFile: File | null;
    jdFile: File | null;
  }) => void;
  loading: boolean;
  error: string;
}

export default function UploadForm({ onAnalyze, loading, error }: Props) {
  const [resumeMode, setResumeMode] = useState<InputMode>("text");
  const [jdMode, setJdMode] = useState<InputMode>("text");
  const [resumeText, setResumeText] = useState("");
  const [jdText, setJdText] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jdFile, setJdFile] = useState<File | null>(null);

  function handleSubmit() {
    onAnalyze({ resumeMode, jdMode, resumeText, jdText, resumeFile, jdFile });
  }

  return (
    <main style={s.main}>
      <h1 style={s.headline}>
        Map Your <span style={s.accent}>Learning Path</span>
      </h1>
      <p style={s.subheadline}>
        Upload your resume and job description to get a personalized training roadmap.
      </p>

      <div style={s.grid}>
        <InputCard
          title="Resume"
          mode={resumeMode}
          onModeChange={setResumeMode}
          text={resumeText}
          onTextChange={setResumeText}
          file={resumeFile}
          onFileChange={setResumeFile}
          icon="📄"
          placeholder="Paste your resume text here..."
        />
        <InputCard
          title="Job Description"
          mode={jdMode}
          onModeChange={setJdMode}
          text={jdText}
          onTextChange={setJdText}
          file={jdFile}
          onFileChange={setJdFile}
          icon="📋"
          placeholder="Paste the job description here..."
        />
      </div>

      {error && <p style={s.error}>{error}</p>}

      <button
        style={{ ...s.btn, ...(loading ? s.btnDisabled : {}) }}
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <span style={s.loadingRow}>
            <span style={s.spinner} /> Analyzing...
          </span>
        ) : (
          "Analyze & Generate Pathway →"
        )}
      </button>
    </main>
  );
}

// ── Sub-component: InputCard ───────────────────────────────────────────────
function InputCard({
  title, mode, onModeChange, text, onTextChange,
  file, onFileChange, icon, placeholder,
}: {
  title: string;
  mode: InputMode;
  onModeChange: (m: InputMode) => void;
  text: string;
  onTextChange: (t: string) => void;
  file: File | null;
  onFileChange: (f: File | null) => void;
  icon: string;
  placeholder: string;
}) {
  return (
    <div style={s.card}>
      <div style={s.cardHeader}>
        <span style={s.cardTitle}>{title}</span>
        <div style={s.toggle}>
          {(["text", "pdf"] as InputMode[]).map((m) => (
            <button
              key={m}
              style={{ ...s.toggleBtn, ...(mode === m ? s.toggleActive : {}) }}
              onClick={() => onModeChange(m)}
            >
              {m.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {mode === "text" ? (
        <textarea
          style={s.textarea}
          placeholder={placeholder}
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
        />
      ) : (
        <label style={s.dropzone}>
          <input
            type="file"
            accept=".pdf"
            style={{ display: "none" }}
            onChange={(e) => onFileChange(e.target.files?.[0] || null)}
          />
          <span style={s.dropIcon}>{icon}</span>
          <span style={s.dropText}>
            {file ? file.name : "Click to upload PDF"}
          </span>
        </label>
      )}
    </div>
  );
}


const s: Record<string, React.CSSProperties> = {
  main: {
    position: "relative", zIndex: 1,
    maxWidth: 900, margin: "0 auto",
    padding: "80px 24px 60px", textAlign: "center",
  },
  headline: {
    fontFamily: fonts.display,
    fontSize: "clamp(36px, 5vw, 56px)",
    fontWeight: 800, lineHeight: 1.1,
    marginBottom: spacing.md, letterSpacing: "-1px",
  },
  accent: { color: colors.accent },
  subheadline: {
    fontSize: 18, color: colors.textMuted,
    marginBottom: 56, fontWeight: 300,
  },
  grid: {
    display: "grid", gridTemplateColumns: "1fr 1fr",
    gap: spacing.xl, marginBottom: spacing.xxxl, textAlign: "left",
  },
  card: {
    background: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: radius.xxl, padding: spacing.xl,
    backdropFilter: "blur(10px)",
  },
  cardHeader: {
    display: "flex", alignItems: "center",
    justifyContent: "space-between", marginBottom: spacing.md,
  },
  cardTitle: {
    fontFamily: fonts.display, fontWeight: 700,
    fontSize: 16, color: colors.textPrimary,
  },
  toggle: {
    display: "flex", background: colors.bgDeep,
    borderRadius: radius.md, padding: 3, gap: 2,
  },
  toggleBtn: {
    padding: "4px 12px", borderRadius: radius.sm,
    border: "none", background: "transparent",
    color: colors.textMuted, cursor: "pointer",
    fontSize: 13, fontFamily: fonts.body, transition: "all 0.2s",
  },
  toggleActive: {
    background: colors.accent,
    color: colors.textDark, fontWeight: 600,
  },
  textarea: {
    width: "100%", height: 160,
    background: colors.bgDeep,
    border: `1px solid ${colors.borderSubtle}`,
    borderRadius: radius.md, padding: "12px 14px",
    color: colors.textPrimary, fontFamily: fonts.body,
    fontSize: 14, resize: "vertical", outline: "none",
    boxSizing: "border-box",
  },
  dropzone: {
    display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    height: 160, background: colors.bgDeep,
    border: `2px dashed ${colors.border}`,
    borderRadius: radius.md, cursor: "pointer", gap: spacing.sm,
  },
  dropIcon: { fontSize: 32 },
  dropText: { fontSize: 14, color: colors.textMuted },
  error: { color: colors.danger, fontSize: 14, marginBottom: spacing.md },
  btn: {
    padding: "16px 48px",
    background: gradients.accent,
    border: "none", borderRadius: radius.lg,
    color: colors.textDark, fontFamily: fonts.display,
    fontWeight: 700, fontSize: 18, cursor: "pointer",
  },
  btnDisabled: { opacity: 0.7, cursor: "not-allowed" },
  loadingRow: { display: "flex", alignItems: "center", gap: 10 },
  spinner: {
    display: "inline-block", width: 16, height: 16,
    border: "2px solid rgba(10,15,30,0.3)",
    borderTop: "2px solid #0A0F1E",
    borderRadius: "50%", animation: "spin 0.8s linear infinite",
  },
};