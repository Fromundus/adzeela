'use client';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn, useSession } from 'next-auth/react';
import { redirect, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import GoogleSignInButton from '../github-auth-button';
import { Icons } from '../icons';

import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { RocketIcon } from 'lucide-react';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { login } from '@/app/api/authApi';
import { getUserNavigations } from '@/constants/data';

const formSchema = z.object({
  // email: z.string().email({ message: 'Enter a valid email address' })
  username: z.string().nonempty('Username is required'),
  password: z.string().nonempty('Password is required')
});

type UserFormValue = z.infer<typeof formSchema>;

export default function UserAuthForm() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const defaultValues = {
    // email: 'demo@gmail.com'
    username: '',
    password: ''
  };
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  useEffect(() => {
    if (session) {
      const userNavigations = getUserNavigations(session);
      const redirectUrl = userNavigations[0].items[0].href;

      router.push(redirectUrl);
    }
    // console.log('session');
    // console.log(session);
  }, [session]);

  const onSubmit = async (data: UserFormValue) => {
    // const user = await login({
    //   username: data.username,
    //   password: data.password
    // });

    // console.log(user.data);
    setLoading(true);
    const response = await signIn('credentials', {
      // email: data.email,
      username: data.username,
      password: data.password,
      callbackUrl: '/',
      redirect: false
    });

    if (response?.error) {
      console.log(response.error);
      setLoading(false);
      setHasError(true);
    }
  };

  const onGoogleSignIn = async () => {
    await signIn('google', {
      callbackUrl: '/my-account',
      redirect: true
    });
  };

  return (
    <>
      {hasError && (
        <Alert variant="destructive">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Invalid credentials. Please try again.
          </AlertDescription>
        </Alert>
      )}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-4"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter your Username..."
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your Password"
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <Button
              disabled={loading}
              className="relative ml-auto w-full text-white"
              type="submit"
            >
              {loading && (
                <span className="absolute left-3">
                  <Icons.spinner className="h-4 w-4 animate-spin" />
                </span>
              )}
              Log in
            </Button>

            <Button
              className="w-full"
              variant="outline"
              type="button"
              onClick={onGoogleSignIn}
            >
              <Icons.google className="mr-2 h-4 w-4" />
              Log in with Google
            </Button>

            {/* <Button
              className="w-full"
              variant="outline"
              type="button"
              onClick={() =>
                // signIn('github', { callbackUrl: callbackUrl ?? '/dashboard' })
                console.log('Google Sign in clicked')
              }
            >
              <Icons.microsoft className="mr-2 h-4 w-4" />
              Log in with Microsoft
            </Button> */}
          </div>
        </form>
      </Form>
      {/* <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div> */}
      {/* <GoogleSignInButton /> */}
    </>
  );
}
