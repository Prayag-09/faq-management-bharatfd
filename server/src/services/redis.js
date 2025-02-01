import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const redisClient = createClient({
	username: process.env.REDIS_USERNAME,
	password: process.env.REDIS_PASSWORD,
	socket: {
		host: process.env.REDIS_HOST,
		port: process.env.REDIS_PORT,
	},
});

redisClient.on('error', (err) => {
	console.error('Redis Client Error:', err);
});

const connectToRedis = async () => {
	try {
		await redisClient.connect();
		console.log('Redis connected successfully');
	} catch (error) {
		console.error('Error connecting to Redis:', error);
		process.exit(1);
	}
};

connectToRedis();

export default redisClient;
