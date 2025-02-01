const errorHandler = (err, req, res, next) => {
	console.error(err.stack);
	if (err.name === 'ValidationError') {
		return res.status(400).json({ message: err.message });
	}
	if (err.name === 'MongoError') {
		return res.status(500).json({ message: 'Database error occurred' });
	}
	res.status(500).json({ message: 'Something went wrong!' });
};

export default errorHandler;
