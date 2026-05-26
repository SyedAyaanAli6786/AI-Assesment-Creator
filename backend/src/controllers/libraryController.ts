import { Request, Response } from 'express';
import { SavedQuestion, Blueprint, SourceMaterial } from '../models/Library';

// --- Saved Questions ---
export const getSavedQuestions = async (req: Request, res: Response) => {
  try {
    const questions = await SavedQuestion.find().sort({ createdAt: -1 });
    res.json({ success: true, data: questions });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const saveQuestion = async (req: Request, res: Response): Promise<any> => {
  try {
    const existing = await SavedQuestion.findOne({ questionText: req.body.questionText });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Question already exists in library' });
    }
    const question = new SavedQuestion(req.body);
    await question.save();
    res.json({ success: true, data: question });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteSavedQuestion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await SavedQuestion.findByIdAndDelete(id);
    res.json({ success: true, message: 'Question deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- Blueprints ---
export const getBlueprints = async (req: Request, res: Response) => {
  try {
    const blueprints = await Blueprint.find().sort({ createdAt: -1 });
    res.json({ success: true, data: blueprints });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const saveBlueprint = async (req: Request, res: Response) => {
  try {
    const blueprint = new Blueprint(req.body);
    await blueprint.save();
    res.json({ success: true, data: blueprint });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- Source Materials ---
export const getSourceMaterials = async (req: Request, res: Response) => {
  try {
    const materials = await SourceMaterial.find().sort({ createdAt: -1 });
    res.json({ success: true, data: materials });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const saveSourceMaterial = async (req: Request, res: Response) => {
  try {
    const material = new SourceMaterial(req.body);
    await material.save();
    res.json({ success: true, data: material });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
