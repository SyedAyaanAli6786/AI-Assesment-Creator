export interface QuestionTypeConfig {
  id: string;
  type: string;
  numberOfQuestions: number;
  marksPerQuestion: number;
}

export interface AssignmentFormData {
  subject: string;
  className: string;
  schoolName: string;
  dueDate: string;
  questionTypes: QuestionTypeConfig[];
  additionalInstructions: string;
  uploadedFile: File | null;
  uploadedContent: string;
  timeAllowed: string;
}

export interface GeneratedQuestion {
  questionNumber: number;
  questionText: string;
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  marks: number;
  answer: string;
}

export interface QuestionSection {
  sectionTitle: string;
  sectionLabel: string;
  questionType: string;
  instruction: string;
  marksPerQuestion: number;
  questions: GeneratedQuestion[];
}

export interface GeneratedPaper {
  schoolName: string;
  subject: string;
  className: string;
  timeAllowed: string;
  maxMarks: number;
  generalInstructions: string[];
  sections: QuestionSection[];
}

export interface Assignment {
  _id: string;
  title: string;
  subject: string;
  className: string;
  schoolName: string;
  dueDate: string;
  questionTypes: QuestionTypeConfig[];
  totalQuestions: number;
  totalMarks: number;
  timeAllowed: string;
  additionalInstructions: string;
  generatedPaper: GeneratedPaper | null;
  status: 'draft' | 'generating' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
}

export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed';
