"use client";

import { AnalysisResult } from "@/types";
import { colors, fonts, radius } from "@/styles/tokens";
import { useState } from "react";

interface Props {
  result: AnalysisResult;
}

export default function DownloadReport({ result }: Props) {
  async function handleDownload() {
    const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
      import("jspdf"),
      import("html2canvas"),
    ]);

    const element = document.createElement("div");
    element.style.position = "fixed";
    element.style.left = "-9999px";
    element.style.top = "0";
    element.style.width = "800px";
    element.style.zIndex = "-1";
    element.innerHTML = buildReportHTML(result);
    document.body.appendChild(element);

    await new Promise((r) => setTimeout(r, 300));

    try {
      const canvas = await html2canvas(element, {
        backgroundColor: "#0A0F1E",
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.98);
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const margin = 0; // set to 10 if you want side margins
      const usableWidth = pageWidth - margin * 2;
      const imgHeight = (canvas.height * usableWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "JPEG", margin, position, usableWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", margin, position, usableWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("learning-pathway-report.pdf");
    } finally {
      document.body.removeChild(element);
    }
  }

  return (
    <button style={s.btn} onClick={handleDownload}>
      ↓ Download PDF Report
    </button>
  );
}



function buildReportHTML(result: AnalysisResult): string {
  const { skill_gap, pathway, trace } = result;

  return `
    <div style="
      background: #0A0F1E;
      color: #E2E8F0;
      font-family: 'DM Sans', Arial, sans-serif;
      padding: 40px;
      max-width: 800px;
    ">
      <!-- Header -->
      <div style="border-bottom: 2px solid #00D4AA; padding-bottom: 20px; margin-bottom: 32px;">
        <h1 style="font-size: 32px; font-weight: 800; color: #E2E8F0; margin: 0 0 8px 0;">
          ⬡ PathForge
        </h1>
        <p style="color: #64748B; margin: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em;">
          AI-Adaptive Learning Pathway Report
        </p>
        <p style="color: #64748B; margin: 8px 0 0 0; font-size: 12px;">
          Generated on ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      <!-- Summary -->
      <div style="display: flex; gap: 16px; margin-bottom: 32px;">
        ${summaryPill("Skills You Have", skill_gap.resume_skills.length, "#00D4AA")}
        ${summaryPill("Skills Missing", skill_gap.missing_skills.length, "#FF6B6B")}
        ${summaryPill("Courses Recommended", pathway.length, "#0099FF")}
      </div>

      <!-- Skill Gap -->
      <div style="margin-bottom: 32px;">
        <h2 style="font-size: 20px; font-weight: 700; color: #00D4AA; margin: 0 0 16px 0; text-transform: uppercase; letter-spacing: 0.05em; font-size: 13px;">
          Skill Gap Analysis
        </h2>
        <div style="margin-bottom: 12px;">
          <p style="font-size: 12px; color: #64748B; margin: 0 0 8px 0; text-transform: uppercase;">Current Skills</p>
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            ${skill_gap.resume_skills.map((s) => tag(s, "#00D4AA", "rgba(0,212,170,0.1)")).join("")}
          </div>
        </div>
        <div>
          <p style="font-size: 12px; color: #64748B; margin: 0 0 8px 0; text-transform: uppercase;">Missing Skills</p>
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            ${skill_gap.missing_skills.map((s) => tag(s, "#FF6B6B", "rgba(255,107,107,0.1)")).join("")}
          </div>
        </div>
      </div>

      <!-- Pathway -->
      <div style="margin-bottom: 32px;">
        <h2 style="color: #00D4AA; text-transform: uppercase; letter-spacing: 0.05em; font-size: 13px; margin: 0 0 16px 0;">
          Learning Pathway
        </h2>
        ${pathway.map((course, i) => `
          <div style="
            background: rgba(26,35,50,0.8);
            border: 1px solid rgba(0,212,170,0.15);
            border-left: 3px solid #00D4AA;
            border-radius: 10px;
            padding: 16px 20px;
            margin-bottom: 12px;
          ">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
              <div style="display: flex; align-items: center; gap: 12px;">
                <span style="
                  background: linear-gradient(135deg, #00D4AA, #0099FF);
                  color: #0A0F1E;
                  width: 28px; height: 28px;
                  border-radius: 50%;
                  display: inline-flex;
                  align-items: center;
                  justify-content: center;
                  font-weight: 700;
                  font-size: 13px;
                  flex-shrink: 0;
                ">${i + 1}</span>
                <span style="font-weight: 700; font-size: 15px; color: #E2E8F0;">${course.course}</span>
              </div>
              <span style="color: #F59E0B; font-size: 13px; flex-shrink: 0;">⭐ ${course.rating}</span>
            </div>
            <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 8px; margin-left: 40px;">
              ${[course.level, course.duration, course.certificate_type].filter(Boolean).map((b) => tag(b!, "#00D4AA", "rgba(0,212,170,0.08)")).join("")}
            </div>
            <div style="margin-left: 40px;">
              <p style="font-size: 12px; color: #64748B; margin: 0 0 4px 0; font-style: italic;">
                Skills covered: ${course.skills_covered.join(", ")}
              </p>
              ${course.prerequisites.length ? `
                <p style="font-size: 12px; color: #64748B; margin: 0 0 4px 0; font-style: italic;">
                  Prerequisites: ${course.prerequisites.join(", ")}
                </p>
              ` : ""}
              <p style="font-size: 13px; color: #94A3B8; margin: 8px 0 0 0; line-height: 1.5;">
                💡 ${course.reason}
              </p>
            </div>
          </div>
        `).join("")}
      </div>

      <!-- Reasoning Trace -->
      <div>
        <h2 style="color: #00D4AA; text-transform: uppercase; letter-spacing: 0.05em; font-size: 13px; margin: 0 0 16px 0;">
          Reasoning Trace
        </h2>
        ${trace.map((step, i) => `
          <div style="
            background: rgba(26,35,50,0.8);
            border: 1px solid rgba(0,212,170,0.1);
            border-radius: 10px;
            padding: 16px 20px;
            margin-bottom: 10px;
          ">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
              <span style="font-size: 11px; color: #00D4AA; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600;">
                Step ${i + 1}
              </span>
              <span style="font-weight: 700; font-size: 15px; color: #E2E8F0;">${step.step}</span>
            </div>
            <p style="font-size: 12px; color: #64748B; margin: 0 0 4px 0;">
              <strong style="color: #00D4AA;">Input:</strong>
              ${Array.isArray(step.input) ? step.input.join(", ") : step.input}
            </p>
            <p style="font-size: 12px; color: #64748B; margin: 0 0 8px 0;">
              <strong style="color: #00D4AA;">Output:</strong>
              ${Array.isArray(step.output) ? step.output.join(", ") : step.output}
            </p>
            <p style="
              font-size: 13px; color: #94A3B8; line-height: 1.6;
              background: rgba(0,212,170,0.03);
              border: 1px solid rgba(0,212,170,0.08);
              border-radius: 8px; padding: 10px; margin: 0;
            ">${step.reasoning}</p>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

// ── Helpers ────────────────────────────────────────────────────────────────
function summaryPill(label: string, value: number, color: string): string {
  return `
    <div style="
      flex: 1; background: rgba(26,35,50,0.8);
      border: 1px solid ${color}40;
      border-radius: 12px; padding: 16px 20px;
    ">
      <p style="font-size: 11px; color: #64748B; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 4px 0;">${label}</p>
      <p style="font-size: 28px; font-weight: 800; color: ${color}; margin: 0;">${value}</p>
    </div>
  `;
}

function tag(text: string, color: string, bg: string): string {
  return `
    <span style="
      padding: 3px 10px; background: ${bg};
      border: 1px solid ${color}40;
      border-radius: 6px; font-size: 12px; color: ${color};
    ">${text}</span>
  `;
}

const s: Record<string, React.CSSProperties> = {
  btn: {
    padding: "10px 24px",
    background: "transparent",
    border: `1px solid ${colors.border}`,
    borderRadius: radius.md,
    color: colors.accent,
    fontFamily: fonts.body,
    fontSize: 14,
    cursor: "pointer",
    transition: "all 0.2s",
  },
};
