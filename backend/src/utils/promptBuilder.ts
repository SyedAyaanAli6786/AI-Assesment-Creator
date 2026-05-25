import { AssignmentInput } from '../types';

export function buildPrompt(input: AssignmentInput): string {
  const sectionDescriptions = input.questionTypes
    .map((qt, index) => {
      const sectionLabel = String.fromCharCode(65 + index); // A, B, C...
      return `Section ${sectionLabel}: ${qt.type}
  - Number of questions: ${qt.numberOfQuestions}
  - Marks per question: ${qt.marksPerQuestion}
  - Total marks for this section: ${qt.numberOfQuestions * qt.marksPerQuestion}`;
    })
    .join('\n\n');

  const prompt = `You are an expert academic question paper generator. Generate a structured question paper with the following specifications:

**Subject:** ${input.subject}
**Class:** ${input.className}
**School:** ${input.schoolName}
**Time Allowed:** ${input.timeAllowed || '45 minutes'}
**Maximum Marks:** ${input.totalMarks}
**Total Questions:** ${input.totalQuestions}

**Sections:**
${sectionDescriptions}

${input.uploadedContent ? `**Reference Material:**\n${input.uploadedContent}\n` : ''}
${input.additionalInstructions ? `**Additional Instructions:** ${input.additionalInstructions}\n` : ''}

**IMPORTANT RULES:**
1. Each question must have a difficulty level: "Easy", "Moderate", or "Hard"
2. Distribute difficulty levels reasonably across each section
3. Each question must be clear, specific, and academically appropriate for the given class
4. Provide a concise answer for each question
5. Questions should test different aspects and topics within the subject
6. **CRITICAL:** For any "Multiple Choice Question" or MCQ, you MUST provide exactly 4 options (A, B, C, D) as part of the \`questionText\` string, separated by newlines. Do NOT ask a multiple choice question without providing the options!

**RESPOND IN THE FOLLOWING JSON FORMAT ONLY (no markdown, no code fences, pure JSON):**

{
  "schoolName": "${input.schoolName}",
  "subject": "${input.subject}",
  "className": "${input.className}",
  "timeAllowed": "${input.timeAllowed || '45 minutes'}",
  "maxMarks": ${input.totalMarks},
  "generalInstructions": [
    "All questions are compulsory unless stated otherwise.",
    "Write neat and legible answers."
  ],
  "sections": [
    {
      "sectionTitle": "Short Answer Questions",
      "sectionLabel": "Section A",
      "questionType": "Short Questions",
      "instruction": "Attempt all questions. Each question carries 2 marks.",
      "marksPerQuestion": 2,
      "questions": [
        {
          "questionNumber": 1,
          "questionText": "Which of the following is a good conductor of electricity?\nA) Wood\nB) Copper\nC) Plastic\nD) Rubber",
          "difficulty": "Easy",
          "marks": 1,
          "answer": "B) Copper"
        }
      ]
    }
  ]
}

Generate the complete question paper now.`;

  return prompt;
}
