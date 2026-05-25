import mongoose, { Schema, Document } from 'mongoose';

export interface IStudent extends Document {
  name: string;
  parentEmail?: string;
  grades: { assignmentName: string; score: number; maxScore: number }[];
}

export interface ISubGroup extends Document {
  name: string;
  studentIds: string[]; // references to IStudent._id
}

export interface IGroup extends Document {
  name: string;
  subject: string;
  type: 'Class' | 'Department';
  students: mongoose.Types.DocumentArray<IStudent>;
  subGroups: mongoose.Types.DocumentArray<ISubGroup>;
  sharedAssignments: string[]; // references to Assignment IDs
  createdAt: Date;
}

const StudentSchema = new Schema({
  name: { type: String, required: true },
  parentEmail: { type: String },
  grades: [{
    assignmentName: String,
    score: Number,
    maxScore: Number
  }]
});

const SubGroupSchema = new Schema({
  name: { type: String, required: true },
  studentIds: [{ type: String }]
});

const GroupSchema = new Schema({
  name: { type: String, required: true },
  subject: { type: String },
  type: { type: String, enum: ['Class', 'Department'], default: 'Class' },
  students: [StudentSchema],
  subGroups: [SubGroupSchema],
  sharedAssignments: [{ type: Schema.Types.ObjectId, ref: 'Assignment' }],
  createdAt: { type: Date, default: Date.now }
});

export const Group = mongoose.model<IGroup>('Group', GroupSchema);
