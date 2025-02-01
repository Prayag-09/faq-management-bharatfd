import translate from 'translate';
import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

translate.engine = 'google';
translate.key = process.env.TRANSLATE_API_KEY;

if (!process.env.TRANSLATE_API_KEY) {
	process.exit(1);
}

const redisClient = createClient({
	username: process.env.REDIS_USERNAME,
	password: process.env.REDIS_PASSWORD,
	socket: {
		host: process.env.REDIS_HOST,
		port: process.env.REDIS_PORT,
	},
});

redisClient.on('error', (err) => console.error('Redis Client Error:', err));

const connectRedis = async () => {
	try {
		await redisClient.connect();
	} catch (error) {
		console.error('Redis connection error:', error);
		process.exit(1);
	}
};

connectRedis();

const translateText = async (
	text,
	targetLanguage,
	retries = 3,
	delay = 500
) => {
	if (
		!text ||
		typeof text !== 'string' ||
		!targetLanguage ||
		typeof targetLanguage !== 'string'
	) {
		return text;
	}

	const cacheKey = `translation:${text}:${targetLanguage}`;

	try {
		const cachedTranslation = await redisClient.get(cacheKey);
		if (cachedTranslation) {
			return cachedTranslation;
		}

		const translation = await translate(text, targetLanguage);
		await redisClient.set(cacheKey, translation, { EX: 3600 });

		return translation;
	} catch (error) {
		if (retries > 0) {
			console.error(`Error translating text: ${error.message}. Retrying...`);
			await new Promise((resolve) => setTimeout(resolve, delay));
			return translateText(text, targetLanguage, retries - 1, delay);
		} else {
			console.error('Max retries reached. Returning original text.');
			return text;
		}
	}
};

const handleShutdown = async () => {
	try {
		await redisClient.quit();
	} catch (err) {
		console.error('Error during Redis shutdown:', err);
	}
	process.exit();
};

process.on('SIGINT', handleShutdown);
process.on('SIGTERM', handleShutdown);

export default translateText;
