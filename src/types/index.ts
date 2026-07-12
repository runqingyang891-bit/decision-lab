export interface UserProfile {
  name: string;
  zodiac: string;
  mbti: string;
  reg_date: string;
}

export interface DecisionHistory {
  timestamp: string;
  day_of_week: number;
  weights: Record<string, number>;
}

export interface FactorWeight {
  name: string;
  importance: number; // 纠结比重 0-100
  weightA: number; // 选项A砝码 0-100
  weightB: number; // 选项B砝码 0-100
}

export interface Decision {
  id: string;
  title: string;
  type: 'short_term' | 'long_term';
  status: 'in_progress' | 'completed';
  reflected: boolean;
  reflection_score: number;
  created_at: string;
  history: DecisionHistory[];
  options?: string[];
  factors?: string[];
  hiddenFactors?: string[];
  factorWeights?: FactorWeight[];
}

export interface JudgeRecord {
  id: string;
  caseMbti: string;
  caseZodiac: string;
  caseDecision: string;
  score: number;
  created_at: string;
}

export interface LearningParameters {
  regret_factors: Record<string, number>;
}

export interface AppState {
  user_profile: UserProfile | null;
  decisions: Decision[];
  judge_records: JudgeRecord[];
  learning_parameters: LearningParameters;
}

export interface FactorSuggestion {
  keywords: string[];
  factors: string[];
}

export interface CaseData {
  id: string;
  mbti: string;
  zodiac: string;
  decision: string;
  description: string;
  story: string;
}
