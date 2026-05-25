'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { HiOutlineDocumentText, HiOutlineLightBulb, HiOutlineBookOpen, HiOutlineUserCircle } from 'react-icons/hi2';
import Header from '../../components/Header/Header';
import styles from './page.module.css';

const tools = [
  { id: 'rubric', name: 'Smart Grading Rubric', icon: HiOutlineDocumentText, desc: 'Generate detailed grading rubrics.' },
  { id: 'real_world', name: 'Real-World Scenarios', icon: HiOutlineLightBulb, desc: 'Connect topics to everyday life.' },
  { id: 'simplifier', name: 'Content Simplifier', icon: HiOutlineBookOpen, desc: 'Rewrite text for different reading levels.' },
  { id: 'report_card', name: 'Report Card Comments', icon: HiOutlineUserCircle, desc: 'Generate professional student comments.' },
];

export default function ToolkitPage() {
  const [activeTool, setActiveTool] = useState(tools[0].id);
  const [inputData, setInputData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');

  const handleGenerate = async () => {
    setLoading(true);
    setResult('');
    try {
      const response = await fetch('http://localhost:5000/api/toolkit/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolType: activeTool, inputData }),
      });
      const data = await response.json();
      if (data.success) {
        setResult(data.data);
      } else {
        alert('Error: ' + data.message);
      }
    } catch (err) {
      alert('Failed to connect to server');
    }
    setLoading(false);
  };

  const renderInputForm = () => {
    switch (activeTool) {
      case 'rubric':
        return (
          <>
            <div className={styles.inputGroup}>
              <label>Assignment Description</label>
              <textarea 
                placeholder="e.g. 7th Grade Essay on Global Warming" 
                rows={3}
                onChange={(e) => setInputData({...inputData, description: e.target.value})}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Maximum Marks</label>
              <input 
                type="number" 
                placeholder="10" 
                onChange={(e) => setInputData({...inputData, maxMarks: e.target.value})}
              />
            </div>
          </>
        );
      case 'real_world':
        return (
          <div className={styles.inputGroup}>
            <label>Topic</label>
            <input 
              type="text" 
              placeholder="e.g. Quadratic Equations" 
              onChange={(e) => setInputData({...inputData, topic: e.target.value})}
            />
          </div>
        );
      case 'simplifier':
        return (
          <div className={styles.inputGroup}>
            <label>Text to Simplify</label>
            <textarea 
              placeholder="Paste complex text here..." 
              rows={6}
              onChange={(e) => setInputData({...inputData, text: e.target.value})}
            />
          </div>
        );
      case 'report_card':
        return (
          <div className={styles.inputGroup}>
            <label>Student Tags / Notes</label>
            <textarea 
              placeholder="e.g. Hardworking, needs help with Math, participates often" 
              rows={3}
              onChange={(e) => setInputData({...inputData, tags: e.target.value})}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Header title="AI Toolkit" />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Teacher's AI Toolkit</h1>
          <p>Supercharge your workflow with these AI-powered utilities.</p>
        </div>

        <div className={styles.layout}>
          <div className={styles.sidebar}>
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <button 
                  key={tool.id} 
                  className={`${styles.toolTab} ${activeTool === tool.id ? styles.activeTab : ''}`}
                  onClick={() => {
                    setActiveTool(tool.id);
                    setInputData({});
                    setResult('');
                  }}
                >
                  <Icon className={styles.toolIcon} />
                  <div className={styles.toolText}>
                    <strong>{tool.name}</strong>
                    <span>{tool.desc}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className={styles.content}>
            <div className={styles.card}>
              <h2>Configure Tool</h2>
              {renderInputForm()}
              <button 
                className={styles.generateBtn} 
                onClick={handleGenerate}
                disabled={loading || Object.keys(inputData).length === 0}
              >
                {loading ? 'Generating...' : 'Generate with AI'}
              </button>
            </div>

            {result && (
              <div className={styles.resultCard}>
                <h2>Result</h2>
                <div className={styles.markdownContent}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{result}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
