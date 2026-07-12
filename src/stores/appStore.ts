import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile, Decision, JudgeRecord, FactorWeight, AppState } from '../types';
import { generateDecisionId, getDayOfWeek } from '../utils/decisionAlgorithms';
import { STORAGE_KEY } from '../utils/constants';

interface AppActions {
  setUserProfile: (profile: UserProfile) => void;
  addDecision: (decision: Omit<Decision, 'id' | 'created_at' | 'history' | 'reflected' | 'reflection_score'>) => void;
  updateDecision: (id: string, updates: Partial<Decision>) => void;
  completeDecision: (id: string, factorWeights: FactorWeight[]) => void;
  markAsReflected: (id: string, score: number) => void;
  updateRegretFactors: (factors: Record<string, number>) => void;
  addJudgeRecord: (record: Omit<JudgeRecord, 'id' | 'created_at'>) => void;
  resetAll: () => void;
}

const initialState: AppState = {
  user_profile: null,
  decisions: [],
  judge_records: [],
  learning_parameters: {
    regret_factors: {}
  }
};

export const useAppStore = create<AppState & AppActions>()(
  persist(
    (set) => ({
      ...initialState,
      setUserProfile: (profile) => set({ user_profile: profile }),
      addDecision: (decision) => set((state) => ({
        decisions: [
          ...state.decisions,
          {
            ...decision,
            id: generateDecisionId(),
            created_at: new Date().toISOString(),
            history: [],
            reflected: false,
            reflection_score: 0
          }
        ]
      })),
      updateDecision: (id, updates) => set((state) => ({
        decisions: state.decisions.map((d) =>
          d.id === id ? { ...d, ...updates } : d
        )
      })),
      completeDecision: (id, factorWeights) => set((state) => ({
        decisions: state.decisions.map((d) =>
          d.id === id
            ? {
                ...d,
                status: 'completed',
                factorWeights,
                history: [
                  ...d.history,
                  {
                    timestamp: new Date().toISOString(),
                    day_of_week: getDayOfWeek(new Date()),
                    weights: factorWeights.reduce((acc, fw) => {
                      acc[fw.name] = fw.importance;
                      return acc;
                    }, {} as Record<string, number>)
                  }
                ]
              }
            : d
        )
      })),
      markAsReflected: (id, score) => set((state) => ({
        decisions: state.decisions.map((d) =>
          d.id === id
            ? { ...d, reflected: true, reflection_score: score }
            : d
        )
      })),
      updateRegretFactors: (factors) => set((state) => ({
        learning_parameters: {
          ...state.learning_parameters,
          regret_factors: factors
        }
      })),
      addJudgeRecord: (record) => set((state) => ({
        judge_records: [
          ...state.judge_records,
          {
            ...record,
            id: generateDecisionId(),
            created_at: new Date().toISOString()
          }
        ]
      })),
      resetAll: () => set(initialState)
    }),
    {
      name: STORAGE_KEY,
      version: 3,
      migrate: () => initialState
    }
  )
);
