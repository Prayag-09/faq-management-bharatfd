import FAQ from '../models/Faq.js';
import translateText from '../utils/translate.js';
import redisClient from '../services/redis.js';
import supportedLanguages from '../utils/lang.js';

export const createFAQ = async (req, res, next) => {
	try {
		const { question, answer } = req.body;

		if (!question || !answer) {
			return res
				.status(400)
				.json({ error: 'Question and answer are required' });
		}

		if (typeof question !== 'string' || typeof answer !== 'string') {
			return res
				.status(400)
				.json({ error: 'Question and answer must be strings' });
		}

		const translations = {
			question: {},
			answer: {},
		};

		for (const lang of supportedLanguages) {
			translations.question[lang] = await translateText(question, lang);
			translations.answer[lang] = await translateText(answer, lang);
		}

		const faq = new FAQ({ question, answer, translations });
		await faq.save();

		const cacheKeys = await redisClient.keys('faqs:*');
		if (cacheKeys.length > 0) {
			await redisClient.del(cacheKeys);
		}

		res.status(201).json({ message: 'FAQ created', data: faq });
	} catch (error) {
		next(error);
	}
};

export const getFAQs = async (req, res, next) => {
	try {
		const { lang = 'en' } = req.query;

		if (!supportedLanguages.includes(lang)) {
			return res.status(400).json({ error: 'Invalid language code' });
		}

		const cacheKey = `faqs:${lang}`;
		const cachedData = await redisClient.get(cacheKey);
		if (cachedData) {
			return res.status(200).json(JSON.parse(cachedData));
		}

		const faqs = await FAQ.find();
		if (faqs.length === 0) {
			return res.status(200).json([]);
		}

		const translatedFAQs = faqs.map((faq) => ({
			_id: faq._id,
			...faq.getTranslatedContent(lang),
		}));

		await redisClient.set(cacheKey, JSON.stringify(translatedFAQs), {
			EX: 3600,
		});

		res.status(200).json(translatedFAQs);
	} catch (error) {
		next(error);
	}
};
