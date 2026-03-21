export interface SkillGap {
  resume_skills: string[];
  jd_skills: string[];
  missing_skills: string[];
  priority: string[];
}

export interface Course {
  course: string;
  skills_covered: string[];
  level: string;
  duration: string;
  rating: string;
  certificate_type: string;
  prerequisites: string[];
  reason: string;
}

export interface TraceStep {
  step: string;
  input: string | string[];
  output: string | string[];
  reasoning: string;
}

export interface GroundingStats {
  total_recommended: number;
  total_grounded: number;
  hallucinations_removed: number;
}

export interface ImpactMetrics {
  total_training_hours: number;
  personalized_training_hours: number;
  hours_saved: number;
  efficiency_gain_percent: number;
  skills_already_known: number;
  skills_to_learn: number;
  estimated_completion_weeks: number;
}

export interface AnalysisResult {
  skill_gap: SkillGap;
  pathway: Course[];
  trace: TraceStep[];
  grounding: GroundingStats;
  impact: ImpactMetrics; // ← add this
}

export type Tab = "gap" | "roadmap" | "trace";
export type InputMode = "text" | "pdf";