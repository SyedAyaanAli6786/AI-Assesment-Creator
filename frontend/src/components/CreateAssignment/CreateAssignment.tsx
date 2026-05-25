'use client';

import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  HiOutlineArrowLeft,
  HiOutlineArrowRight,
  HiOutlineCloudArrowUp,
  HiOutlineCalendar,
  HiOutlineXMark,
  HiOutlinePlusCircle,
  HiOutlineMinus,
  HiOutlinePlus,
  HiOutlineMicrophone,
} from 'react-icons/hi2';
import { useStore } from '../../store/useStore';
import styles from './CreateAssignment.module.css';

const QUESTION_TYPE_OPTIONS = [
  'Multiple Choice Questions',
  'Short Questions',
  'Long Answer Questions',
  'Diagram/Graph-Based Questions',
  'Numerical Problems',
  'True/False Questions',
  'Fill in the Blanks',
  'Match the Following',
];

export default function CreateAssignment() {
  const router = useRouter();
  const {
    formData,
    formStep,
    setFormData,
    setFormStep,
    addQuestionType,
    removeQuestionType,
    updateQuestionType,
    createAssignment,
    resetForm,
    isLoading,
  } = useStore();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dragOver, setDragOver] = useState(false);

  const totalQuestions = formData.questionTypes.reduce(
    (sum, qt) => sum + qt.numberOfQuestions, 0
  );
  const totalMarks = formData.questionTypes.reduce(
    (sum, qt) => sum + qt.numberOfQuestions * qt.marksPerQuestion, 0
  );

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.className.trim()) newErrors.className = 'Class is required';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.dueDate) newErrors.dueDate = 'Due date is required';
    if (formData.questionTypes.length === 0) newErrors.questionTypes = 'Add at least one question type';

    formData.questionTypes.forEach((qt, index) => {
      if (qt.numberOfQuestions <= 0) {
        newErrors[`qt_${index}_num`] = 'Must be positive';
      }
      if (qt.marksPerQuestion <= 0) {
        newErrors[`qt_${index}_marks`] = 'Must be positive';
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleNext = () => {
    if (formStep === 1 && validateStep1()) {
      setFormStep(2);
    }
  };

  const handlePrevious = () => {
    if (formStep === 2) {
      setFormStep(1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep2()) return;

    const assignmentId = await createAssignment();
    if (assignmentId) {
      resetForm();
      router.push(`/assignments/${assignmentId}`);
    }
  };

  const handleFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setFormData({ uploadedFile: file });
      // Read text content if it's a text file
      if (file.type === 'text/plain') {
        const reader = new FileReader();
        reader.onload = (ev) => {
          setFormData({ uploadedContent: ev.target?.result as string });
        };
        reader.readAsText(file);
      }
    }
  }, [setFormData]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ uploadedFile: file });
      if (file.type === 'text/plain') {
        const reader = new FileReader();
        reader.onload = (ev) => {
          setFormData({ uploadedContent: ev.target?.result as string });
        };
        reader.readAsText(file);
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Image src="/green-dot.png" alt="Green Dot" width={36} height={36} unoptimized />
        <div>
          <h1 className={styles.pageTitle} style={{ margin: 0, marginBottom: '2px' }}>Create Assignment</h1>
          <p className={styles.pageDesc} style={{ margin: 0 }}>Set up a new assignment for your students.</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className={styles.progressBar}>
        <div className={`${styles.progressStep} ${formStep >= 1 ? styles.active : ''}`} />
        <div className={`${styles.progressStep} ${formStep >= 2 ? styles.active : ''}`} />
      </div>

      <div className={styles.formCard}>
        {formStep === 1 && (
          <div className={styles.stepContent}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Assignment Details</h2>
              <p className={styles.sectionDesc}>Basic information about your assignment</p>
            </div>

            {/* Subject & Class */}
            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label className={styles.label}>Subject <span className={styles.required}>*</span></label>
                <input
                  type="text"
                  className={`${styles.input} ${errors.subject ? styles.inputError : ''}`}
                  placeholder="e.g. Science, Mathematics"
                  value={formData.subject}
                  onChange={(e) => setFormData({ subject: e.target.value })}
                />
                {errors.subject && <span className={styles.errorText}>{errors.subject}</span>}
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Class <span className={styles.required}>*</span></label>
                <input
                  type="text"
                  className={`${styles.input} ${errors.className ? styles.inputError : ''}`}
                  placeholder="e.g. 8th, 10th"
                  value={formData.className}
                  onChange={(e) => setFormData({ className: e.target.value })}
                />
                {errors.className && <span className={styles.errorText}>{errors.className}</span>}
              </div>
            </div>

            {/* File Upload */}
            <div className={styles.field}>
              <div
                className={`${styles.uploadArea} ${dragOver ? styles.uploadDragOver : ''}`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleFileDrop}
              >
                <HiOutlineCloudArrowUp className={styles.uploadIcon} />
                <p className={styles.uploadText}>
                  Choose a file or drag & drop it here
                </p>
                <p className={styles.uploadHint}>JPEG, PNG, upto 10MB</p>
                <label className={styles.browseBtn}>
                  Browse Files
                  <input
                    type="file"
                    hidden
                    accept=".pdf,.txt,.png,.jpg,.jpeg"
                    onChange={handleFileSelect}
                  />
                </label>
                {formData.uploadedFile && (
                  <div className={styles.fileName}>
                    📄 {formData.uploadedFile.name}
                    <button onClick={() => setFormData({ uploadedFile: null, uploadedContent: '' })}>
                      <HiOutlineXMark />
                    </button>
                  </div>
                )}
              </div>
              <p className={styles.uploadCaption}>
                Upload images of your preferred document/image
              </p>
            </div>
          </div>
        )}

        {formStep === 2 && (
          <div className={styles.stepContent}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Assignment Details</h2>
              <p className={styles.sectionDesc}>Basic information about your assignment</p>
            </div>

            {/* Due Date */}
            <div className={styles.field}>
              <label className={styles.label}>Due Date</label>
              <div className={styles.dateWrapper}>
                <input
                  type="date"
                  className={`${styles.input} ${errors.dueDate ? styles.inputError : ''}`}
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ dueDate: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                />
                <HiOutlineCalendar className={styles.dateIcon} />
              </div>
              {errors.dueDate && <span className={styles.errorText}>{errors.dueDate}</span>}
            </div>

            {/* Question Types */}
            <div className={styles.field}>
              <div className={styles.qtHeader}>
                <label className={styles.label}>Question Type</label>
                <div className={styles.qtLabels}>
                  <span className={styles.qtLabel}>No. of Questions</span>
                  <span className={styles.qtLabel}>Marks</span>
                </div>
              </div>

              <div className={styles.qtList}>
                {formData.questionTypes.map((qt) => (
                  <div key={qt.id} className={styles.qtRow}>
                    <div className={styles.qtSelect}>
                      <select
                        value={qt.type}
                        onChange={(e) => updateQuestionType(qt.id, { type: e.target.value })}
                        className={styles.select}
                      >
                        {QUESTION_TYPE_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                    <button
                      className={styles.removeBtn}
                      onClick={() => removeQuestionType(qt.id)}
                    >
                      <HiOutlineXMark />
                    </button>
                    <div className={styles.counterGroup}>
                      <button
                        className={styles.counterBtn}
                        onClick={() => updateQuestionType(qt.id, {
                          numberOfQuestions: Math.max(1, qt.numberOfQuestions - 1)
                        })}
                      >
                        <HiOutlineMinus />
                      </button>
                      <span className={styles.counterValue}>{qt.numberOfQuestions}</span>
                      <button
                        className={styles.counterBtn}
                        onClick={() => updateQuestionType(qt.id, {
                          numberOfQuestions: qt.numberOfQuestions + 1
                        })}
                      >
                        <HiOutlinePlus />
                      </button>
                    </div>
                    <div className={styles.counterGroup}>
                      <button
                        className={styles.counterBtn}
                        onClick={() => updateQuestionType(qt.id, {
                          marksPerQuestion: Math.max(1, qt.marksPerQuestion - 1)
                        })}
                      >
                        <HiOutlineMinus />
                      </button>
                      <span className={styles.counterValue}>{qt.marksPerQuestion}</span>
                      <button
                        className={styles.counterBtn}
                        onClick={() => updateQuestionType(qt.id, {
                          marksPerQuestion: qt.marksPerQuestion + 1
                        })}
                      >
                        <HiOutlinePlus />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button className={styles.addQtBtn} onClick={addQuestionType}>
                <HiOutlinePlusCircle className={styles.addQtIcon} />
                Add Question Type
              </button>

              <div className={styles.totals}>
                <span>Total Questions : {totalQuestions}</span>
                <span>Total Marks : {totalMarks}</span>
              </div>
            </div>

            {/* Additional Instructions */}
            <div className={styles.field}>
              <label className={styles.label}>Additional Information (For better output)</label>
              <div className={styles.textareaWrapper}>
                <textarea
                  className={styles.textarea}
                  placeholder="eg: Generate a question paper for 3 hour exam duration..."
                  value={formData.additionalInstructions}
                  onChange={(e) => setFormData({ additionalInstructions: e.target.value })}
                  rows={3}
                />
                <HiOutlineMicrophone className={styles.micIcon} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className={styles.actions}>
        {formStep > 1 && (
          <button className={styles.prevBtn} onClick={handlePrevious}>
            <HiOutlineArrowLeft />
            Previous
          </button>
        )}
        <div className={styles.spacer} />
        {formStep === 1 ? (
          <button className={styles.nextBtn} onClick={handleNext}>
            Next
            <HiOutlineArrowRight />
          </button>
        ) : (
          <button
            className={styles.nextBtn}
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className={styles.btnSpinner} />
                Generating...
              </>
            ) : (
              <>
                Next
                <HiOutlineArrowRight />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
