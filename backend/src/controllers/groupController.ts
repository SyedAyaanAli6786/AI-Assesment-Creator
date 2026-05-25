import { Request, Response } from 'express';
import { Group } from '../models/Group';
import { generateParentReport } from '../services/aiService';

export const getGroups = async (req: Request, res: Response) => {
  try {
    const groups = await Group.find().sort({ createdAt: -1 });
    res.json({ success: true, data: groups });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createGroup = async (req: Request, res: Response) => {
  try {
    const group = new Group(req.body);
    await group.save();
    res.json({ success: true, data: group });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getGroupById = async (req: Request, res: Response) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });
    res.json({ success: true, data: group });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addStudent = async (req: Request, res: Response) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });
    
    group.students.push(req.body);
    await group.save();
    res.json({ success: true, data: group });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addGrade = async (req: Request, res: Response) => {
  try {
    const { studentId, assignmentName, score, maxScore } = req.body;
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });
    
    const student = group.students.id(studentId);
    if (student) {
      student.grades.push({ assignmentName, score, maxScore });
      await group.save();
    }
    res.json({ success: true, data: group });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addSubGroup = async (req: Request, res: Response) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });
    
    group.subGroups.push(req.body);
    await group.save();
    res.json({ success: true, data: group });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const generateReport = async (req: Request, res: Response) => {
  try {
    const { studentData } = req.body;
    const report = await generateParentReport(studentData);
    res.json({ success: true, data: report });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
