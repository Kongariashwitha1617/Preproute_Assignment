import { create } from 'zustand';
import type { LocalQuestion } from '@/types/question';

interface QuestionDraftState {
  questions: LocalQuestion[];
  setQuestions: (
    questions:
      | LocalQuestion[]
      | ((current: LocalQuestion[]) => LocalQuestion[]),
  ) => void;
  addQuestion: (question: LocalQuestion) => void;
  updateQuestion: (localId: string, question: LocalQuestion) => void;
  removeQuestion: (localId: string) => void;
  clearQuestions: () => void;
}

export const useQuestionDraftStore = create<QuestionDraftState>((set) => ({
  questions: [],
  setQuestions: (questionsOrUpdater) =>
    set((state) => ({
      questions:
        typeof questionsOrUpdater === 'function'
          ? questionsOrUpdater(state.questions)
          : questionsOrUpdater,
    })),
  addQuestion: (question) =>
    set((state) => ({ questions: [...state.questions, question] })),
  updateQuestion: (localId, question) =>
    set((state) => ({
      questions: state.questions.map((q) => (q.localId === localId ? question : q)),
    })),
  removeQuestion: (localId) =>
    set((state) => ({
      questions: state.questions.filter((q) => q.localId !== localId),
    })),
  clearQuestions: () => set({ questions: [] }),
}));
