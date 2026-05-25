import mongoose, { Schema, Document } from 'mongoose';

export interface ISavedQuestion extends Document {
  subject: string;
  className: string;
  questionText: string;
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  marks: number;
  answer?: string;
  createdAt: Date;
}

export interface IBlueprint extends Document {
  name: string;
  subject: string;
  className: string;
  questionTypes: any[];
  timeAllowed: string;
  generalInstructions?: string;
  createdAt: Date;
}

export interface ISourceMaterial extends Document {
  name: string;
  subject: string;
  className: string;
  content: string; // The extracted text from the PDF
  originalFileName: string;
  createdAt: Date;
}

const SavedQuestionSchema = new Schema({
  subject: { type: String, required: true },
  className: { type: String, required: true },
  questionText: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Moderate', 'Hard'], required: true },
  marks: { type: Number, required: true },
  answer: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const BlueprintSchema = new Schema({
  name: { type: String, required: true },
  subject: { type: String, required: true },
  className: { type: String, required: true },
  questionTypes: { type: Array, required: true },
  timeAllowed: { type: String, required: true },
  generalInstructions: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const SourceMaterialSchema = new Schema({
  name: { type: String, required: true },
  subject: { type: String, required: true },
  className: { type: String, required: true },
  content: { type: String, required: true },
  originalFileName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const SavedQuestion = mongoose.model<ISavedQuestion>('SavedQuestion', SavedQuestionSchema);
export const Blueprint = mongoose.model<IBlueprint>('Blueprint', BlueprintSchema);
export const SourceMaterial = mongoose.model<ISourceMaterial>('SourceMaterial', SourceMaterialSchema);
