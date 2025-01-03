'use client';
import React, { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";
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

function DashboardPage() {
    const { data: session } = useSession();
    const [isAcceptingMessages, setIsAcceptingMessages] = useState(false);
    const [noMessages, setNoMessages] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const form = useForm({
        resolver: zodResolver(acceptMessageSchema),
    });

    const { register } = form;
    const profileUrl = `${window.location.origin}/u/${session?.user?.username}`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileUrl);
        toast({
            title: 'Copied to clipboard',
            description: 'Profile URL copied to clipboard',
            duration: 1000,
        });
    };
    function handleDeleteMessage(id : string) {
        axios.delete(`/api/delete-message/${id}`)
        .then((response) => {
            if (response.data.success == "200") {
                toast({
                    title: 'im up',
                    description: 'The message has been deleted successfully',
                });
                setMessages((prevMessages) => prevMessages.filter((message) => message._id !== id));
                toast({
                    title: 'Message deleted',
                    description: 'The message has been deleted successfully',
                });
            } else {
                toast({
                    title: 'Error deleting message',
                    description: response.data.message || 'Please try again later',
                    variant: 'destructive',
                });
            }
        })
        .catch((error) => {
            console.error('Error deleting message:', error);
            toast({
                title: 'Error deleting message',
                description: 'An error occurred while deleting the message. Please try again later.',
                variant: 'destructive',
            });
        });
    }

    
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
                if (messagesData.success) {
                    setMessages(messagesData.messages || []);
                    setNoMessages(false);
                } else {
                    setNoMessages(true);
                }
            }catch (error) {
                let errorMessage = 'An error occurred while fetching data.'; // Default message
            
                // If error is AxiosError, include specific details
                if (axios.isAxiosError(error)) {
                    errorMessage = error.response?.data?.error || errorMessage; // Use error response or fallback
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

        if (session) fetchData();
    }, [session]);

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
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                        onCheckedChange={(checked) => {
                            setIsAcceptingMessages(checked);
                        }}
                    />
                )}
                <span className="ml-3 text-gray-600 text-sm sm:text-base">
                    Accept Messages: {isLoading ? <Skeleton width="6rem" /> : isAcceptingMessages ? 'Enabled' : 'Disabled'}
                </span>
            </div>

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
                        {noMessages && <p className="text-lg">No messages found</p>}
                    </div>
                )}
            </div>
        </div>
    );
}

export default DashboardPage;
