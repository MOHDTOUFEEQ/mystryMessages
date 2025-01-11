"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "next/navigation";

const MessageBoard = () => {
  const params = useParams(); // Access dynamic route parameter
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    // Fetch messages from the server
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`/api/get-anonymousMessages/${params.username}`); // Update with your actual API route
        setMessages(response.data.messages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    fetchMessages();
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-screen-lg mx-auto">
      {loading ? (
        // Skeleton Loader
        Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse bg-gray-200 border border-gray-300 rounded-xl p-6 shadow-lg"
          >
            <div className="h-6 bg-gray-300 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-gray-300 rounded w-full"></div>
          </div>
        ))
      ) : messages.length > 0 ? (
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
                  <div className="mt-2 text-sm text-gray-600 italic">— {params.username} Reply</div>
                </div>
              ) : (
                <p className="text-sm text-gray-400">No reply yet.</p>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center text-gray-600 italic py-4 bg-gray-100 rounded-lg shadow-sm">
          🚫 No replies yet! The user hasn&apos;t responded to any messages.
        </div>
      )}
    </div>
  );
};

export default MessageBoard;
