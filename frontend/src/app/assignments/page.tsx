'use client';

import React, { useEffect, useState, useRef } from 'react';
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
  
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [classFilter, setClassFilter] = useState('all');
  const filterRef = useRef<HTMLDivElement>(null);

  // Close filters when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilters(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const uniqueClasses = Array.from(new Set(assignments.map(a => a.className))).sort();

  const filteredAssignments = assignments.filter((assignment) => {
    const matchesStatus = statusFilter === 'all' || assignment.status === statusFilter;
    const matchesClass = classFilter === 'all' || assignment.className === classFilter;
    return matchesStatus && matchesClass;
  });

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
            <div className={styles.filterWrapper} ref={filterRef}>
              <button 
                className={`${styles.filterBtn} ${showFilters ? styles.activeFilter : ''}`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <HiOutlineFunnel />
                Filter By
                {(statusFilter !== 'all' || classFilter !== 'all') && (
                  <span className={styles.filterBadge}>
                    {(statusFilter !== 'all' ? 1 : 0) + (classFilter !== 'all' ? 1 : 0)}
                  </span>
                )}
              </button>

              {showFilters && (
                <div className={styles.filterDropdown}>
                  <div className={styles.filterGroup}>
                    <label className={styles.filterGroupLabel}>Status</label>
                    <select 
                      className={styles.filterSelect}
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="all">All Statuses</option>
                      <option value="completed">Completed</option>
                      <option value="generating">Generating</option>
                      <option value="draft">Draft</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>
                  
                  {uniqueClasses.length > 0 && (
                    <div className={styles.filterGroup}>
                      <label className={styles.filterGroupLabel}>Class</label>
                      <select 
                        className={styles.filterSelect}
                        value={classFilter}
                        onChange={(e) => setClassFilter(e.target.value)}
                      >
                        <option value="all">All Classes</option>
                        {uniqueClasses.map(cls => (
                          <option key={cls} value={cls}>{cls}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  
                  {(statusFilter !== 'all' || classFilter !== 'all') && (
                    <button 
                      className={styles.clearFilterBtn}
                      onClick={() => {
                        setStatusFilter('all');
                        setClassFilter('all');
                      }}
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              )}
            </div>
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
        ) : filteredAssignments.length === 0 ? (
          <div className={styles.noResults}>
             <p>No assignments match your filters.</p>
             <button 
               className={styles.clearAllBtn}
               onClick={() => { setStatusFilter('all'); setClassFilter('all'); setLocalSearch(''); }}
             >
               Clear Filters & Search
             </button>
          </div>
        ) : (
          <>
            <div className={styles.grid}>
              {filteredAssignments.map((assignment, index) => (
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
