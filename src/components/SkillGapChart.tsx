"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { SkillGap } from "@/types";
import { colors } from "@/styles/tokens";

export default function SkillGapChart({ skillGap }: { skillGap: SkillGap }) {
  const data = [
    ...skillGap.resume_skills.map((s) => ({ skill: s, status: "have" })),
    ...skillGap.missing_skills.map((s) => ({ skill: s, status: "missing" })),
  ];

  return (
    <div style={s.wrap}>
      <ResponsiveContainer width="100%" height={Math.max(200, data.length * 40)}>
        <BarChart data={data} layout="vertical" margin={{ left: 20, right: 30 }}>
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="skill"
            tick={{ fill: "#94A3B8", fontFamily: "DM Sans", fontSize: 13 }}
            width={130}
          />
          <Tooltip
            contentStyle={{
              background: "#1A2332",
              border: "1px solid #2D3F55",
              borderRadius: 8,
              color: "#E2E8F0",
              fontFamily: "DM Sans",
            }}
            formatter={(_, __, props) => [
              props.payload.status === "have" ? "✅ You have this" : "❌ Missing",
              "",
            ]}
          />
          <Bar dataKey={() => 1} radius={[0, 6, 6, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.status === "have" ? "#00D4AA" : "#FF6B6B"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div style={s.legend}>
        <span style={s.item}><span style={{ ...s.dot, background: "#00D4AA" }} />Have</span>
        <span style={s.item}><span style={{ ...s.dot, background: "#FF6B6B" }} />Missing</span>
      </div>
    </div>
  );
}


const s: Record<string, React.CSSProperties> = {
  wrap: {
    background: colors.surface,
    border: `1px solid ${colors.borderSubtle}`,
    borderRadius: 16, padding: 24,
  },
  legend: { display: "flex", gap: 20, justifyContent: "center", marginTop: 16 },
  item: { display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: colors.textSub },
  dot: { display: "inline-block", width: 10, height: 10, borderRadius: "50%" },
};