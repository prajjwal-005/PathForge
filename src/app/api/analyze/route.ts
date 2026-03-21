import { NextRequest, NextResponse } from "next/server";
import { extractTextFromPDF } from "@/lib/parsePDF";
import { extractSkills } from "@/lib/extractSkills";
import { recommendCourses } from "@/lib/recommendCourses";
import { calculateImpact } from "@/lib/calculateImpact";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // --- Parse Resume ---
    const resumeFile = formData.get("resume_file") as File | null;
    const resumeText = formData.get("resume_text") as string | null;

    let finalResumeText = "";
    if (resumeFile) {
      const buffer = Buffer.from(await resumeFile.arrayBuffer());
      finalResumeText = await extractTextFromPDF(buffer);
    } else if (resumeText) {
      finalResumeText = resumeText;
    } else {
      return NextResponse.json(
        { error: "Resume is required" },
        { status: 400 }
      );
    }

    // --- Parse JD ---
    const jdFile = formData.get("jd_file") as File | null;
    const jdText = formData.get("jd_text") as string | null;

    let finalJdText = "";
    if (jdFile) {
      const buffer = Buffer.from(await jdFile.arrayBuffer());
      finalJdText = await extractTextFromPDF(buffer);
    } else if (jdText) {
      finalJdText = jdText;
    } else {
      return NextResponse.json(
        { error: "Job Description is required" },
        { status: 400 }
      );
    }

    // --- Step 1: Extract Skills ---
    let skillGap;
    try {
      skillGap = await extractSkills(finalResumeText, finalJdText);
    } catch (err) {
      return NextResponse.json(
        { error: "Skill extraction failed. Check your Groq API key or try again." },
        { status: 500 }
      );
    }

    // --- Step 2: Recommend Courses ---
    let recommendation;
    try {
      recommendation = await recommendCourses(
        skillGap.missing_skills,
        skillGap.priority
      );
    } catch (err) {
      return NextResponse.json(
        { error: "Course recommendation failed. Try again." },
        { status: 500 }
      );
    }

    const impact = calculateImpact(
      skillGap.resume_skills,
      skillGap.missing_skills,
      skillGap.jd_skills,
      skillGap.skill_levels || {}
    );

    // --- Build Full Trace ---
    const fullTrace = [
      {
        step: "Skill Extraction",
        input: `Resume: ${finalResumeText.slice(0, 150)}...`,        
        output: skillGap.resume_skills,
        reasoning: `Extracted ${skillGap.resume_skills.length} skills from resume and ${skillGap.jd_skills.length} skills from job description. Identified ${skillGap.missing_skills.length} missing skills.`,
      },
      {
        step: "Gap Analysis",
        input: skillGap.jd_skills,
        output: skillGap.missing_skills,
        reasoning: skillGap.reasoning,
      },
      recommendation.trace,
    ];

    // --- Final Response ---
    
    return NextResponse.json({
    skill_gap: {
      resume_skills: skillGap.resume_skills,
      jd_skills: skillGap.jd_skills,
      missing_skills: skillGap.missing_skills,
      priority: skillGap.priority,
    },
    pathway: recommendation.pathway,
    trace: fullTrace,
    grounding: recommendation.groundingStats, 
    impact,
    uncoveredSkills: recommendation.uncoveredSkills,
  });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}