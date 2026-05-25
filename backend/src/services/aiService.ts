import { GoogleGenAI } from '@google/genai';
import { config } from '../config';
import { AssignmentInput, GeneratedPaper } from '../types';
import { buildPrompt } from '../utils/promptBuilder';

const ai = new GoogleGenAI({ apiKey: config.geminiApiKey });

export async function generateQuestionPaper(input: AssignmentInput): Promise<GeneratedPaper> {
  const prompt = buildPrompt(input);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    let text = response.text || '';
    
    // Clean up response - remove markdown code fences if present
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const parsed: GeneratedPaper = JSON.parse(text);
    
    // Validate the structure
    if (!parsed.sections || !Array.isArray(parsed.sections)) {
      throw new Error('Invalid response structure: missing sections');
    }
    
    // Ensure all questions have required fields and recalculate correct marks
    let calculatedMaxMarks = 0;
    const seenQuestionNumbers = new Set<string | number>();

    for (const section of parsed.sections) {
      if (!section.questions || !Array.isArray(section.questions)) {
        throw new Error(`Invalid section: ${section.sectionTitle} missing questions`);
      }
      for (const question of section.questions) {
        if (!question.questionText || !question.difficulty || question.marks === undefined) {
          throw new Error('Invalid question structure');
        }
        // Normalize difficulty
        const validDifficulties = ['Easy', 'Moderate', 'Hard'];
        if (!validDifficulties.includes(question.difficulty)) {
          question.difficulty = 'Moderate';
        }

        // Add to total marks only if this question number hasn't been counted yet
        // This handles optional questions that share the same question number
        if (!seenQuestionNumbers.has(question.questionNumber)) {
          calculatedMaxMarks += Number(question.marks);
          seenQuestionNumbers.add(question.questionNumber);
        }
      }
    }
    
    // Override the AI's potentially faulty total sum with the true calculated sum
    parsed.maxMarks = calculatedMaxMarks;
    
    return parsed;
  } catch (error: any) {
    console.error('AI Generation Error:', error.message);
    throw new Error(`Failed to generate question paper: ${error.message}`);
  }
}

export async function generateToolkitContent(toolType: string, inputData: any): Promise<string> {
  let prompt = '';
  
  if (toolType === 'rubric') {
    prompt = `Create a detailed grading rubric for the following assignment: "${inputData.description}". Max Marks: ${inputData.maxMarks}. Output the rubric in a professional Markdown table format. Include criteria like Content, Grammar, Structure, etc. as appropriate.`;
  } else if (toolType === 'real_world') {
    prompt = `I am a teacher teaching the topic: "${inputData.topic}". Generate 3-5 engaging, real-world scenarios, case studies, or mini-project ideas that connect this topic to everyday life or cool careers. Format nicely in Markdown.`;
  } else if (toolType === 'simplifier') {
    prompt = `Rewrite the following text into three different reading levels: 1) Below Level (simple vocabulary, shorter sentences), 2) On Level (standard), and 3) Above Level (advanced vocabulary, complex structure). \n\nText:\n${inputData.text}`;
  } else if (toolType === 'report_card') {
    prompt = `Write a professional, empathetic, and constructive 3-4 sentence report card comment for a student based on these tags/notes: "${inputData.tags}". Output only the comment paragraph.`;
  } else {
    throw new Error('Invalid tool type');
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || '';
  } catch (error: any) {
    console.error('AI Toolkit Generation Error:', error.message);
    throw new Error(`Failed to generate toolkit content: ${error.message}`);
  }
}
