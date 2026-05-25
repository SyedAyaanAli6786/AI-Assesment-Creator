'use client';

import React, { useRef } from 'react';
import { HiOutlineArrowDownTray, HiOutlineArrowPath } from 'react-icons/hi2';
import { GeneratedPaper } from '../../lib/types';
import styles from './QuestionPaper.module.css';

interface QuestionPaperProps {
  paper: GeneratedPaper;
  onRegenerate?: () => void;
  onEditConfig?: () => void;
  isRegenerating?: boolean;
}

export default function QuestionPaper({ paper, onRegenerate, onEditConfig, isRegenerating }: QuestionPaperProps) {
  const paperRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = () => {
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const getDifficultyClass = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return styles.diffEasy;
      case 'Moderate': return styles.diffModerate;
      case 'Hard': return styles.diffHard;
      default: return styles.diffModerate;
    }
  };

  const splitQuestionText = (text: string) => {
    // If it's a Match the Following question, skip the generic option splitting
    // so we don't accidentally rip out "A. Item" from Column B.
    if (text.includes('Column A') && text.includes('Column B')) {
      return { mainText: text, optionsText: null };
    }

    const match = text.match(/\n[A-D][\)\.]\s/i);
    if (match && match.index !== undefined) {
      return {
        mainText: text.substring(0, match.index),
        optionsText: text.substring(match.index)
      };
    }
    return { mainText: text, optionsText: null };
  };

  const getQuestionMarks = (q: any) => {
    if (q.questionText.includes('Column A') && q.questionText.includes('Column B')) {
      const colAIndex = q.questionText.indexOf('Column A');
      const colBIndex = q.questionText.indexOf('Column B');
      if (colAIndex !== -1 && colBIndex !== -1 && colAIndex < colBIndex) {
        const colA = q.questionText.substring(colAIndex, colBIndex).trim();
        const items = colA.split('\n').filter((l: string) => l.trim() !== '');
        // Subtract 1 for the "Column A" header itself
        const count = items.length - 1;
        if (count > 0) return count;
      }
    }
    return Number(q.marks) || 1;
  };

  const calculateSectionMarks = (section: any) => {
    let uniqueMarks: number[] = [];
    const seen = new Set<string | number>();
    section.questions.forEach((q: any) => {
      if (!seen.has(q.questionNumber)) {
        uniqueMarks.push(getQuestionMarks(q));
        seen.add(q.questionNumber);
      }
    });

    const match = section.instruction?.match(/(?:attempt|answer|do|solve)\s+(?:any\s+)?(\d+|one|two|three|four|five|six|seven|eight|nine|ten)/i);
    if (match && match[1]) {
      const wordToNum: { [key: string]: number } = {
        'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
        'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10
      };
      const parsedStr = match[1].toLowerCase();
      const numToAttempt = wordToNum[parsedStr] !== undefined ? wordToNum[parsedStr] : parseInt(parsedStr, 10);
      if (numToAttempt > 0 && numToAttempt < uniqueMarks.length) {
         return uniqueMarks.slice(0, numToAttempt).reduce((a, b) => a + b, 0);
      }
    }
    
    return uniqueMarks.reduce((a, b) => a + b, 0);
  };

  const renderQuestionContent = (text: string) => {
    if (text.includes('Column A') && text.includes('Column B')) {
      const colAIndex = text.indexOf('Column A');
      const colBIndex = text.indexOf('Column B');
      
      const prompt = text.substring(0, colAIndex).trim();
      const colA = text.substring(colAIndex, colBIndex).trim();
      let colB = text.substring(colBIndex).trim();
      let options = '';

      // Try to isolate actual MCQ choices at the end (if any exist)
      // Look for the word "Options" or a double newline followed by A), B)
      const optionsKeywordMatch = colB.search(/\n\s*Options?:?\s*\n/i);
      const doubleNewlineMatch = colB.match(/\n\n\(?[A-D][\)\.]\s/i);

      if (optionsKeywordMatch !== -1) {
        options = colB.substring(optionsKeywordMatch).trim();
        colB = colB.substring(0, optionsKeywordMatch).trim();
      } else if (doubleNewlineMatch && doubleNewlineMatch.index !== undefined) {
        options = colB.substring(doubleNewlineMatch.index).trim();
        colB = colB.substring(0, doubleNewlineMatch.index).trim();
      }
      
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', marginTop: '8px' }}>
          {prompt && <div style={{ whiteSpace: 'pre-wrap' }}>{prompt}</div>}
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '80%', margin: '0 auto' }}>
            <div style={{ flex: 1, whiteSpace: 'pre-wrap' }}>{colA}</div>
            <div style={{ flex: 1, whiteSpace: 'pre-wrap' }}>{colB}</div>
          </div>
          {options && <div style={{ whiteSpace: 'pre-wrap', marginTop: '12px' }}>{options}</div>}
        </div>
      );
    }
    
    return <span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>;
  };

  const toRoman = (num: number): string => {
    const romanNumerals: [string, number][] = [
      ['M', 1000], ['CM', 900], ['D', 500], ['CD', 400],
      ['C', 100], ['XC', 90], ['L', 50], ['XL', 40],
      ['X', 10], ['IX', 9], ['V', 5], ['IV', 4],
      ['I', 1]
    ];
    let result = '';
    for (const [roman, value] of romanNumerals) {
      while (num >= value) {
        result += roman;
        num -= value;
      }
    }
    return result;
  };

  const actualMarks = paper.sections.reduce((sum, section) => sum + calculateSectionMarks(section), 0);

  return (
    <div className={styles.container}>
      {/* Action Bar */}
      <div className={styles.actionBar}>
        <div className={styles.successMessage}>
          <span className={styles.checkIcon}>✓</span>
          Here is your customized Question Paper for your CBSE {paper.className} {paper.subject} classes on the NCERT chapters:
        </div>
        <div className={styles.actionButtons}>
          <button className={styles.downloadBtn} onClick={handleDownloadPDF}>
            <HiOutlineArrowDownTray />
            Download as PDF
          </button>
          {onEditConfig && (
            <button 
              className={styles.regenerateBtn} 
              onClick={onEditConfig}
              disabled={isRegenerating}
            >
              ⚙️ Edit Config
            </button>
          )}
          {onRegenerate && (
            <button 
              className={styles.regenerateBtn} 
              onClick={onRegenerate}
              disabled={isRegenerating}
            >
              <HiOutlineArrowPath className={isRegenerating ? styles.spinning : ''} />
              {isRegenerating ? 'Regenerating...' : 'Regenerate'}
            </button>
          )}
        </div>
      </div>

      {/* Paper Content */}
      <div className={styles.paperWrapper}>
        <div className={styles.paper} ref={paperRef}>
          {/* Paper Header */}
          <div className={styles.paperHeader}>
            <h1 className={styles.schoolName}>{paper.schoolName}</h1>
            <div className={styles.paperMeta}>
              <span>Subject: {paper.subject}</span>
              <span>Class: {paper.className}</span>
            </div>
            <div className={styles.paperInfo}>
              <span>Time Allowed: {paper.timeAllowed}</span>
              <span>Maximum Marks: {actualMarks}</span>
            </div>
          </div>

          {/* General Instructions */}
          {paper.generalInstructions && paper.generalInstructions.length > 0 && (
            <div className={styles.instructions}>
              {paper.generalInstructions.map((inst, i) => (
                <p key={i}>{inst}</p>
              ))}
            </div>
          )}

          {/* Student Info */}
          <div className={styles.studentInfo}>
            <div className={styles.infoLine}>
              <span>Name:</span>
              <div className={styles.infoBlank}></div>
            </div>
            <div className={styles.infoLine}>
              <span>Roll Number:</span>
              <div className={styles.infoBlank}></div>
            </div>
            <div className={styles.infoLine}>
              <span>Class: {paper.className} Section:</span>
              <div className={styles.infoBlank}></div>
            </div>
          </div>

          {/* Sections */}
          {paper.sections.map((section, sIdx) => (
            <div key={sIdx} className={styles.section}>
              <div style={{ width: '100%', textAlign: 'center', margin: '20px 0 10px 0' }}>
                <strong style={{ fontSize: '16px', textDecoration: 'underline' }}>
                  Section {String.fromCharCode(65 + sIdx)}
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <h3 className={styles.sectionTitle} style={{ marginBottom: 0 }}>
                  {toRoman(sIdx + 1)}. {section.sectionTitle}
                </h3>
                <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {calculateSectionMarks(section)} Marks
                </span>
              </div>
              <p className={styles.sectionInstruction}>{section.instruction}</p>

              <div className={styles.questionsList}>
                {section.questions.map((q, qIdx) => {
                  const { mainText, optionsText } = splitQuestionText(q.questionText);
                  const cleanMainText = mainText.replace(/^OR\b\s*-?\s*/i, '');
                  const isMatchingQuestion = cleanMainText.includes('Column A') && cleanMainText.includes('Column B');
                  
                  return (
                    <div key={qIdx} className={styles.question}>
                      <div className={styles.questionMain}>
                        {!isMatchingQuestion && <span className={styles.qNumber}>{qIdx + 1}.</span>}
                        <div className={styles.qContent}>
                          <div className={styles.qText}>
                            {renderQuestionContent(cleanMainText)}
                            <span className={styles.qMeta}>
                              <span className={`${styles.diffBadge} ${getDifficultyClass(q.difficulty)}`}>
                                {q.difficulty}
                              </span>
                              <span className={styles.marks}>
                                [{getQuestionMarks(q)} {getQuestionMarks(q) === 1 ? 'Mark' : 'Marks'}]
                              </span>
                            </span>
                            {optionsText && (
                              <span className={styles.optionsBlock} style={{ whiteSpace: 'pre-wrap' }}>
                                {optionsText}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <div className={styles.endOfPaper}>
            <p>— End of Question Paper —</p>
          </div>

          {/* Answer Key */}
          <div className={styles.answerKey}>
            <h2 className={styles.answerKeyTitle}>Answer Key:</h2>
            {paper.sections.map((section, sIdx) => (
              <div key={sIdx} className={styles.answerSection}>
                <div style={{ textAlign: 'center', marginTop: '16px', marginBottom: '8px' }}>
                  <strong style={{ fontSize: '14px', textDecoration: 'underline' }}>
                    Section {String.fromCharCode(65 + sIdx)}
                  </strong>
                </div>
                <h3 className={styles.sectionTitle} style={{ textAlign: 'left', marginTop: '8px', fontSize: '13px' }}>
                  {toRoman(sIdx + 1)}. {section.sectionTitle}
                </h3>
                {section.questions.map((q, qIdx) => (
                  <div key={qIdx} className={styles.answerItem}>
                    <span className={styles.answerNumber}>{qIdx + 1}.</span>
                    <span className={styles.answerText}>{q.answer}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
