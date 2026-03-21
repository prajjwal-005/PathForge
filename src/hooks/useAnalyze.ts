"use client";

import { useState } from "react";
import { AnalysisResult, InputMode } from "@/types";

export type LoadingStep =
  | "idle"
  | "parsing"
  | "extracting"
  | "searching"
  | "generating"
  | "done";

export function useAnalyze() {
  const [loadingStep, setLoadingStep] = useState<LoadingStep>("idle");
  const [error, setError] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const loading = loadingStep !== "idle" && loadingStep !== "done";

  async function analyze({
    resumeMode, jdMode, resumeText, jdText, resumeFile, jdFile,
  }: {
    resumeMode: InputMode; jdMode: InputMode;
    resumeText: string; jdText: string;
    resumeFile: File | null; jdFile: File | null;
  }) {
    setError("");
    setResult(null);
    setLoadingStep("parsing");

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

      setLoadingStep("extracting");

      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      setLoadingStep("searching");
      await new Promise((r) => setTimeout(r, 600)); // brief pause for UX

      setLoadingStep("generating");
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Analysis failed");

      setLoadingStep("done");
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      setLoadingStep("idle");
    }
  }

  function reset() {
    setResult(null);
    setError("");
    setLoadingStep("idle");
  }

  return { loading, loadingStep, error, result, analyze, reset };
}