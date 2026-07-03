import { createClient, RedisClientType } from 'redis';
import { config } from './index';

let redisClient: RedisClientType | undefined;

let connectionPromise: Promise<RedisClientType> | null = null;

export const connectRedis = async (): Promise<RedisClientType> => {
  // If the client exists and is already connected, simply return it.
  if (redisClient && redisClient.isOpen) {
    return redisClient;
  }

  // If a connection attempt is already in progress, wait for it.
  if (connectionPromise) {
    return connectionPromise;
  }

  connectionPromise = (async () => {
    // Create the client only once
    if (!redisClient) {
      redisClient = createClient({
        username: config.redis.username,
        password: config.redis.password,
        socket: {
          host: config.redis.host,
          port: config.redis.port,
          tls: config.redis.host !== 'localhost',
        },
      });

      // Register event listeners only once
      redisClient.on('error', (err) => {
        console.error('❌ Redis error:', err);
      });

      redisClient.on('connect', () => {
        console.log('✅ Redis connected successfully');
      });

      redisClient.on('ready', () => {
        console.log('✅ Redis is ready');
      });

      redisClient.on('reconnecting', () => {
        console.log('🔄 Redis reconnecting...');
      });

      redisClient.on('end', () => {
        console.log('🔌 Redis connection closed');
      });
    }

    if (!redisClient.isOpen) {
      await redisClient.connect();
    }

    return redisClient;
  })();

  try {
    await connectionPromise;
  } catch (err) {
    redisClient = undefined;
    throw err;
  } finally {
    // Clear the promise so future calls check isOpen again
    connectionPromise = null;
  }

  return redisClient;
};

export const getRedisClient = (): RedisClientType => {
  if (!redisClient) {
    throw new Error('Redis client not initialized');
  }
  return redisClient;
};
