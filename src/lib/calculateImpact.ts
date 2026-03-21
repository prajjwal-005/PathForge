// Average hours to learn a skill by level
const HOURS_BY_LEVEL: Record<string, number> = {
  beginner: 40,
  intermediate: 80,
  advanced: 120,
  unknown: 60, // fallback
};

export interface ImpactMetrics {
  total_training_hours: number;      // if no personalization
  personalized_training_hours: number; // with pathway
  hours_saved: number;               // redundant training skipped
  efficiency_gain_percent: number;   // % reduction
  skills_already_known: number;
  skills_to_learn: number;
  estimated_completion_weeks: number; // at 10hrs/week
}

export function calculateImpact(
  resumeSkills: string[],
  missingSkills: string[],
  jdSkills: string[],
  skillLevels: Record<string, string> = {}
): ImpactMetrics {
  // Hours for full curriculum (no personalization)
  const total_training_hours = jdSkills.reduce((sum, skill) => {
    const level = skillLevels[skill] || "unknown";
    return sum + HOURS_BY_LEVEL[level];
  }, 0);

  // Hours only for missing skills
  const personalized_training_hours = missingSkills.reduce((sum, skill) => {
    const level = skillLevels[skill] || "unknown";
    return sum + HOURS_BY_LEVEL[level];
  }, 0);

  const hours_saved = total_training_hours - personalized_training_hours;
  const efficiency_gain_percent = Math.round(
    (hours_saved / total_training_hours) * 100
  );

  return {
    total_training_hours,
    personalized_training_hours,
    hours_saved,
    efficiency_gain_percent,
    skills_already_known: resumeSkills.length,
    skills_to_learn: missingSkills.length,
    estimated_completion_weeks: Math.ceil(personalized_training_hours / 10),
  };
}