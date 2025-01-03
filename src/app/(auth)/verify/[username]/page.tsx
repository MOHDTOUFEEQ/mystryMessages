'use client'
import React from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'
import { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import {  useForm } from 'react-hook-form'
import  { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { verifySchema } from '../../../../schemas/verifySchema'
import { useToast } from '@/hooks/use-toast'
import { FormField, FormItem, FormLabel, FormMessage ,Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
const Page = () => {
  const params = useParams()
  const { toast } = useToast()
  const router = useRouter()
  const  register = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  })
  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
        const username = params.username
        const verifyCode = data.code
        console.log(username, verifyCode)
        const response = await axios.post(`/api/verify-code`, { username, verifyCode })
        console.log(response)
      if (response.status === 200) {
        toast({
          title: 'Verification successful',
          description: 'You can now login',
        })
        router.push('/sign-in')
      }
      else {
        toast({
          title: 'Verification failed',
          description: 'Invalid verification code',
        })
      }
    } catch (error) {
        if (error instanceof AxiosError) {
            toast({
                title: 'Error',
                description: error.response?.data.message,
          })
        }
    }
  } 
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Verify your account
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter the verification code sent to your email
          </p>
        </div>

        <Form {...register}>
          <form onSubmit={register.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="code"
              control={register.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <div className="relative">
                    <Input
                      {...field}
                      placeholder="Enter your verification code"
                      className="pr-10"
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <button
              type="submit"
              className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Verify Account
            </button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default Page