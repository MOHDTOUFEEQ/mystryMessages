'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { signIn } from 'next-auth/react';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signInSchema } from '@/schemas/signInSchema';
import { useToast } from '@/hooks/use-toast';

export default function SignInForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const { toast } = useToast();
  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    // Disable submit button on form submission
    try {
      const result = await signIn('credentials', {
        identifier: data.identifier,
        password: data.password,
        redirect: false, // Prevent auto-redirect, we'll handle it manually
      });

      if (result?.error) {
        if (result.error === 'CredentialsSignin') {
          toast({
            title: 'Login Failed',
            description: 'Incorrect username or password',
            variant: 'destructive',
            duration: 2000,
          });
        } else {
          toast({
            title: 'Error',
            description: result.error,
            variant: 'destructive',
            duration: 2000,
          });
        }
      } else if (result?.url) {
        toast({
          title: 'Login Successful',
          description: 'Redirecting to your dashboard...',
          duration: 1500,
        });
        router.replace('/dashboard');
      }
    } catch (error) {
      toast({
        title: 'Unexpected Error',
        description: 'Something went wrong, please try again.',
        variant: 'destructive',
      });
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-xl mt-[15vh]">
        <div className="text-center">
          {/* Updated Title and Subtitle */}
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Sign in!
          </h1>
          <p className="text-lg text-gray-600 mb-6">
          Explore anonymous messages 
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-gray-700">Email/Username</FormLabel>
                  <Input
                    {...field}
                    className="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-gray-700">Password</FormLabel>
                  <Input
                    type="password"
                    {...field}
                    className="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
       
        <Button
          className="w-full p-3 bg-black text-white rounded-lg hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-50"
          type="submit"
        >
          Sign In
        </Button>
          </form>
        </Form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Not a member yet?{' '}
            <Link href="/sign-up" className="text-black hover:text-black-800">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}