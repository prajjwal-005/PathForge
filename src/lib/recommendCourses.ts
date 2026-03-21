import { groq } from "./groq";
import { searchCatalog,loadEmbeddings  } from "./searchCatalog";

export async function recommendCourses(
  missingSkills: string[],
  priority: string[]
) {

  const relevantCourses = await searchCatalog(missingSkills, 15);

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: `You are a learning pathway advisor. Return ONLY valid JSON. No explanation, no markdown, no preamble.`,
      },
      {
        role: "user",
        content: `
Missing skills (in priority order): ${JSON.stringify(priority)}

Relevant courses from catalog:
${JSON.stringify(relevantCourses, null, 2)}

Return this exact JSON structure:
{
  "pathway": [
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
  ],
  "trace": {
    "step": "Course Matching",
    "input": ["skill1", "skill2"],
    "output": ["course1", "course2"],
    "reasoning": "One paragraph explaining how courses were matched to skills and why this order"
  }
}

Rules:
- Only recommend courses from the provided catalog, never invent courses
- Order so prerequisites are completed before dependent courses
- Cover all missing skills if possible
- Return ONLY the JSON object
        `,
      },
    ],
    temperature: 0.1,
  });
  
  const raw = response.choices[0].message.content || "";
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    const cleaned = raw.replace(/```json|```/g, "").trim();
    parsed = JSON.parse(cleaned);
  }

const catalogNames = new Set(
    loadEmbeddings().map((c) => c.course.toLowerCase().trim())
  );

  const validatedPathway = parsed.pathway.filter((course: any) => {
    const exists = catalogNames.has(course.course.toLowerCase().trim());
    if (!exists) {
      console.warn(`⚠️ Hallucinated course removed: "${course.course}"`);
    }
    return exists;
  });

  return {
    pathway: validatedPathway,
    trace: parsed.trace,
    groundingStats: {
      total_recommended: parsed.pathway.length,
      total_grounded: validatedPathway.length,
      hallucinations_removed: parsed.pathway.length - validatedPathway.length,
    },
  };
}
