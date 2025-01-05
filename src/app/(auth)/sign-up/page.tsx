"use client"
import React, { useEffect, useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useToast } from "@/hooks/use-toast"
import Link from 'next/link'
import axios, { AxiosError } from 'axios'
import { signUpSchema } from '@/schemas/signupSchema'
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { ApiResponse } from '@/types/ApiResponse'

function Page() {
  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const router = useRouter()
  const { toast } = useToast()
  const register = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  })
  useEffect(() => {
    const checkUsername = async () => {
      if (username.length >= 2) {
        try {
          setIsCheckingUsername(true)
          const res = await axios.get(`/api/check-username-unique?username=${username}`)
          console.log(res);
          
          setUsernameMessage(res.data.message)
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? 'alredy username exists'
          );
          // console.log(error)
        } finally {
          setIsCheckingUsername(false)
        }
      }
    }
    checkUsername()
  }, [username])
  
  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    try {
      setIsSubmitting(true)
      const res = await axios.post('/api/sign-up', data)
      console.log(res);
      toast({
        title: "Account created",
        description: "Redirecting to the login page.",
      })
      router.replace(`/sign-in`);

      setIsSubmitting(false);
    } catch (error) {
            console.error('Error during sign-up:', error);

      const axiosError = error as AxiosError<ApiResponse>;

      // Default error message
      const errorMessage = axiosError.response?.data.message;

      toast({
        title: 'Sign Up Failed',
        description: errorMessage,
        variant: 'destructive',
      });

      setIsSubmitting(false);

    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <div style={{paddingTop:'7vh'}} className=" container mx-auto flex min-h-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
          <p className="text-sm text-muted-foreground">
            Enter your details below to create your account
          </p>
        </div>
        {/* <Button
      onClick={() => {
        toast({
          title: "Scheduled: Catch up",
          description: "Friday, February 10, 2023 at 5:57 PM",
        })
      }}
    >
      Show Toast
    </Button> */}
        <Form {...register}>
          <form onSubmit={register.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="username"
              control={register.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <div className="relative">
                    <Input
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setUsername(e.target.value);
                      }}
                      className={usernameMessage === 'Username is unique' ? 'border-green-500' : ''}
                    />
                    {isCheckingUsername && (
                      <Loader2 className="absolute right-3 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
                    )}
                  </div>
                  {!isCheckingUsername && usernameMessage && (
                    <p className={`text-xs ${
                      usernameMessage === 'Username is unique' ? 'text-green-500' : 'text-destructive'
                    }`}>
                      {usernameMessage}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              name="email"
              control={register.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input {...field} type="email" />
                  
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={register.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <Input type="password" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create account'
              )}
            </Button>
          </form>
        </Form>

        <p className="px-8 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/sign-in" className="hover:text-brand underline underline-offset-4">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Page