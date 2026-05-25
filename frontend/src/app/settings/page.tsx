'use client';

import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import styles from './page.module.css';
import { HiOutlineMoon, HiOutlineSun, HiOutlineDocumentText, HiOutlineArrowDownTray } from 'react-icons/hi2';
import { useStore } from '../../store/useStore';

export default function SettingsPage() {
  const { assignments, fetchAssignments } = useStore();
  const [theme, setTheme] = useState('light');
  const [fontSize, setFontSize] = useState('medium');

  useEffect(() => {
    fetchAssignments();
    // Load from local storage if any
    const savedTheme = localStorage.getItem('veda_theme') || 'light';
    const savedFontSize = localStorage.getItem('veda_font') || 'medium';
    setTheme(savedTheme);
    setFontSize(savedFontSize);
  }, [fetchAssignments]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('veda_theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const changeFontSize = (size: string) => {
    setFontSize(size);
    localStorage.setItem('veda_font', size);
    document.documentElement.setAttribute('data-font-size', size);
  };

  const exportData = () => {
    const dataStr = JSON.stringify({ assignments }, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `veda_data_export_${new Date().toISOString().split('T')[0]}.json`;
    
    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <>
      <Header title="Settings" />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Settings</h1>
          <p>Customize your workspace and manage your data.</p>
        </div>

        <div className={styles.settingsGrid}>
          {/* Appearance & Theme */}
          <div className={styles.card}>
            <h2>Appearance & Formatting</h2>
            
            <div className={styles.settingRow}>
              <div className={styles.settingInfo}>
                <div className={styles.iconWrapper} style={{ background: '#fef3c7', color: '#d97706' }}>
                  {theme === 'light' ? <HiOutlineSun /> : <HiOutlineMoon />}
                </div>
                <div>
                  <h3>Theme Mode</h3>
                  <p>Switch between light and dark mode</p>
                </div>
              </div>
              <button className={styles.toggleBtn} onClick={toggleTheme}>
                {theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              </button>
            </div>

            <div className={styles.settingRow}>
              <div className={styles.settingInfo}>
                <div className={styles.iconWrapper} style={{ background: '#e0e7ff', color: '#4f46e5' }}>
                  <HiOutlineDocumentText />
                </div>
                <div>
                  <h3>Paper Font Size</h3>
                  <p>Default text size for generated PDFs</p>
                </div>
              </div>
              <div className={styles.btnGroup}>
                <button 
                  className={`${styles.selectBtn} ${fontSize === 'small' ? styles.active : ''}`}
                  onClick={() => changeFontSize('small')}
                >
                  Small
                </button>
                <button 
                  className={`${styles.selectBtn} ${fontSize === 'medium' ? styles.active : ''}`}
                  onClick={() => changeFontSize('medium')}
                >
                  Medium
                </button>
                <button 
                  className={`${styles.selectBtn} ${fontSize === 'large' ? styles.active : ''}`}
                  onClick={() => changeFontSize('large')}
                >
                  Large
                </button>
              </div>
            </div>
          </div>

          {/* Data Export */}
          <div className={styles.card}>
            <h2>Data Management</h2>
            
            <div className={styles.settingRow}>
              <div className={styles.settingInfo}>
                <div className={styles.iconWrapper} style={{ background: '#ecfdf5', color: '#10b981' }}>
                  <HiOutlineArrowDownTray />
                </div>
                <div>
                  <h3>Export Everything</h3>
                  <p>Download all assignments and configurations as JSON</p>
                </div>
              </div>
              <button className={styles.actionBtn} onClick={exportData}>
                Download Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
