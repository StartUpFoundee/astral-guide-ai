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
  userQuestionCounts: Record<string, number>;
  setUserDetails: (details: Partial<Omit<UserState, 'setUserDetails' | 'incrementQuestionCount' | 'resetQuestionCount' | 'hasReachedFreeLimit' | 'remainingQuestions' | 'setSubscription' | 'resetStore' | 'getUserIdentifier' | 'userQuestionCounts'>>) => void;
  incrementQuestionCount: () => void;
  resetQuestionCount: () => void;
  hasReachedFreeLimit: () => boolean;
  remainingQuestions: () => number;
  setSubscription: (hasSubscription: boolean) => void;
  resetStore: () => void;
  getUserIdentifier: () => string;
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
      userQuestionCounts: {},
      
      getUserIdentifier: () => {
        const state = get();
        if (!state.name || !state.dateOfBirth || !state.timeOfBirth) {
          return '';
        }
        
        const dateString = state.dateOfBirth ? state.dateOfBirth.toISOString().split('T')[0] : 'unknown';
        return `${state.name.toLowerCase().replace(/\s+/g, '_')}_${dateString}_${state.timeOfBirth}`;
      },
      
      setUserDetails: (details) => set((state) => {
        const newState = { ...state, ...details };
        return newState;
      }),
      
      incrementQuestionCount: () => set((state) => {
        const userIdentifier = get().getUserIdentifier();
        
        if (!userIdentifier) {
          // If no identifier can be created, fall back to the previous behavior
          return { numberOfQuestionsAsked: state.numberOfQuestionsAsked + 1 };
        }
        
        // Update the count for this specific user
        const currentCount = state.userQuestionCounts[userIdentifier] || 0;
        const updatedCounts = {
          ...state.userQuestionCounts,
          [userIdentifier]: currentCount + 1
        };
        
        return { 
          userQuestionCounts: updatedCounts,
          numberOfQuestionsAsked: currentCount + 1 // Update current session count too
        };
      }),
      
      resetQuestionCount: () => set((state) => {
        const userIdentifier = get().getUserIdentifier();
        
        if (!userIdentifier) {
          return { numberOfQuestionsAsked: 0 };
        }
        
        // Reset count for this specific user
        const updatedCounts = { ...state.userQuestionCounts };
        updatedCounts[userIdentifier] = 0;
        
        return { 
          userQuestionCounts: updatedCounts,
          numberOfQuestionsAsked: 0
        };
      }),
      
      hasReachedFreeLimit: () => {
        const state = get();
        if (state.hasSubscription) return false;
        
        const userIdentifier = get().getUserIdentifier();
        if (!userIdentifier) {
          // Fall back to session-only tracking if no identifier
          return state.numberOfQuestionsAsked >= state.freeQuestionsLimit;
        }
        
        const userCount = state.userQuestionCounts[userIdentifier] || 0;
        return userCount >= state.freeQuestionsLimit;
      },
      
      remainingQuestions: () => {
        const state = get();
        if (state.hasSubscription) return Infinity;
        
        const userIdentifier = get().getUserIdentifier();
        if (!userIdentifier) {
          return Math.max(0, state.freeQuestionsLimit - state.numberOfQuestionsAsked);
        }
        
        const userCount = state.userQuestionCounts[userIdentifier] || 0;
        return Math.max(0, state.freeQuestionsLimit - userCount);
      },
      
      setSubscription: (hasSubscription) => set({ hasSubscription }),
      
      resetStore: () => set({ 
        name: '', 
        dateOfBirth: null, 
        timeOfBirth: '', 
        placeOfBirth: '', 
        numberOfQuestionsAsked: 0,
        hasSubscription: false,
        // Don't reset userQuestionCounts as we want to keep track of users across sessions
      }),
    }),
    {
      name: 'user-store',
    }
  )
);
