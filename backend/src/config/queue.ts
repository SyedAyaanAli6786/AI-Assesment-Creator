import { Queue } from 'bullmq';
import { config } from '../config';

const connection = {
  host: config.redis.host,
  port: config.redis.port,
  username: config.redis.username,
  password: config.redis.password,
  ...(config.redis.host !== 'localhost' ? { tls: {} } : {})
};

export const generationQueue = new Queue('question-generation', {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: { age: 3600 },
    removeOnFail: { age: 86400 },
  },
});

generationQueue.on('error', (err) => {
  console.error('❌ BullMQ Queue Error:', err.message || err);
});

console.log('✅ BullMQ Queue initialized');
