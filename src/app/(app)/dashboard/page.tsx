'use client';
import React, { useEffect, useState } from 'react';
import { Switch } from "@/components/ui/switch";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { toast } from '@/hooks/use-toast';
import MessageCard from '@/components/MessageCard';
import { Message } from '@/model/Users';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useRouter } from 'next/navigation';
import { Loader2, RefreshCcw } from 'lucide-react';

function DashboardPage() {
    const [isAcceptingMessages, setIsAcceptingMessages] = useState(false);
    const [noMessages, setNoMessages] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [fetchMessages, setfetchMessages] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [profileUrl, setProfileUrl] = useState('');
    const [userData, setUserData] = useState<any>(null);

    const form = useForm({
        resolver: zodResolver(acceptMessageSchema),
    });

    const router = useRouter(); // Initialize router

    // Fetch user data when the component mounts
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('/api/dashboard');
                setUserData(response.data.user);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        
        fetchUserData();
    }, []);

    // Set profile URL once userData is available
    useEffect(() => {
        if (userData && userData.username) {
            const url = `${window.location.origin}/u/${userData.username}`;
            setProfileUrl(url);
        }
    }, [userData]);

    const { register } = form;

    // Handle copy to clipboard
    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileUrl);
        toast({
            title: 'Copied to clipboard',
            description: 'Profile URL copied to clipboard',
            duration: 1000,
        });
    };
    
    const handleAcceptMessagesToggle = async (checked: boolean) => {
        setIsAcceptingMessages(checked);
    
        try {
            // Send request to the backend to update the database
            const response = await axios.post('/api/accept-messages', { acceptMessages: checked });
    
            // Check if the update was successful
            if (response.status === 200) {
                toast({
                    title: 'Success',
                    description: `Messages acceptance has been ${checked ? 'enabled' : 'disabled'}`,
                });
            } else {
                // Handle any non-200 responses from the API
                toast({
                    title: 'Error updating settings',
                    description: 'Could not update your message acceptance preference. Please try again later.',
                    variant: 'destructive',
                });
            }
        } catch (error) {
            // Handle any error during the API request
            toast({
                title: 'Error',
                description: 'An error occurred while updating your settings. Please try again later.',
                variant: 'destructive',
            });
            console.error('Error updating message acceptance:', error);
        }
    };
    // Handle message deletion
    function handleDeleteMessage(id: string) {
        axios.delete(`/api/delete-message/${id}`)
            .then((response) => {
                // Check if the response is successful
                if (response.status === 200) {
                    toast({
                        title: 'Message deleted',
                        description: 'The message has been deleted successfully',
                    });
                    
                    // Update the messages state by filtering out the deleted message
                    setMessages((prevMessages) => prevMessages.filter((message) => message._id !== id));
                } else {
                    // Handle non-200 status codes from the API
                    toast({
                        title: 'Error deleting message',
                        description: response.data.message || 'An unknown error occurred. Please try again later.',
                        variant: 'destructive',
                    });
                }
            })
            .catch((error) => {
                // Handle network or other unexpected errors
                console.error('Error deleting message:', error);
                toast({
                    title: 'Error deleting message',
                    description: error.response?.data?.message || 'An error occurred while deleting the message. Please try again later.',
                    variant: 'destructive',
                });
            });
    }
    

    // Fetch messages and message acceptance status
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [acceptMessagesResponse, messagesResponse] = await Promise.all([
                    axios.get('/api/accept-messages'),
                    axios.get('/api/get-messages')
                ]);
                
                setIsAcceptingMessages(acceptMessagesResponse.data.isAcceptingMessages);

                const messagesData = messagesResponse.data;
                if (messagesData.success && messagesData.message === "message found") {
                    setMessages(messagesData.messages || []);
                    setNoMessages(false);
                } else if (messagesData.success && messagesData.message === "No messages found") {
                    setNoMessages(true);
                }
            } catch (error) {
                let errorMessage = 'An error occurred while fetching data.';
                if (axios.isAxiosError(error)) {
                    errorMessage = error.response?.data?.error || errorMessage;
                }

                toast({
                    title: 'Error',
                    description: errorMessage,
                    variant: 'destructive',
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [fetchMessages]);

    
    return (
        <div className="my-8 lg:mx-auto p-6 sm:p-8 bg-white shadow-lg rounded-lg w-full max-w-6xl" style={{ paddingTop: '15vh' }}>
            <h1 className="text-3xl sm:text-4xl font-semibold mb-6 text-gray-800 text-center">
                User Dashboard
            </h1>

            <div className="mb-6">
                <h2 className="text-lg sm:text-xl font-medium text-gray-700 mb-2">Your Unique Profile Link</h2>
                <div className="flex items-center space-x-2">
                    {isLoading ? (
                        <Skeleton width="80%" height="2.5rem" />
                    ) : (
                        <input
                            type="text"
                            value={profileUrl}
                            readOnly
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-black focus:outline-none"
                        />
                    )}
                    <Button onClick={copyToClipboard} className="w-24 sm:w-28 py-2 text-sm sm:text-base">
                        {isLoading ? <Skeleton width="100%" height="2.5rem" /> : 'Copy'}
                    </Button>
                    
                </div>
            </div>
            
            <div className="flex items-center mb-6">
                {isLoading ? (
                    <Skeleton circle width="2rem" height="2rem" />
                ) : (
                    <Switch
                        {...register('acceptMessages')}
                        checked={isAcceptingMessages}
                        onCheckedChange={(checked) => handleAcceptMessagesToggle(checked)}
                    />
                )}
                <span className="ml-3 text-gray-600 text-sm sm:text-base">
                    Accept Messages: {isLoading ? <Skeleton width="6rem" /> : isAcceptingMessages ? 'Enabled' : 'Disabled'}
                </span>
            </div>
            <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          setfetchMessages((val)=> !val);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    [...Array(6)].map((_, i) => (
                        <Skeleton key={i} height="8rem" />
                    ))
                ) : messages.length > 0 ? (
                    messages.map((message) => (
                        <MessageCard key={message._id as string} message={message} onMessageDelete={handleDeleteMessage}  />
                    ))
                ) : (
                    <div className="col-span-full text-center text-gray-500">
                        {noMessages && <p className="text-lg">Share your link to have your messages here </p>}
                    </div>
                )}
            </div>
        </div>
    );
}

export default DashboardPage;
