'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { HiOutlineFunnel, HiOutlineMagnifyingGlass, HiOutlinePlus } from 'react-icons/hi2';
import { useStore } from '../../store/useStore';
import { useWebSocket } from '../../lib/useWebSocket';
import Header from '../../components/Header/Header';
import EmptyState from '../../components/EmptyState/EmptyState';
import AssignmentCard from '../../components/AssignmentCard/AssignmentCard';
import styles from './page.module.css';

export default function AssignmentsPage() {
  const router = useRouter();
  const { assignments, isLoading, fetchAssignments, searchQuery, setSearchQuery } = useStore();
  const [localSearch, setLocalSearch] = useState('');

  // Initialize WebSocket
  useWebSocket();

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(localSearch);
      fetchAssignments(localSearch || undefined);
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearch, setSearchQuery, fetchAssignments]);

  return (
    <>
      <Header title="Assignment" showBack />
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <div className={styles.headerLeft} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Image src="/green-dot.png" alt="Green Dot" width={36} height={36} unoptimized />
            <div>
              <h1 className={styles.title} style={{ margin: 0, marginBottom: '2px' }}>Assignments</h1>
              <p className={styles.desc} style={{ margin: 0 }}>Manage and create assignments for your classes.</p>
            </div>
          </div>
        </div>

        {assignments.length > 0 && (
          <div className={styles.toolbar}>
            <button className={styles.filterBtn}>
              <HiOutlineFunnel />
              Filter By
            </button>
            <div className={styles.searchWrapper}>
              <HiOutlineMagnifyingGlass className={styles.searchIcon} />
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search Assignment"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
              />
            </div>
          </div>
        )}

        {isLoading && assignments.length === 0 ? (
          <div className={styles.loading}>
            <div className={styles.loadingSpinner} />
            <p>Loading assignments...</p>
          </div>
        ) : assignments.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className={styles.grid}>
              {assignments.map((assignment, index) => (
                <AssignmentCard
                  key={assignment._id}
                  assignment={assignment}
                  index={index}
                />
              ))}
            </div>
            <div className={styles.createFloating}>
              <button
                className={styles.createFloatingBtn}
                onClick={() => router.push('/assignments/create')}
              >
                <HiOutlinePlus />
                Create Assignment
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
