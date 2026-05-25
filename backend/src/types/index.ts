export interface QuestionTypeConfig {
  type: string;
  numberOfQuestions: number;
  marksPerQuestion: number;
}

export interface AssignmentInput {
  subject: string;
  className: string;
  schoolName: string;
  dueDate: string;
  questionTypes: QuestionTypeConfig[];
  additionalInstructions?: string;
  totalQuestions: number;
  totalMarks: number;
  timeAllowed?: string;
  uploadedContent?: string;
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

export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed';
