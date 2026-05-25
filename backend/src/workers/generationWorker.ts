import { Worker, Job } from 'bullmq';
import { config } from '../config';
import { Assignment } from '../models/Assignment';
import { generateQuestionPaper } from '../services/aiService';
import { notifyClient } from '../config/websocket';
import { getRedisClient } from '../config/redis';
import { AssignmentInput } from '../types';

const connection = {
  host: config.redis.host,
  port: config.redis.port,
  username: config.redis.username,
  password: config.redis.password,
};

export const generationWorker = new Worker(
  'question-generation',
  async (job: Job) => {
    const { assignmentId, input } = job.data as {
      assignmentId: string;
      input: AssignmentInput;
    };

    console.log(`🔧 Processing job ${job.id} for assignment ${assignmentId}`);

    try {
      // Update status to processing
      await Assignment.findByIdAndUpdate(assignmentId, { status: 'generating' });
      
      // Notify frontend
      notifyClient(assignmentId, {
        type: 'status_update',
        status: 'generating',
        message: 'Generating question paper...',
        progress: 30,
      });

      // Generate the question paper
      const generatedPaper = await generateQuestionPaper(input);

      // Update progress
      notifyClient(assignmentId, {
        type: 'status_update',
        status: 'generating',
        message: 'Finalizing question paper...',
        progress: 80,
      });

      // Store the result in MongoDB
      await Assignment.findByIdAndUpdate(assignmentId, {
        status: 'completed',
        generatedPaper,
      });

      // Cache the result in Redis
      try {
        const redis = getRedisClient();
        await redis.setEx(
          `assignment:${assignmentId}`,
          3600, // 1 hour TTL
          JSON.stringify(generatedPaper)
        );
      } catch (cacheError) {
        console.warn('Redis caching failed:', cacheError);
      }

      // Notify frontend of completion
      notifyClient(assignmentId, {
        type: 'generation_complete',
        status: 'completed',
        message: 'Question paper generated successfully!',
        progress: 100,
        paper: generatedPaper,
      });

      console.log(`✅ Job ${job.id} completed for assignment ${assignmentId}`);
      return { success: true, assignmentId };
    } catch (error: any) {
      console.error(`❌ Job ${job.id} failed:`, error.message);

      await Assignment.findByIdAndUpdate(assignmentId, {
        status: 'failed',
      });

      notifyClient(assignmentId, {
        type: 'generation_failed',
        status: 'failed',
        message: `Generation failed: ${error.message}`,
        progress: 0,
      });

      throw error;
    }
  },
  {
    connection,
    concurrency: 2,
  }
);

generationWorker.on('completed', (job) => {
  console.log(`✅ Worker: Job ${job.id} completed`);
});

generationWorker.on('failed', (job, err) => {
  console.error(`❌ Worker: Job ${job?.id} failed:`, err.message);
});

console.log('✅ Generation worker started');
