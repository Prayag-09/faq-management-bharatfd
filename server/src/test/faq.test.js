import request from 'supertest';
import server from '../server.js';
import FAQ from '../models/Faq.js';
import redisClient from '../services/redis.js';
import mongoose from 'mongoose';
import { expect } from 'chai';

describe('FAQ API Tests', () => {
	before(async () => {
		await FAQ.deleteMany({});
	});

	afterEach(async () => {
		await FAQ.deleteMany({});
		await redisClient.flushAll();
	});

	after(async () => {
		await mongoose.connection.close();
		await redisClient.quit();
	});

	describe('POST /api/faqs', () => {
		it('should create a new FAQ with translations', async () => {
			const res = await request(server).post('/api/faqs').send({
				question: 'What is Jest?',
				answer: 'Jest is a JavaScript testing framework.',
			});

			expect(res.status).to.equal(201);
			expect(res.body).to.have.property('message', 'FAQ created');
			expect(res.body.data).to.have.property('question', 'What is Jest?');
			expect(res.body.data.translations).to.be.an('object');
		});

		it('should return 400 when question is missing', async () => {
			const res = await request(server).post('/api/faqs').send({
				answer: 'Jest is a JavaScript testing framework.',
			});

			expect(res.status).to.equal(400);
			expect(res.body).to.have.property(
				'error',
				'Question and answer are required'
			);
		});

		it('should return 400 when answer is missing', async () => {
			const res = await request(server).post('/api/faqs').send({
				question: 'What is Jest?',
			});

			expect(res.status).to.equal(400);
			expect(res.body).to.have.property(
				'error',
				'Question and answer are required'
			);
		});

		it('should return 400 when question and answer are empty strings', async () => {
			const res = await request(server).post('/api/faqs').send({
				question: '',
				answer: '',
			});

			expect(res.status).to.equal(400);
			expect(res.body).to.have.property(
				'error',
				'Question and answer are required'
			);
		});
	});

	describe('GET /api/faqs', () => {
		it('should return FAQs in default language (en)', async () => {
			await new FAQ({
				question: 'What is Jest?',
				answer: 'Jest is a JavaScript testing framework.',
				translations: {
					question: { hi: 'जेस्ट क्या है?' },
					answer: { hi: 'जेस्ट एक जावास्क्रिप्ट परीक्षण ढांचा है।' },
				},
			}).save();

			const res = await request(server).get('/api/faqs');

			expect(res.status).to.equal(200);
			expect(res.body).to.be.an('array').that.is.not.empty;
			expect(res.body[0]).to.have.property('question', 'What is Jest?');
		});

		it('should return FAQs in specified language (hi)', async () => {
			await new FAQ({
				question: 'What is Jest?',
				answer: 'Jest is a JavaScript testing framework.',
				translations: {
					question: { hi: 'जेस्ट क्या है?' },
					answer: { hi: 'जेस्ट एक जावास्क्रिप्ट परीक्षण ढांचा है।' },
				},
			}).save();

			const res = await request(server).get('/api/faqs?lang=hi');

			expect(res.status).to.equal(200);
			expect(res.body[0]).to.have.property('question', 'जेस्ट क्या है?');
		});

		it('should return 400 for invalid language code', async () => {
			const res = await request(server).get('/api/faqs?lang=xyz');

			expect(res.status).to.equal(400);
			expect(res.body).to.have.property('error', 'Invalid language code');
		});

		it('should return cached results on subsequent requests', async () => {
			await new FAQ({
				question: 'What is Jest?',
				answer: 'Jest is a JavaScript testing framework.',
				translations: {
					question: { hi: 'जेस्ट क्या है?' },
					answer: { hi: 'जेस्ट एक जावास्क्रिप्ट परीक्षण ढांचा है।' },
				},
			}).save();

			await request(server).get('/api/faqs?lang=hi');
			const res = await request(server).get('/api/faqs?lang=hi');

			expect(res.status).to.equal(200);
			expect(res.body[0]).to.have.property('question', 'जेस्ट क्या है?');
		});

		it('should return an empty array if no FAQs exist', async () => {
			const res = await request(server).get('/api/faqs');

			expect(res.status).to.equal(200);
			expect(res.body).to.be.an('array').that.is.empty;
		});
	});
});
