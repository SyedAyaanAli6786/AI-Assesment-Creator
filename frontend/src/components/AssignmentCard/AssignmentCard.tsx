'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HiOutlineEllipsisVertical, HiOutlineEye, HiOutlineTrash, HiOutlinePencil } from 'react-icons/hi2';
import { Assignment } from '../../lib/types';
import { useStore } from '../../store/useStore';
import styles from './AssignmentCard.module.css';

interface AssignmentCardProps {
  assignment: Assignment;
  index: number;
}

export default function AssignmentCard({ assignment, index }: AssignmentCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(assignment.title);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const deleteAssignment = useStore((s) => s.deleteAssignment);
  const renameAssignment = useStore((s) => s.renameAssignment);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).replace(/\//g, '-');
  };

  const handleView = () => {
    setShowMenu(false);
    router.push(`/assignments/${assignment._id}`);
  };

  const handleDelete = async () => {
    setShowMenu(false);
    await deleteAssignment(assignment._id);
  };

  const handleRename = () => {
    setShowMenu(false);
    setIsEditing(true);
    setEditTitle(assignment.title);
  };

  const handleSaveRename = async () => {
    if (editTitle.trim() !== '' && editTitle.trim() !== assignment.title) {
      await renameAssignment(assignment._id, editTitle.trim());
    }
    setIsEditing(false);
  };

  return (
    <div 
      className={`${styles.card} ${showMenu ? styles.cardMenuOpen : ''}`} 
      style={{ animationDelay: `${index * 0.05}s` }}
      onClick={handleView}
    >
      <div className={styles.cardHeader}>
        <div className={styles.titleArea}>
          {isEditing ? (
            <input 
              className={styles.editInput}
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleSaveRename}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveRename();
                if (e.key === 'Escape') {
                  setIsEditing(false);
                  setEditTitle(assignment.title);
                }
              }}
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <h3 className={styles.cardTitle}>{assignment.title}</h3>
          )}
          {assignment.status === 'generating' && (
            <span className={styles.statusBadge}>
              <span className={styles.spinner}></span>
              Generating...
            </span>
          )}
        </div>
        <div className={styles.menuWrapper} ref={menuRef}>
          <button 
            className={styles.menuBtn} 
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
          >
            <HiOutlineEllipsisVertical />
          </button>
          {showMenu && (
            <div className={styles.dropdown}>
              <button className={styles.dropdownItem} onClick={(e) => { e.stopPropagation(); handleView(); }}>
                <HiOutlineEye />
                View Assignment
              </button>
              <button className={styles.dropdownItem} onClick={(e) => { e.stopPropagation(); handleRename(); }}>
                <HiOutlinePencil />
                Rename
              </button>
              <button className={`${styles.dropdownItem} ${styles.deleteItem}`} onClick={(e) => { e.stopPropagation(); handleDelete(); }}>
                <HiOutlineTrash />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className={styles.cardFooter}>
        <span className={styles.cardDate}>
          Assigned on : {formatDate(assignment.createdAt)}
        </span>
        <span className={styles.cardDate}>
          Due : {formatDate(assignment.dueDate)}
        </span>
      </div>
    </div>
  );
}
