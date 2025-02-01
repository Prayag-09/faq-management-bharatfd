import { createClient } from 'redis';

const redisClient = createClient({
	url: process.env.REDIS_URL,
});

redisClient.on('error', (err) => {
	console.error('Redis Client Error:', err);
});

const connectRedis = async () => {
	try {
		await redisClient.connect();
		console.log('Redis connected successfully');
	} catch (error) {
		console.error('Redis connection error:', error);
		process.exit(1);
	}
};
connectRedis();

export default redisClient;
