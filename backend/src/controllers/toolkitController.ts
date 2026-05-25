import { Request, Response } from 'express';
import { generateToolkitContent } from '../services/aiService';

export const handleGenerateToolkit = async (req: Request, res: Response): Promise<void> => {
  try {
    const { toolType, inputData } = req.body;
    
    if (!toolType || !inputData) {
      res.status(400).json({ success: false, message: 'Missing toolType or inputData' });
      return;
    }
    
    const result = await generateToolkitContent(toolType, inputData);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    console.error('Toolkit Controller Error:', error.message);
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};
