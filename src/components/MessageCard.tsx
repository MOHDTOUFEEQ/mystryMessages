'use client';
import React, { useEffect, useState } from 'react';
import { Message } from '@/model/Users';
import axios from 'axios';
import { Toast } from '@radix-ui/react-toast';

function MessageCard({
  message,
  onMessageDelete,
}: {
  message: Message;
  onMessageDelete: (messageId: string) => void;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [replyText, setReplyText] = useState<string>(message.reply || '');
  const [isEditingReply, setIsEditingReply] = useState(false);
  const [status, setIsStatus] = useState<boolean>(message.status || false);

  const handleDeleteClick = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    onMessageDelete(message._id as string);
    setIsModalOpen(false);
  };

  const toggleReplyEdit = () => {
    setIsEditingReply(!isEditingReply);
  };

  const handleReplyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReplyText(e.target.value);
  };
  
  useEffect(() => {
    
    async function saveStatus() {
      try {
        const payload = {
          _id: message._id, // Include the message ID to associate the reply
          status: status,      // Send the updated reply text
        };
        const response = await axios.post("/api/saveStatus", payload);
        if (response.status === 200) {
          console.log("Status saved successfully:", response.data);
        } else {
          console.error("Failed to save status:", response);
        }
      } catch (error) {
        console.error("Error saving status:", error);
        alert("Failed to save status. Please try again.");
      }
    }
  
    // Only call saveStatus when status changes
    if (status !== undefined) {
      saveStatus();
    }
  
  }, [status]);
  
  const handleReplySave = async () => {
    try {
      const payload = {
        _id: message._id, // Include the message ID to associate the reply
        reply: replyText,      // Send the updated reply text
      };
  
      const response = await axios.post("/api/saveReply", payload);
      
      if (response.status === 200) {
        // Assuming the API returns a success message
        console.log("Reply saved successfully:", response.data.message);
      } else {
        console.error("Unexpected response:", response);
      }
    } catch (error) {
      console.error("Error saving reply:", error);
      alert("Failed to save the reply. Please try again.");
    } finally {
      setIsEditingReply(false); // Exit the editing mode regardless of success or failure
    }
  };
  

  return (
    <div className="border rounded-lg shadow-md p-4 bg-white space-y-4">
      {/* Message Content */}
      <div className="flex justify-between items-center">
        <p className="font-semibold text-gray-800">{message.content}</p>
        <button
          onClick={handleDeleteClick}
          className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Reply Section */}
      <div className="flex flex-col space-y-2">
        {replyText.length > 0 && !isEditingReply && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-700 bg-gray-100 px-3 py-2 rounded">
              {replyText}
            </p>
            <button
              onClick={toggleReplyEdit}
              className="text-blue-600 hover:underline text-sm"
            >
              Edit Reply
            </button>
          </div>
        )}

        {isEditingReply && (
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={replyText}
              onChange={handleReplyChange}
              className="border px-3 py-2 rounded text-gray-700 w-full focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Edit your reply..."
            />
            <button
              onClick={handleReplySave}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Save
            </button>
            <button
              onClick={toggleReplyEdit}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        )}

        {replyText.length === 0 && !isEditingReply && (
          <button
            onClick={toggleReplyEdit}
            className="text-blue-600 hover:underline text-sm"
          >
            Add a reply to this message
          </button>
        )}
      </div>
      {replyText.length > 0 ? (
  <div className="flex items-center space-x-2">
    <h1 className="text-sm text-gray-800">
      Switch it on to make your reply public:
    </h1>
    <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
      <input
        type="checkbox"
        id="toggle"
        checked={status}
        onChange={() => setIsStatus(!status)} // Toggle the status on change
        className={`toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-transform duration-200 ease-in-out ${
          status ? 'transform translate-x-4' : ''
        }`}
      />
      <label
        htmlFor="toggle"
        className={`toggle-label block overflow-hidden h-6 mb-1 rounded-full cursor-pointer transition-colors duration-200 ${status ? 'bg-green-500' : 'bg-gray-300'}`}
      ></label>
    </div>
    <span className="text-sm text-gray-800">{status ? 'On' : 'Off'}</span>
  </div>
) : (
  <h1 className="text-gray-500"></h1>
)}




     {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold text-gray-800">
              Are you sure you want to delete this message?
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
              >
                No
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MessageCard;
