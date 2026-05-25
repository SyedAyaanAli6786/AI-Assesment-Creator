'use client';

import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import styles from './page.module.css';
import { 
  HiOutlineUserGroup, HiOutlinePlus, HiOutlineUsers,
  HiOutlineEnvelopeOpen, HiOutlineDocumentText, HiOutlineChartBar
} from 'react-icons/hi2';
import { API_BASE } from '../../lib/api';

export default function GroupsPage() {
  const [groups, setGroups] = useState<any[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<any | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupType, setNewGroupType] = useState('Class');

  const [newStudentName, setNewStudentName] = useState('');
  const [reportResult, setReportResult] = useState('');
  const [generatingReport, setGeneratingReport] = useState(false);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const res = await fetch(`${API_BASE}/groups`);
      const data = await res.json();
      if (data.success) {
        setGroups(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateGroup = async () => {
    if (!newGroupName) return;
    try {
      const res = await fetch(`${API_BASE}/groups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newGroupName, type: newGroupType })
      });
      if (res.ok) {
        setNewGroupName('');
        setIsCreating(false);
        fetchGroups();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddStudent = async () => {
    if (!newStudentName || !selectedGroup) return;
    try {
      const res = await fetch(`${API_BASE}/groups/${selectedGroup._id}/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newStudentName })
      });
      const data = await res.json();
      if (data.success) {
        setSelectedGroup(data.data);
        setNewStudentName('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddGrade = async (studentId: string) => {
    const score = prompt('Enter score:');
    const max = prompt('Enter max score:');
    if (!score || !max) return;

    try {
      const res = await fetch(`${API_BASE}/groups/${selectedGroup._id}/grades`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          assignmentName: 'Recent Assignment',
          score: Number(score),
          maxScore: Number(max)
        })
      });
      const data = await res.json();
      if (data.success) {
        setSelectedGroup(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenerateReport = async (student: any) => {
    if (student.grades.length === 0) {
      alert("Add some grades first to generate a report!");
      return;
    }
    setGeneratingReport(true);
    setReportResult('');
    try {
      const res = await fetch(`${API_BASE}/groups/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentData: student })
      });
      const data = await res.json();
      if (data.success) {
        setReportResult(data.data);
      }
    } catch (err) {
      console.error(err);
    }
    setGeneratingReport(false);
  };

  return (
    <>
      <Header title="My Groups" />
      <div className={styles.container}>
        <div className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h2>Groups & Classes</h2>
            <button className={styles.iconBtn} onClick={() => setIsCreating(!isCreating)}>
              <HiOutlinePlus />
            </button>
          </div>

          {isCreating && (
            <div className={styles.createBox}>
              <input 
                type="text" 
                placeholder="Group Name" 
                value={newGroupName}
                onChange={e => setNewGroupName(e.target.value)}
                className={styles.input}
              />
              <select value={newGroupType} onChange={e => setNewGroupType(e.target.value)} className={styles.select}>
                <option value="Class">Class Roster</option>
                <option value="Department">Teacher Department</option>
              </select>
              <button className={styles.btn} onClick={handleCreateGroup}>Create</button>
            </div>
          )}

          <div className={styles.groupList}>
            {groups.map(g => (
              <div 
                key={g._id} 
                className={`${styles.groupItem} ${selectedGroup?._id === g._id ? styles.active : ''}`}
                onClick={() => setSelectedGroup(g)}
              >
                <HiOutlineUserGroup className={styles.groupIcon} />
                <div>
                  <h4>{g.name}</h4>
                  <span>{g.type} • {g.students?.length || 0} Members</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.mainContent}>
          {!selectedGroup ? (
            <div className={styles.emptyState}>
              <HiOutlineUsers className={styles.emptyIcon} />
              <h3>Select a Group</h3>
              <p>Manage your students, grades, and collaborative assignments.</p>
            </div>
          ) : (
            <div className={styles.groupDetail}>
              <div className={styles.detailHeader}>
                <h1>{selectedGroup.name}</h1>
                <span className={styles.badge}>{selectedGroup.type}</span>
              </div>

              {selectedGroup.type === 'Class' && (
                <div className={styles.sections}>
                  <div className={styles.sectionCard}>
                    <div className={styles.sectionTitleRow}>
                      <h3>Student Roster & Grades</h3>
                      <div className={styles.addStudent}>
                        <input 
                          type="text" 
                          placeholder="New student name..." 
                          value={newStudentName}
                          onChange={e => setNewStudentName(e.target.value)}
                          className={styles.smallInput}
                        />
                        <button className={styles.smallBtn} onClick={handleAddStudent}>Add</button>
                      </div>
                    </div>

                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Avg Score</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedGroup.students.map((s: any) => {
                          const avg = s.grades.length 
                            ? Math.round(s.grades.reduce((acc: number, curr: any) => acc + (curr.score / curr.maxScore) * 100, 0) / s.grades.length) 
                            : '-';
                          return (
                            <tr key={s._id}>
                              <td>{s.name}</td>
                              <td>{avg !== '-' ? `${avg}%` : 'No grades'}</td>
                              <td>
                                <div className={styles.actionBtns}>
                                  <button onClick={() => handleAddGrade(s._id)} title="Add Grade"><HiOutlineChartBar /></button>
                                  <button onClick={() => handleGenerateReport(s)} title="Generate AI Parent Report"><HiOutlineEnvelopeOpen /></button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className={styles.sectionCard}>
                    <h3>Targeted Study Groups (Differentiated Learning)</h3>
                    <p className={styles.hint}>Group students by performance to auto-differentiate assignments.</p>
                    <div className={styles.subGroups}>
                      {selectedGroup.subGroups?.length > 0 ? (
                        selectedGroup.subGroups.map((sg: any) => (
                          <div key={sg._id} className={styles.subGroupBadge}>
                            {sg.name} ({sg.studentIds.length})
                          </div>
                        ))
                      ) : (
                        <p className={styles.hint}>No study groups created yet.</p>
                      )}
                      <button className={styles.textBtn}>+ Create Study Group</button>
                    </div>
                  </div>
                </div>
              )}

              {selectedGroup.type === 'Department' && (
                <div className={styles.sectionCard}>
                  <h3>Teacher Collaboration Hub</h3>
                  <p className={styles.hint}>Assignments saved here are accessible by all department members.</p>
                  <div className={styles.sharedList}>
                    {selectedGroup.sharedAssignments?.length === 0 && (
                      <div className={styles.emptyBox}>No shared assignments yet.</div>
                    )}
                  </div>
                  <button className={styles.btn} style={{ marginTop: '16px' }}>
                    <HiOutlineDocumentText /> Share an Assignment
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Modal for Parent Report */}
          {generatingReport && (
            <div className={styles.modalOverlay}>
              <div className={styles.modalBox}>
                <div className={styles.spinner} />
                <p>Generating personalized parent report...</p>
              </div>
            </div>
          )}
          {reportResult && (
            <div className={styles.modalOverlay} onClick={() => setReportResult('')}>
              <div className={styles.reportModal} onClick={e => e.stopPropagation()}>
                <h3>Drafted Parent Email</h3>
                <div className={styles.reportContent}>{reportResult}</div>
                <button className={styles.btn} onClick={() => setReportResult('')}>Close</button>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
