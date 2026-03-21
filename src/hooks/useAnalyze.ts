"use client";

import { useState } from "react";
import { AnalysisResult, InputMode } from "@/types";

export function useAnalyze() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);

  async function analyze({
    resumeMode,
    jdMode,
    resumeText,
    jdText,
    resumeFile,
    jdFile,
  }: {
    resumeMode: InputMode;
    jdMode: InputMode;
    resumeText: string;
    jdText: string;
    resumeFile: File | null;
    jdFile: File | null;
  }) {
    setError("");
    setResult(null);
    setLoading(true);

    try {
      const formData = new FormData();

      if (resumeMode === "pdf" && resumeFile) {
        formData.append("resume_file", resumeFile);
      } else if (resumeText.trim()) {
        formData.append("resume_text", resumeText);
      } else {
        throw new Error("Please provide your resume");
      }

      if (jdMode === "pdf" && jdFile) {
        formData.append("jd_file", jdFile);
      } else if (jdText.trim()) {
        formData.append("jd_text", jdText);
      } else {
        throw new Error("Please provide the job description");
      }

      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");

      setResult(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setResult(null);
    setError("");
  }

  return { loading, error, result, analyze, reset };
}