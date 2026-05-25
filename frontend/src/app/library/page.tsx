'use client';

import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import styles from './page.module.css';
import { HiOutlineArchiveBox, HiOutlineDocumentDuplicate, HiOutlineSquare3Stack3D } from 'react-icons/hi2';
import { API_BASE } from '../../lib/api';

const TABS = [
  { id: 'questions', name: 'Question Bank', icon: HiOutlineArchiveBox },
  { id: 'blueprints', name: 'Blueprints', icon: HiOutlineSquare3Stack3D },
  { id: 'materials', name: 'Source Materials', icon: HiOutlineDocumentDuplicate },
];

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState(TABS[0].id);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  const fetchData = async (tab: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/library/${tab}`);
      const result = await response.json();
      if (result.success) {
        setData(result.data);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const renderContent = () => {
    if (loading) return <div className={styles.loading}>Loading...</div>;
    if (data.length === 0) return <div className={styles.empty}>Nothing saved here yet.</div>;

    if (activeTab === 'questions') {
      return (
        <div className={styles.grid}>
          {data.map((q: any) => (
            <div key={q._id} className={styles.card}>
              <div className={styles.cardMeta}>
                <span className={styles.badge}>{q.subject}</span>
                <span className={styles.badge}>{q.className}</span>
                <span className={`${styles.badge} ${styles['diff' + q.difficulty]}`}>{q.difficulty}</span>
                <span className={styles.marks}>{q.marks} Marks</span>
              </div>
              <p className={styles.questionText}>{q.questionText}</p>
              {q.answer && <div className={styles.answer}><strong>Answer:</strong> {q.answer}</div>}
            </div>
          ))}
        </div>
      );
    }

    if (activeTab === 'blueprints') {
      return (
        <div className={styles.grid}>
          {data.map((b: any) => (
            <div key={b._id} className={styles.card}>
              <h3>{b.name}</h3>
              <div className={styles.cardMeta}>
                <span>{b.subject} • {b.className} • {b.timeAllowed}</span>
              </div>
              <div className={styles.blueprintsList}>
                {(b.questionTypes || []).map((qt: any, i: number) => (
                  <div key={i} className={styles.blueprintItem}>
                    <span>{qt.type || 'Standard Question'}</span>
                    <span>{qt.numberOfQuestions || 0} Qs x {qt.marksPerQuestion || 0} Marks</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (activeTab === 'materials') {
      return (
        <div className={styles.grid}>
          {data.map((m: any) => (
            <div key={m._id} className={styles.card}>
              <h3>{m.name}</h3>
              <div className={styles.cardMeta}>
                <span>{m.subject} • {m.className}</span>
              </div>
              <div className={styles.fileBox}>
                📄 {m.originalFileName}
              </div>
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <>
      <Header title="My Library" />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>My Library</h1>
          <p>Your personal repository of saved questions, assignment blueprints, and source materials.</p>
        </div>

        <div className={styles.tabs}>
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`${styles.tabBtn} ${activeTab === tab.id ? styles.activeTab : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon className={styles.tabIcon} />
                {tab.name}
              </button>
            );
          })}
        </div>

        <div className={styles.content}>
          {renderContent()}
        </div>
      </div>
    </>
  );
}
