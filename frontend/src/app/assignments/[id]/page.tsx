'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useStore } from '../../../store/useStore';
import { useWebSocket } from '../../../lib/useWebSocket';
import Header from '../../../components/Header/Header';
import QuestionPaper from '../../../components/QuestionPaper/QuestionPaper';
import GenerationProgress from '../../../components/GenerationProgress/GenerationProgress';
import styles from './page.module.css';

export default function AssignmentDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const {
    currentAssignment,
    isLoading,
    generationProgress,
    isGenerating,
    fetchAssignment,
    regenerateAssignment,
    error,
  } = useStore();

  // Connect WebSocket with assignment ID for targeted updates
  useWebSocket(id);

  useEffect(() => {
    if (id) {
      fetchAssignment(id);
    }
  }, [id, fetchAssignment]);

  const handleRegenerate = async () => {
    if (id) {
      await regenerateAssignment(id);
    }
  };

  if (isLoading && !currentAssignment) {
    return (
      <>
        <Header title="Assignment" showBack />
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner} />
          <p>Loading assignment...</p>
        </div>
      </>
    );
  }

  if (error && !currentAssignment) {
    return (
      <>
        <Header title="Assignment" showBack />
        <div className={styles.errorContainer}>
          <p className={styles.errorText}>Error: {error}</p>
        </div>
      </>
    );
  }

  // Show generation progress
  if (
    currentAssignment?.status === 'generating' ||
    (isGenerating && generationProgress)
  ) {
    return (
      <>
        <Header title="Assignment" showBack />
        <GenerationProgress
          progress={generationProgress?.progress || 10}
          message={generationProgress?.message || 'Starting generation...'}
          status={generationProgress?.status || 'generating'}
        />
      </>
    );
  }

  // Show generated paper
  if (currentAssignment?.generatedPaper) {
    return (
      <>
        <Header title="Create New" showBack />
        <div className={styles.container}>
          <QuestionPaper
            paper={currentAssignment.generatedPaper}
            onRegenerate={handleRegenerate}
            isRegenerating={isGenerating}
          />
        </div>
      </>
    );
  }

  // Fallback - assignment exists but no paper yet
  return (
    <>
      <Header title="Assignment" showBack />
      <div className={styles.waitingContainer}>
        <div className={styles.waitingCard}>
          <h2>Assignment Created</h2>
          <p>The question paper will appear here once generation is complete.</p>
          {currentAssignment?.status === 'failed' && (
            <>
              <p className={styles.failedText}>Generation failed. Please try again.</p>
              <button className={styles.retryBtn} onClick={handleRegenerate}>
                Regenerate
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
