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
