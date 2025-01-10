"use client"
import { useState, useEffect } from 'react';
import axios from 'axios';

const MessageBoard = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Fetch messages from the server
    const fetchMessages = async () => {
      try {
        const response = await axios.get('/api/get-replies'); // Update with your actual API route
        setMessages(response.data.messages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, []);

  return (
    <div className="p-6 space-y-6 pt-[20vh] max-w-screen-lg mx-auto">
      {messages.length > 0 ? (
        messages.map((message, index) => (
          <div
            key={index}
            className="relative bg-white text-black border border-gray-200 rounded-xl p-6 max-w-full shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            {/* Anonymous Message Content */}
            <div className="relative flex flex-col space-y-3 z-10">
              <p className="text-2xl font-bold">Anonymous Message</p>
              <p className="text-lg font-medium bg-gray-100 p-3 rounded-lg">{message.content}</p>
            </div>

            {/* Replies Section */}
            <div className="mt-6 space-y-4">
              {message.reply.length > 0 ? (
                <div className="p-4 bg-gray-200 text-black rounded-lg shadow-md hover:bg-gray-300 transition-colors duration-300">
                  <p className="text-md">{message.reply}</p>
                  <div className="mt-2 text-sm text-gray-600 italic">— User Reply</div>
                </div>
              ) : (
                <p className="text-sm text-gray-400">No reply yet.</p>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center text-gray-500">No messages available.</div>
      )}
    </div>
  );
};

export default MessageBoard;
