import { useEffect, useRef, useState } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import supportedLanguages from '../config/lang'; // Import language options

const AdminPanel = () => {
	const quillRef = useRef(null); // Prevent duplicate Quill instances
	const editorContainerRef = useRef(null); // Reference for editor div
	const [faqs, setFaqs] = useState([]);
	const [question, setQuestion] = useState('');
	const [selectedLanguage, setSelectedLanguage] = useState('en');
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState(null);

	useEffect(() => {
		// Initialize Quill only once
		if (!quillRef.current && editorContainerRef.current) {
			quillRef.current = new Quill(editorContainerRef.current, {
				theme: 'snow',
				modules: {
					toolbar: [
						['bold', 'italic', 'underline'],
						[{ list: 'ordered' }, { list: 'bullet' }],
						['link'],
						['clean'],
					],
				},
			});
		}

		fetchFAQs(selectedLanguage);
	}, [selectedLanguage]);

	const fetchFAQs = async (language = 'en') => {
		try {
			const response = await fetch(
				`http://localhost:3000/api/faqs?lang=${language}`
			);
			const data = await response.json();
			setFaqs(data);
		} catch (error) {
			console.error('Error fetching FAQs:', error);
		}
	};

	const submitFAQ = async () => {
		if (!question.trim() || !quillRef.current?.getText().trim()) {
			setMessage({
				text: 'Please enter both Question and Answer.',
				type: 'error',
			});
			return;
		}

		setLoading(true);
		try {
			const response = await fetch('http://localhost:3000/api/faqs', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					question,
					answer: quillRef.current.root.innerHTML.trim(),
					lang: selectedLanguage,
				}),
			});

			if (response.ok) {
				setMessage({ text: 'FAQ added successfully!', type: 'success' });
				setQuestion('');
				quillRef.current.setText('');
				fetchFAQs(selectedLanguage);
			} else {
				const data = await response.json();
				setMessage({
					text: `Error: ${data.message || 'Failed to add FAQ'}`,
					type: 'error',
				});
			}
		} catch {
			setMessage({ text: 'Failed to connect to the server.', type: 'error' });
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md'>
			<h1 className='text-2xl font-bold text-center mb-4'>
				Admin Panel - FAQ Management
			</h1>

			{/* Language Selector */}
			<div className='mb-4 flex justify-between items-center'>
				<label className='font-semibold'>Select Language:</label>
				<select
					value={selectedLanguage}
					onChange={(e) => setSelectedLanguage(e.target.value)}
					className='px-3 py-2 border rounded-md bg-gray-100'>
					{supportedLanguages.map((lang) => (
						<option key={lang} value={lang}>
							{lang.toUpperCase()}
						</option>
					))}
				</select>
			</div>

			{/* FAQ Input */}
			<div className='mb-4'>
				<label className='block font-semibold mb-2'>Question:</label>
				<input
					type='text'
					value={question}
					onChange={(e) => setQuestion(e.target.value)}
					placeholder='Enter Question'
					className='w-full px-3 py-2 border rounded-md'
				/>
			</div>
			<div className='mb-4'>
				<label className='block font-semibold mb-2'>Answer:</label>
				<div ref={editorContainerRef} className='border rounded-md'></div>
			</div>
			<button
				onClick={submitFAQ}
				disabled={loading}
				className={`w-full py-2 text-white rounded-md flex items-center justify-center transition ${
					loading ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'
				}`}>
				{loading ? (
					<div className='flex items-center'>
						<span className='animate-spin h-5 w-5 border-4 border-white border-t-transparent rounded-full'></span>
						<span className='ml-2'>Submitting...</span>
					</div>
				) : (
					'Add FAQ'
				)}
			</button>

			{/* Message Display */}
			{message && (
				<div
					className={`mt-4 p-3 text-center rounded-md ${
						message.type === 'success'
							? 'bg-green-200 text-green-800'
							: 'bg-red-200 text-red-800'
					}`}>
					{message.text}
				</div>
			)}

			{/* FAQs Table */}
			<div className='overflow-x-auto mt-6'>
				<table className='w-full border-collapse border border-gray-200'>
					<thead>
						<tr className='bg-gray-100'>
							<th className='border p-2 text-left'>Question</th>
							<th className='border p-2 text-left'>Answer</th>
						</tr>
					</thead>
					<tbody>
						{faqs.length === 0 ? (
							<tr>
								<td colSpan={2} className='border p-3 text-center'>
									No FAQs available in {selectedLanguage.toUpperCase()}
								</td>
							</tr>
						) : (
							faqs.map((faq) => (
								<tr key={faq._id} className='hover:bg-gray-50'>
									<td className='border p-2'>{faq.question}</td>
									<td
										className='border p-2'
										dangerouslySetInnerHTML={{ __html: faq.answer }}
									/>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default AdminPanel;
