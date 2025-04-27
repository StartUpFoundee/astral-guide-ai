
import { create } from 'zustand';

interface UserState {
  name: string;
  dateOfBirth: Date | null;
  timeOfBirth: string;
  placeOfBirth: string;
  numberOfQuestionsAsked: number;
  setUserDetails: (details: Partial<Omit<UserState, 'setUserDetails' | 'resetStore'>>) => void;
  resetStore: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  name: '',
  dateOfBirth: null,
  timeOfBirth: '',
  placeOfBirth: '',
  numberOfQuestionsAsked: 0,
  setUserDetails: (details) => set((state) => ({ ...state, ...details })),
  resetStore: () => set({ name: '', dateOfBirth: null, timeOfBirth: '', placeOfBirth: '', numberOfQuestionsAsked: 0 }),
}));
