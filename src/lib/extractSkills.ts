import { getGroq } from "./groq";


export async function extractSkills(resumeText: string, jdText: string) {
  const response = await getGroq().chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: `You are a skill extraction engine. Return ONLY valid JSON. No explanation, no markdown, no preamble.`,
            },
            {
              role: "user",
            content: `
      Extract skills from the following resume and job description.

      Resume:
      ${resumeText}

      Job Description:
      ${jdText}

      Return this exact JSON structure:
      {
        "resume_skills": ["skill1", "skill2"],
        "jd_skills": ["skill1", "skill2"],
        "missing_skills": ["skill1", "skill2"],
        "priority": ["skill1", "skill2"],
        "reasoning": "One paragraph explaining the gap analysis",
        "skill_levels": {
          "skill1": "beginner|intermediate|advanced"
        }
      }

      Rules:
      - skill_levels = proficiency level for each resume skill based on context
      - missing_skills = skills in JD but not in resume
      - priority = missing_skills ordered by importance in JD
      - Return ONLY the JSON object
      `,
      },
    ],
    temperature: 0.1,
  });

  const raw = response.choices[0].message.content || "";
  try {
    return JSON.parse(raw);
  } catch {
    const cleaned = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  }
}