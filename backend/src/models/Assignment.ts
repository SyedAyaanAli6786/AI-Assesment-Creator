import mongoose, { Document, Schema } from 'mongoose';

export interface IAssignment extends Document {
  title: string;
  subject: string;
  className: string;
  schoolName: string;
  dueDate: Date;
  questionTypes: {
    type: string;
    numberOfQuestions: number;
    marksPerQuestion: number;
  }[];
  totalQuestions: number;
  totalMarks: number;
  timeAllowed: string;
  additionalInstructions: string;
  uploadedContent: string;
  generatedPaper: object | null;
  jobId: string;
  status: 'draft' | 'generating' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

const assignmentSchema = new Schema<IAssignment>(
  {
    title: { type: String, required: true },
    subject: { type: String, required: true },
    className: { type: String, required: true },
    schoolName: { type: String, default: 'Delhi Public School, Sector-4, Bokaro' },
    dueDate: { type: Date, required: true },
    questionTypes: [
      {
        type: { type: String, required: true },
        numberOfQuestions: { type: Number, required: true, min: 1 },
        marksPerQuestion: { type: Number, required: true, min: 1 },
      },
    ],
    totalQuestions: { type: Number, required: true },
    totalMarks: { type: Number, required: true },
    timeAllowed: { type: String, default: '45 minutes' },
    additionalInstructions: { type: String, default: '' },
    uploadedContent: { type: String, default: '' },
    generatedPaper: { type: Schema.Types.Mixed, default: null },
    jobId: { type: String, default: '' },
    status: {
      type: String,
      enum: ['draft', 'generating', 'completed', 'failed'],
      default: 'draft',
    },
  },
  { timestamps: true }
);

export const Assignment = mongoose.model<IAssignment>('Assignment', assignmentSchema);
