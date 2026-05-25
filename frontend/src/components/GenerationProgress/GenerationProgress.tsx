'use client';

import React from 'react';
import styles from './GenerationProgress.module.css';

interface GenerationProgressProps {
  progress: number;
  message: string;
  status: string;
}

export default function GenerationProgress({ progress, message, status }: GenerationProgressProps) {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.iconWrapper}>
          <div className={styles.spinner}>
            <svg width="60" height="60" viewBox="0 0 60 60">
              <circle
                cx="30" cy="30" r="26"
                fill="none"
                stroke="var(--border-color)"
                strokeWidth="4"
              />
              <circle
                cx="30" cy="30" r="26"
                fill="none"
                stroke="var(--accent-orange)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="163.36"
                strokeDashoffset={163.36 - (163.36 * progress) / 100}
                style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                transform="rotate(-90 30 30)"
              />
            </svg>
            <span className={styles.progressText}>{progress}%</span>
          </div>
        </div>

        <h3 className={styles.title}>
          {status === 'generating' ? 'Generating Question Paper...' : 'Processing...'}
        </h3>
        <p className={styles.message}>{message}</p>

        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill} 
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className={styles.steps}>
          <div className={`${styles.step} ${progress >= 10 ? styles.stepDone : ''}`}>
            <span className={styles.stepDot} />
            <span>Analyzing input</span>
          </div>
          <div className={`${styles.step} ${progress >= 30 ? styles.stepDone : ''}`}>
            <span className={styles.stepDot} />
            <span>Generating questions</span>
          </div>
          <div className={`${styles.step} ${progress >= 60 ? styles.stepDone : ''}`}>
            <span className={styles.stepDot} />
            <span>Structuring sections</span>
          </div>
          <div className={`${styles.step} ${progress >= 80 ? styles.stepDone : ''}`}>
            <span className={styles.stepDot} />
            <span>Finalizing paper</span>
          </div>
          <div className={`${styles.step} ${progress >= 100 ? styles.stepDone : ''}`}>
            <span className={styles.stepDot} />
            <span>Complete!</span>
          </div>
        </div>
      </div>
    </div>
  );
}
