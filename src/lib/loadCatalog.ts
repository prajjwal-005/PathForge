import { groq } from "./groq";
import { searchCatalog } from "./searchCatalog";

export async function recommendCourses(
  missingSkills: string[],
  priority: string[]
) {
  // Semantic search — get top 15 relevant courses only
  const relevantCourses = await searchCatalog(missingSkills, 15);

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: `You are a learning pathway advisor. Given a learner's missing skills and a course catalog, recommend an ordered learning pathway. Return ONLY valid JSON. No explanation, no markdown.`,
      },
      {
        role: "user",
        content: `
Missing skills (in priority order): ${JSON.stringify(priority)}

Relevant courses from catalog:
${JSON.stringify(relevantCourses, null, 2)}

Return a JSON array ordered from first course to take → last:
[
  {
    "course": "course title",
    "skills_covered": ["skill1", "skill2"],
    "level": "beginner|intermediate|advanced",
    "duration": "...",
    "rating": "...",
    "certificate_type": "...",
    "prerequisites": ["prereq1"],
    "reason": "One sentence explaining why this course is recommended at this step"
  }
]

Rules:
- Only recommend courses from the provided catalog, never invent courses
- Order so prerequisites are completed before dependent courses
- Cover all missing skills if possible
- Return ONLY the JSON array
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
