"use client";

import { useEffect, useRef } from "react";
import { AnalysisResult } from "@/types";
import { colors, radius, spacing } from "@/styles/tokens";

export default function MermaidRoadmap({ result }: { result: AnalysisResult }) {
  const ref = useRef<HTMLDivElement>(null);

useEffect(() => {
  if (!ref.current) return;

  const container = ref.current;

  import("mermaid").then((m) => {
    m.default.initialize({
      startOnLoad: false,
      theme: "dark",
      themeVariables: {
        primaryColor: "#00D4AA",
        primaryTextColor: "#E2E8F0",
        primaryBorderColor: "#00D4AA",
        lineColor: "#00D4AA",
        secondaryColor: "#1A2332",
        background: "#0A0F1E",
        mainBkg: "#1A2332",
        fontFamily: "DM Sans",
      },
    });

    const diagram = buildDiagram(result);
    const id = `mermaid-${Date.now()}`;
    container.innerHTML = `<div id="${id}" class="mermaid">${diagram}</div>`;

    // Wait for DOM to settle before rendering
    setTimeout(() => {
      if (!container) return;
      m.default
        .run({ nodes: container.querySelectorAll(".mermaid") })
        .catch((err) => console.error("Mermaid render error:", err));
    }, 100);
  });
}, [result]);

  return (
    <div style={s.wrap}>
      <div ref={ref} style={s.diagram} />
    </div>
  );
}

function buildDiagram(data: AnalysisResult): string {
  const lines: string[] = ["flowchart TD"];

  data.skill_gap.missing_skills.forEach((skill, i) => {
    lines.push(`  S${i}["🎯 ${skill}"]`);
  });

  data.pathway.forEach((course, i) => {
    const label = course.course.length > 30
      ? course.course.slice(0, 30) + "..."
      : course.course;
    lines.push(`  C${i}["📚 ${label}\\n⭐ ${course.rating} · ${course.level}"]`);
  });

  data.skill_gap.missing_skills.forEach((skill, si) => {
    data.pathway.forEach((course, ci) => {
      const covers = course.skills_covered.some((s) =>
        s.toLowerCase().includes(skill.toLowerCase())
      );
      if (covers) lines.push(`  S${si} --> C${ci}`);
    });
  });

  for (let i = 0; i < data.pathway.length - 1; i++) {
    lines.push(`  C${i} --> C${i + 1}`);
  }

  return lines.join("\n");
}


const s: Record<string, React.CSSProperties> = {
  wrap: {
    background: colors.surface,
    border: `1px solid ${colors.borderSubtle}`,
    borderRadius: radius.xxl, padding: spacing.xxl, minHeight: 300,
  },
  diagram: { display: "flex", alignItems: "center", justifyContent: "center" },
};