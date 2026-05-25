'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  HiOutlineDocumentPlus, 
  HiOutlineSparkles, 
  HiOutlineArchiveBox,
  HiOutlineClock,
  HiOutlineCheckBadge,
  HiOutlineCalendar,
  HiOutlineDocumentText,
  HiOutlineLightBulb
} from 'react-icons/hi2';
import { useStore } from '../store/useStore';
import Header from '../components/Header/Header';
import styles from './page.module.css';

const TIPS = [
  "Did you know? You can generate grading rubrics for essays in the AI Toolkit!",
  "Tip: Upload your syllabus PDF to get highly accurate chapter questions.",
  "You can save your favorite questions directly to the Question Bank from any generated paper.",
  "Create an Assignment Blueprint to save time on your weekly quizzes.",
  "Use the Content Simplifier in the AI Toolkit to differentiate reading materials for your class."
];

export default function Home() {
  const router = useRouter();
  const { assignments, fetchAssignments, isLoading } = useStore();
  const [tipOfTheDay, setTipOfTheDay] = useState('');

  useEffect(() => {
    fetchAssignments();
    setTipOfTheDay(TIPS[Math.floor(Math.random() * TIPS.length)]);
  }, [fetchAssignments]);

  // Analytics Calculations
  const totalPapers = assignments.length;
  const timeSaved = Math.round(totalPapers * 1.5); // assuming 1.5 hrs saved per paper
  
  // Top Subject calculation
  const subjectCounts = assignments.reduce((acc, curr) => {
    acc[curr.subject] = (acc[curr.subject] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const topSubject = Object.keys(subjectCounts).sort((a, b) => subjectCounts[b] - subjectCounts[a])[0] || 'N/A';

  // Recent Activity
  const recentAssignments = [...assignments].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 4);

  // Upcoming Assessments
  const upcomingAssessments = assignments
    .filter(a => a.dueDate && new Date(a.dueDate).getTime() > new Date().getTime())
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 3);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <>
      <Header title="Dashboard" />
      <div className={styles.container}>
        
        {/* Banner */}
        <div className={styles.banner}>
          <div className={styles.bannerContent}>
            <h1>Welcome back to VedaAI 👋</h1>
            <p>Here's how much you've accomplished so far.</p>
          </div>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <HiOutlineDocumentText className={styles.statIcon} style={{ color: '#3b82f6', background: '#eff6ff' }} />
              <div>
                <h3>{totalPapers}</h3>
                <span>Papers Generated</span>
              </div>
            </div>
            <div className={styles.statCard}>
              <HiOutlineClock className={styles.statIcon} style={{ color: '#10b981', background: '#ecfdf5' }} />
              <div>
                <h3>{timeSaved} hrs</h3>
                <span>Approx. Time Saved</span>
              </div>
            </div>
            <div className={styles.statCard}>
              <HiOutlineCheckBadge className={styles.statIcon} style={{ color: '#8b5cf6', background: '#f5f3ff' }} />
              <div>
                <h3>{topSubject}</h3>
                <span>Top Subject</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <h2 className={styles.sectionTitle}>Quick Actions</h2>
        <div className={styles.quickActions}>
          <Link href="/assignments/create" className={styles.actionCard}>
            <div className={styles.actionIconWrapper} style={{ background: '#fef3c7', color: '#d97706' }}>
              <HiOutlineDocumentPlus className={styles.actionIcon} />
            </div>
            <div>
              <h3>Create Assignment</h3>
              <p>Generate a new paper instantly</p>
            </div>
          </Link>
          <Link href="/toolkit" className={styles.actionCard}>
            <div className={styles.actionIconWrapper} style={{ background: '#e0e7ff', color: '#4f46e5' }}>
              <HiOutlineSparkles className={styles.actionIcon} />
            </div>
            <div>
              <h3>AI Toolkit</h3>
              <p>Rubrics, simplifiers, and more</p>
            </div>
          </Link>
          <Link href="/library" className={styles.actionCard}>
            <div className={styles.actionIconWrapper} style={{ background: '#fce7f3', color: '#db2777' }}>
              <HiOutlineArchiveBox className={styles.actionIcon} />
            </div>
            <div>
              <h3>My Library</h3>
              <p>Saved questions and blueprints</p>
            </div>
          </Link>
        </div>

        <div className={styles.mainGrid}>
          {/* Recent Activity */}
          <div className={styles.recentSection}>
            <h2 className={styles.sectionTitle}>Recent Activity</h2>
            <div className={styles.cardList}>
              {isLoading ? (
                <div className={styles.emptyState}>Loading...</div>
              ) : recentAssignments.length > 0 ? (
                recentAssignments.map(a => (
                  <div key={a._id} className={styles.listItem} onClick={() => router.push(`/assignments/${a._id}`)}>
                    <div className={styles.itemIcon}>
                      <HiOutlineDocumentText />
                    </div>
                    <div className={styles.itemDetails}>
                      <h4>{a.title || `${a.className} - ${a.subject}`}</h4>
                      <span>Generated on {formatDate(a.createdAt)}</span>
                    </div>
                    <span className={`${styles.statusBadge} ${styles[a.status]}`}>
                      {a.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className={styles.emptyState}>No assignments generated yet.</div>
              )}
            </div>
          </div>

          {/* Upcoming & Tips */}
          <div className={styles.sideSection}>
            <h2 className={styles.sectionTitle}>Upcoming Deadlines</h2>
            <div className={styles.cardList} style={{ marginBottom: '24px' }}>
              {upcomingAssessments.length > 0 ? (
                upcomingAssessments.map(a => (
                  <div key={a._id} className={styles.listItem} onClick={() => router.push(`/assignments/${a._id}`)}>
                    <div className={styles.itemIcon} style={{ background: '#fef2f2', color: '#ef4444' }}>
                      <HiOutlineCalendar />
                    </div>
                    <div className={styles.itemDetails}>
                      <h4>{a.title || `${a.className} - ${a.subject}`}</h4>
                      <span style={{ color: '#ef4444', fontWeight: 500 }}>Due: {formatDate(a.dueDate)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.emptyState}>No upcoming deadlines!</div>
              )}
            </div>

            <div className={styles.tipCard}>
              <HiOutlineLightBulb className={styles.tipIcon} />
              <div>
                <h4>Tip of the Day</h4>
                <p>{tipOfTheDay}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
