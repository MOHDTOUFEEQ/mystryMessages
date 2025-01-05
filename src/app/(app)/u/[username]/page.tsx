'use client';

import { useParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import questions from '../../../../data/question'; // Importing the questions from JSON

function Page() {
    const params = useParams(); // Access dynamic route parameter
    const [message, setMessage] = useState('');
    const [suggestedMessages, setSuggestedMessages] = useState<string[]>([]);
    const [loading, setLoading] = useState(false); // Loading state
    const [loadingQuestions, setLoadingQuestions] = useState(false); // Spinner loading state

    // Function to shuffle questions and select 3 random ones
    const loadRandomQuestions = () => {
        setLoadingQuestions(true);
        const shuffled = [...questions].sort(() => Math.random() - 0.5);
        const selectedQuestions = shuffled.slice(0, 3).map(q => q.question);
        setSuggestedMessages(selectedQuestions);
        setLoadingQuestions(false);
    };

    useEffect(() => {
        loadRandomQuestions(); // Load questions initially when the component mounts
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true); // Set loading to true when submitting

        try {
            // Example API call to send the message
            const response = await fetch(`/api/u/${params.username}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message }),
            });

            const data = await response.json();
            if (data.success) {
                toast({
                    title: 'Message sent',
                    description: 'Your message has been sent successfully!',
                });
            } else {
                toast({
                    title: 'Error sending message',
                    description: data.error,
                    variant: 'destructive',
                });
            }
        } catch (error) {
            console.error('Error sending message:', error);
            toast({
                title: 'Error sending message',
                description: 'An error occurred while sending your message. Please try again later.',
                variant: 'destructive',
            });
        }

        setLoading(false); // Reset loading state
        setMessage(''); // Clear message after submission
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-4 flex justify-between items-center">
                    <span>Send message to {params.username}</span>
                   
                </h1>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
    <h2 className="text-xl font-semibold text-gray-700 mb-4 flex justify-between items-center">
        <span>Your Identity Will Remain Anonymous</span>
        
        {/* Spinner that triggers question refresh on click */}
        {loadingQuestions ? (
            <div className="w-8 h-8 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        ) : (
            <button onClick={loadRandomQuestions} className="cursor-pointer">
                <div>↻</div>
            </button>
        )}
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
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black-500 focus:border-transparent resize-none"
            placeholder="Type your anonymous message here..."
            rows={4}
            required
        />

        <button
            type="submit"
            className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-black transition duration-200"
            disabled={loading} // Disable button when submitting
        >
            {loading ? 'Submitting...' : 'Send Message'}
        </button>
    </form>
</div>


        </div>
    );
}

export default Page;
