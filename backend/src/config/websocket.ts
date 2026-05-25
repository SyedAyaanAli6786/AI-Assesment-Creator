import WebSocket from 'ws';
import http from 'http';

let wss: WebSocket.Server;
const clients = new Map<string, WebSocket>();

export function initWebSocket(server: http.Server): void {
  wss = new WebSocket.Server({ server, path: '/ws' });

  wss.on('connection', (ws: WebSocket) => {
    const clientId = Math.random().toString(36).substring(2, 15);
    clients.set(clientId, ws);
    console.log(`🔌 WebSocket client connected: ${clientId}`);

    ws.on('message', (message: string) => {
      try {
        const data = JSON.parse(message.toString());
        if (data.type === 'subscribe' && data.assignmentId) {
          // Associate this client with a specific assignment
          (ws as any).assignmentId = data.assignmentId;
        }
      } catch (e) {
        // Ignore malformed messages
      }
    });

    ws.on('close', () => {
      clients.delete(clientId);
      console.log(`🔌 WebSocket client disconnected: ${clientId}`);
    });

    // Send initial connection confirmation
    ws.send(JSON.stringify({ type: 'connected', clientId }));
  });

  console.log('✅ WebSocket server initialized');
}

export function notifyClient(assignmentId: string, data: object): void {
  if (!wss) return;

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      const wsClient = client as any;
      // Send to all connected clients or specific subscribed ones
      if (!wsClient.assignmentId || wsClient.assignmentId === assignmentId) {
        client.send(JSON.stringify({ ...data, assignmentId }));
      }
    }
  });
}

export function broadcastToAll(data: object): void {
  if (!wss) return;

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}
