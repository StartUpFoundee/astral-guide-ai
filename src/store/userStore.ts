
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  name: string;
  dateOfBirth: Date | null;
  timeOfBirth: string;
  placeOfBirth: string;
  numberOfQuestionsAsked: number;
  freeQuestionsLimit: number;
  hasSubscription: boolean;
  setUserDetails: (details: Partial<Omit<UserState, 'setUserDetails' | 'incrementQuestionCount' | 'resetQuestionCount' | 'hasReachedFreeLimit' | 'remainingQuestions' | 'setSubscription' | 'resetStore'>>) => void;
  incrementQuestionCount: () => void;
  resetQuestionCount: () => void;
  hasReachedFreeLimit: () => boolean;
  remainingQuestions: () => number;
  setSubscription: (hasSubscription: boolean) => void;
  resetStore: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      name: '',
      dateOfBirth: null,
      timeOfBirth: '',
      placeOfBirth: '',
      numberOfQuestionsAsked: 0,
      freeQuestionsLimit: 5,
      hasSubscription: false,
      setUserDetails: (details) => set((state) => ({ ...state, ...details })),
      incrementQuestionCount: () => set((state) => ({ ...state, numberOfQuestionsAsked: state.numberOfQuestionsAsked + 1 })),
      resetQuestionCount: () => set({ numberOfQuestionsAsked: 0 }),
      hasReachedFreeLimit: () => {
        const state = get();
        return !state.hasSubscription && state.numberOfQuestionsAsked >= state.freeQuestionsLimit;
      },
      remainingQuestions: () => {
        const state = get();
        if (state.hasSubscription) return Infinity;
        return Math.max(0, state.freeQuestionsLimit - state.numberOfQuestionsAsked);
      },
      setSubscription: (hasSubscription) => set({ hasSubscription }),
      resetStore: () => set({ 
        name: '', 
        dateOfBirth: null, 
        timeOfBirth: '', 
        placeOfBirth: '', 
        numberOfQuestionsAsked: 0,
        hasSubscription: false
      }),
    }),
    {
      name: 'user-store',
    }
  )
);
