import translate from 'translate';
import { createClient } from 'redis';

translate.engine = 'google';
translate.key = process.env.TRANSLATE_API_KEY;

if (!process.env.TRANSLATE_API_KEY) {
	process.exit(1);
}

const redisClient = createClient({
	url: process.env.REDIS_URL,
});

redisClient.on('error', (err) => {
	console.error('Redis Client Error:', err);
});

const connectRedis = async () => {
	try {
		await redisClient.connect();
	} catch (error) {
		console.error('Redis connection error:', error);
		process.exit(1);
	}
};

connectRedis();

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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
			await sleep(delay);
			return translateText(text, targetLanguage, retries - 1, delay);
		}

		return text;
	}
};

const handleShutdown = async () => {
	try {
		if (redisClient.isOpen) {
			await redisClient.quit();
		}
	} catch (err) {
		console.error('Error during Redis shutdown:', err);
	}
	process.exit();
};

process.on('SIGINT', handleShutdown);
process.on('SIGTERM', handleShutdown);

export default translateText;
