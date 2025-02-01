import express from 'express';
import cors from 'cors';
import connectDB from './db/connection.js';
import faqRoutes from './routes/faqRoutes.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(errorHandler);

connectDB();

app.use('/api/faqs', faqRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

export default app;
