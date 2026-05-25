'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useStore } from '../store/useStore';
import { WS_URL } from './api';

export function useWebSocket(assignmentId?: string) {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const setWsConnected = useStore((s) => s.setWsConnected);
  const setGenerationProgress = useStore((s) => s.setGenerationProgress);
  const setGeneratedPaper = useStore((s) => s.setGeneratedPaper);
  const updateAssignmentStatus = useStore((s) => s.updateAssignmentStatus);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    try {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        setWsConnected(true);
        console.log('WebSocket connected');

        // Subscribe to assignment updates if we have an ID
        if (assignmentId) {
          ws.send(JSON.stringify({ type: 'subscribe', assignmentId }));
        }
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          switch (data.type) {
            case 'status_update':
              setGenerationProgress({
                status: data.status,
                message: data.message,
                progress: data.progress || 0,
              });
              if (data.assignmentId) {
                updateAssignmentStatus(data.assignmentId, data.status);
              }
              break;

            case 'generation_complete':
              setGenerationProgress({
                status: 'completed',
                message: data.message,
                progress: 100,
              });
              if (data.assignmentId && data.paper) {
                setGeneratedPaper(data.assignmentId, data.paper);
              }
              break;

            case 'generation_failed':
              setGenerationProgress({
                status: 'failed',
                message: data.message,
                progress: 0,
              });
              if (data.assignmentId) {
                updateAssignmentStatus(data.assignmentId, 'failed');
              }
              break;
          }
        } catch (e) {
          // Ignore malformed messages
        }
      };

      ws.onclose = () => {
        setWsConnected(false);
        // Reconnect after 3 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, 3000);
      };

      ws.onerror = () => {
        ws.close();
      };
    } catch (error) {
      console.error('WebSocket connection error:', error);
    }
  }, [assignmentId, setWsConnected, setGenerationProgress, setGeneratedPaper, updateAssignmentStatus]);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  return wsRef;
}
