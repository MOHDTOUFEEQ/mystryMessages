'use client'
import React from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
  import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Button } from './ui/button'
import { Message } from '@/model/Users'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { toast } from '@/hooks/use-toast'
import { X } from 'lucide-react'
  
function MessageCard({message , onMessageDelete }: {message: Message , onMessageDelete: (messageId: string)=>void}) {
    const handleDeleteConfirm = async () => {
        try {
          onMessageDelete(message._id as string);
    
        } catch (error) {
        //   const axiosError = error as AxiosError<ApiResponse>;
          toast({
            title: 'Error',
            description: 'Failed to delete message',
            variant: 'destructive',
          });
        } 
      };
    return (
<>
<Card className="card-bordered">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle >{message.content}</CardTitle>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant='destructive'>
                <X className="w-5 h-5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  this message.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteConfirm}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <div className="text-sm">
        </div>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
      </>
  )
}

export default MessageCard  