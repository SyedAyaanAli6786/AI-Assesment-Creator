import express from 'express';
import cors from 'cors';
import http from 'http';
import { config } from './config';
import { connectDB } from './config/database';
import { connectRedis } from './config/redis';
import { initWebSocket } from './config/websocket';
import assignmentRoutes from './routes/assignmentRoutes';
import toolkitRoutes from './routes/toolkitRoutes';

// Import worker to start it
import './workers/generationWorker';

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/assignments', assignmentRoutes);
app.use('/api/toolkit', toolkitRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Initialize connections and start server
async function startServer() {
  try {
    // Connect to MongoDB
    await connectDB();

    // Connect to Redis
    await connectRedis();

    // Initialize WebSocket
    initWebSocket(server);

    // Start server
    server.listen(config.port, () => {
      console.log(`🚀 Server running on http://localhost:${config.port}`);
      console.log(`🔌 WebSocket available at ws://localhost:${config.port}/ws`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
