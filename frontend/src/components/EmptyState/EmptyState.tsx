'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './EmptyState.module.css';

export default function EmptyState() {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <div className={styles.illustration}>
        <svg width="200" height="160" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Magnifying glass */}
          <circle cx="100" cy="70" r="45" stroke="#E5E7EB" strokeWidth="3" fill="#F9FAFB"/>
          <circle cx="100" cy="70" r="35" stroke="#D1D5DB" strokeWidth="2" fill="white"/>
          <line x1="130" y1="100" x2="150" y2="120" stroke="#D1D5DB" strokeWidth="4" strokeLinecap="round"/>
          
          {/* X mark */}
          <circle cx="100" cy="70" r="18" fill="#FEE2E2"/>
          <path d="M92 62L108 78M108 62L92 78" stroke="#EF4444" strokeWidth="3" strokeLinecap="round"/>
          
          {/* Document lines */}
          <rect x="72" y="50" width="20" height="3" rx="1.5" fill="#9CA3AF"/>
          <rect x="72" y="58" width="14" height="3" rx="1.5" fill="#D1D5DB"/>
          
          {/* Dots */}
          <circle cx="140" cy="45" r="3" fill="#93C5FD"/>
          <circle cx="60" cy="95" r="4" fill="#93C5FD"/>
          <circle cx="150" cy="75" r="2" fill="#D1D5DB"/>
          
          {/* Dashed lines */}
          <path d="M55 40 Q60 35 65 40" stroke="#9CA3AF" strokeWidth="1.5" strokeDasharray="3 3" fill="none"/>
          <path d="M130 35 Q135 30 140 35" stroke="#9CA3AF" strokeWidth="1.5" strokeDasharray="3 3" fill="none"/>
        </svg>
      </div>
      
      <h2 className={styles.title}>No assignments yet</h2>
      <p className={styles.description}>
        Create your first assignment to start collecting and grading student submissions. You can set up rubrics, define marking criteria, and let AI assist with grading.
      </p>
      
      <button 
        className={styles.createBtn}
        onClick={() => router.push('/assignments/create')}
      >
        + Create Your First Assignment
      </button>
    </div>
  );
}
