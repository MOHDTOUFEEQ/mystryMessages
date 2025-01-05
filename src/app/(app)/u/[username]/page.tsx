'use client';

import { useParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';

function Page() {
    const params = useParams(); // Access dynamic route parameter
    const [message, setMessage] = useState('');
    const [suggestedMessages, setSuggestedMessages] = useState<string[]>([]);

    // Generate random questions on component mount
    useEffect(() => {
        const questions = [
            'What’s your favorite memory?',
            'If you could change one thing, what would it be?',
            'What inspires you the most?',
        ]; // Replace with imported questions if needed
        const shuffled = [...questions].sort(() => Math.random() - 0.5);
        const temp = shuffled.slice(0, 3);
        setSuggestedMessages(temp);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Example API call to send the message
            const response = await fetch(`/api/u/${params.username}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message }),
            });

            const data = await response.json();
            if (data.success) {
                alert('Message sent successfully!');
            } else {
                alert('Error: ' + data.error);
            }
        } catch (error) {
            console.error('Error sending message:', error);
            alert('An error occurred. Please try again.');
        }

        setMessage(''); // Clear message after submission
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    Send message to {params.username}
                </h1>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">
                    Your Identity Will Remain Anonymous
                </h2>

                <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-600 mb-3">
                        Suggested Messages:
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {suggestedMessages.map((msg, index) => (
                            <button
                                key={index}
                                onClick={() => setMessage(msg)}
                                className="px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-full text-sm text-gray-700 transition-colors duration-200"
                            >
                                {msg}
                            </button>
                        ))}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        placeholder="Type your anonymous message here..."
                        rows={4}
                        required
                    />

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
                    >
                        Send Message
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Page;
