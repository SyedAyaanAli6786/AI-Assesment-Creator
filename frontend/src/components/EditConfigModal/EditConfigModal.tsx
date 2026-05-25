import React, { useState } from 'react';
import styles from './EditConfigModal.module.css';

interface QuestionType {
  type: string;
  numberOfQuestions: number;
  marksPerQuestion: number;
}

interface EditConfigModalProps {
  initialQuestionTypes: QuestionType[];
  initialInstructions: string;
  onClose: () => void;
  onSave: (questionTypes: QuestionType[], instructions: string) => void;
}

const QUESTION_TYPE_OPTIONS = [
  'Multiple Choice Questions',
  'Short Answer Questions',
  'Long Answer Questions',
  'Fill in the blanks',
  'Match the following',
  'True or False'
];

export default function EditConfigModal({ initialQuestionTypes, initialInstructions, onClose, onSave }: EditConfigModalProps) {
  const [questionTypes, setQuestionTypes] = useState<QuestionType[]>(
    initialQuestionTypes.map(q => ({ ...q })) // Deep copy
  );
  const [instructions, setInstructions] = useState(initialInstructions);

  const updateQuestionType = (index: number, field: keyof QuestionType, value: any) => {
    const updated = [...questionTypes];
    updated[index] = { ...updated[index], [field]: value };
    setQuestionTypes(updated);
  };

  const addQuestionType = () => {
    setQuestionTypes([...questionTypes, { type: 'Multiple Choice Questions', numberOfQuestions: 1, marksPerQuestion: 1 }]);
  };

  const removeQuestionType = (index: number) => {
    setQuestionTypes(questionTypes.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave(questionTypes, instructions);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Edit Generation Configuration</h2>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>
        
        <div className={styles.content}>
          <div className={styles.section}>
            <h3>Question Types</h3>
            {questionTypes.map((qt, idx) => (
              <div key={idx} className={styles.row}>
                <select 
                  value={qt.type} 
                  onChange={(e) => updateQuestionType(idx, 'type', e.target.value)}
                  className={styles.input}
                >
                  {QUESTION_TYPE_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <div className={styles.numberInputGroup}>
                  <label>Questions:</label>
                  <input 
                    type="number" 
                    min="1" 
                    value={qt.numberOfQuestions} 
                    onChange={(e) => updateQuestionType(idx, 'numberOfQuestions', parseInt(e.target.value) || 0)}
                    className={styles.inputNumber}
                  />
                </div>
                <div className={styles.numberInputGroup}>
                  <label>Marks:</label>
                  <input 
                    type="number" 
                    min="1" 
                    value={qt.marksPerQuestion} 
                    onChange={(e) => updateQuestionType(idx, 'marksPerQuestion', parseInt(e.target.value) || 0)}
                    className={styles.inputNumber}
                  />
                </div>
                <button className={styles.deleteBtn} onClick={() => removeQuestionType(idx)}>🗑️</button>
              </div>
            ))}
            <button className={styles.addBtn} onClick={addQuestionType}>+ Add Question Type</button>
          </div>

          <div className={styles.section}>
            <h3>Additional Instructions (The Prompt)</h3>
            <textarea
              className={styles.textarea}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="E.g., Give 6 questions but ask students to attempt any 5..."
            />
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button className={styles.saveBtn} onClick={handleSave}>Update & Regenerate</button>
        </div>
      </div>
    </div>
  );
}
