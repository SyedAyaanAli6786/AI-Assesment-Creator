import { create } from 'zustand';
import { Assignment, AssignmentFormData, QuestionTypeConfig, GeneratedPaper } from '../lib/types';
import { api } from '../lib/api';

interface GenerationProgress {
  status: string;
  message: string;
  progress: number;
}

interface AppState {
  // Assignments
  assignments: Assignment[];
  currentAssignment: Assignment | null;
  isLoading: boolean;
  error: string | null;
  
  // Form data
  formData: AssignmentFormData;
  formStep: number;
  
  // Generation
  generationProgress: GenerationProgress | null;
  isGenerating: boolean;
  
  // Search
  searchQuery: string;
  
  // WebSocket
  wsConnected: boolean;
  
  // Actions
  setFormData: (data: Partial<AssignmentFormData>) => void;
  setFormStep: (step: number) => void;
  addQuestionType: () => void;
  removeQuestionType: (id: string) => void;
  updateQuestionType: (id: string, updates: Partial<QuestionTypeConfig>) => void;
  resetForm: () => void;
  
  fetchAssignments: (search?: string) => Promise<void>;
  fetchAssignment: (id: string) => Promise<void>;
  createAssignment: () => Promise<string | null>;
  deleteAssignment: (id: string) => Promise<void>;
  regenerateAssignment: (id: string) => Promise<void>;
  renameAssignment: (id: string, title: string) => Promise<void>;
  
  setGenerationProgress: (progress: GenerationProgress | null) => void;
  setGeneratedPaper: (assignmentId: string, paper: GeneratedPaper) => void;
  setSearchQuery: (query: string) => void;
  setWsConnected: (connected: boolean) => void;
  setError: (error: string | null) => void;
  updateAssignmentStatus: (id: string, status: Assignment['status']) => void;
}

const defaultFormData: AssignmentFormData = {
  subject: '',
  className: '',
  schoolName: 'Delhi Public School, Sector-4, Bokaro',
  dueDate: '',
  questionTypes: [
    { id: '1', type: 'Multiple Choice Questions', numberOfQuestions: 4, marksPerQuestion: 1 },
    { id: '2', type: 'Short Questions', numberOfQuestions: 3, marksPerQuestion: 2 },
  ],
  additionalInstructions: '',
  uploadedFile: null,
  uploadedContent: '',
  timeAllowed: '45 minutes',
};

export const useStore = create<AppState>((set, get) => ({
  assignments: [],
  currentAssignment: null,
  isLoading: false,
  error: null,
  formData: { ...defaultFormData },
  formStep: 1,
  generationProgress: null,
  isGenerating: false,
  searchQuery: '',
  wsConnected: false,

  setFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),

  setFormStep: (step) => set({ formStep: step }),

  addQuestionType: () =>
    set((state) => ({
      formData: {
        ...state.formData,
        questionTypes: [
          ...state.formData.questionTypes,
          {
            id: Date.now().toString(),
            type: 'Short Questions',
            numberOfQuestions: 1,
            marksPerQuestion: 1,
          },
        ],
      },
    })),

  removeQuestionType: (id) =>
    set((state) => ({
      formData: {
        ...state.formData,
        questionTypes: state.formData.questionTypes.filter((qt) => qt.id !== id),
      },
    })),

  updateQuestionType: (id, updates) =>
    set((state) => ({
      formData: {
        ...state.formData,
        questionTypes: state.formData.questionTypes.map((qt) =>
          qt.id === id ? { ...qt, ...updates } : qt
        ),
      },
    })),

  resetForm: () =>
    set({
      formData: { ...defaultFormData },
      formStep: 1,
    }),

  fetchAssignments: async (search) => {
    set({ isLoading: true, error: null });
    try {
      const data = await api.getAssignments(search);
      set({ assignments: data.assignments, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchAssignment: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const data = await api.getAssignment(id);
      set({ currentAssignment: data.assignment, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  createAssignment: async () => {
    const { formData } = get();
    set({ isLoading: true, error: null, isGenerating: true });
    
    try {
      const totalQuestions = formData.questionTypes.reduce(
        (sum, qt) => sum + qt.numberOfQuestions,
        0
      );
      const totalMarks = formData.questionTypes.reduce(
        (sum, qt) => sum + qt.numberOfQuestions * qt.marksPerQuestion,
        0
      );

      const payload = {
        subject: formData.subject,
        className: formData.className,
        schoolName: formData.schoolName,
        dueDate: formData.dueDate,
        questionTypes: formData.questionTypes.map((qt) => ({
          type: qt.type,
          numberOfQuestions: qt.numberOfQuestions,
          marksPerQuestion: qt.marksPerQuestion,
        })),
        totalQuestions,
        totalMarks,
        timeAllowed: formData.timeAllowed,
        additionalInstructions: formData.additionalInstructions,
        uploadedContent: formData.uploadedContent,
      };

      const data = await api.createAssignment(payload);
      set({ isLoading: false });
      return data.assignment.id;
    } catch (error: any) {
      set({ error: error.message, isLoading: false, isGenerating: false });
      return null;
    }
  },

  deleteAssignment: async (id) => {
    try {
      await api.deleteAssignment(id);
      set((state) => ({
        assignments: state.assignments.filter((a) => a._id !== id),
      }));
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  renameAssignment: async (id, title) => {
    try {
      await api.renameAssignment(id, title);
      set((state) => ({
        assignments: state.assignments.map((a) =>
          a._id === id ? { ...a, title } : a
        ),
        currentAssignment:
          state.currentAssignment?._id === id
            ? { ...state.currentAssignment, title }
            : state.currentAssignment,
      }));
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  regenerateAssignment: async (id) => {
    set({ isGenerating: true, generationProgress: null });
    try {
      await api.regenerateAssignment(id);
    } catch (error: any) {
      set({ error: error.message, isGenerating: false });
    }
  },

  setGenerationProgress: (progress) => set({ generationProgress: progress }),
  
  setGeneratedPaper: (assignmentId, paper) =>
    set((state) => ({
      currentAssignment: state.currentAssignment
        ? { ...state.currentAssignment, generatedPaper: paper, status: 'completed' }
        : null,
      assignments: state.assignments.map((a) =>
        a._id === assignmentId ? { ...a, generatedPaper: paper, status: 'completed' as const } : a
      ),
      isGenerating: false,
    })),

  setSearchQuery: (query) => set({ searchQuery: query }),
  setWsConnected: (connected) => set({ wsConnected: connected }),
  setError: (error) => set({ error }),
  updateAssignmentStatus: (id, status) =>
    set((state) => ({
      assignments: state.assignments.map((a) =>
        a._id === id ? { ...a, status } : a
      ),
      currentAssignment:
        state.currentAssignment?._id === id
          ? { ...state.currentAssignment, status }
          : state.currentAssignment,
    })),
}));
