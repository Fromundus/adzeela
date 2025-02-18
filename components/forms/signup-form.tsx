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
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import GoogleSignInButton from '../github-auth-button';
import { Icons } from '../icons';
import { register } from '@/app/api/authApi';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

const formSchema = z.object({
  name: z.string().nonempty('Name is required'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .regex(/[a-z]/, {
      message: 'Password must contain at least one lowercase letter'
    })
    .regex(/[A-Z]/, {
      message: 'Password must contain at least one uppercase letter'
    })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' }),
  confirmPassword: z.string().nonempty('Confirm Password is required'),
  email: z.string().email({ message: 'Enter a valid email address' }),
  username: z.string().nonempty('Username is required'),
  usertype: z.string().nonempty('User Type is required'),
});

type UserFormValue = z.infer<typeof formSchema>;

export default function UserAuthForm() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const [loading, setLoading] = useState(false);
  const [redirectDialog, setRedirectDialog] = useState(false);
  const [error, setError] = useState('');
  const defaultValues = {
    name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    usertype: 'promoter'
  };
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues
  });
  const deviceRegistration = async () => {
    let deviceId = localStorage.getItem('device_id');
    if (!deviceId) {
     deviceId = crypto.randomUUID();
    localStorage.setItem('device_id', deviceId);
    }
    console.log('Device ID:', deviceId);

  };
  const onSubmit = async (data: UserFormValue) => {
    // setRedirectDialog(true);
    // console.log('test');
    setLoading(true);
    try {
      const response = await register(data);

      if (response.status === 201) {
        deviceRegistration();
        setRedirectDialog(true);
      } else {
        setError(response.data.message);
      }
    } catch (err: any) {
      setError(err.message);
    }

    setLoading(false);
  };

  const redirect = () => {
    router.push('/');
  };

  return (
    <>
      {error && (
        <Alert variant="destructive">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Dialog open={redirectDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogDescription>
              {/* Anyone who has this link will be able to view this. */}
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center space-x-2">
            Account created successfully
          </div>
          <DialogFooter className="sm:justify-center">
            <DialogClose asChild>
              <Button type="button" onClick={redirect}>
                Login
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    // placeholder="Enter your Username..."
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    // placeholder="Enter your Username..."
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
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    // placeholder="Enter your Username..."
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
                  <Input type="password" disabled={loading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" disabled={loading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

        <FormField
          control={form.control}
          name="usertype"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sign up as</FormLabel>
              <FormControl>
                <div>
                  <label style={{ marginRight: '10px' }}> {/* Adds spacing between label and input */}
                    <input
                      type="radio"
                      {...field}
                      value="promoter"
                      checked={field.value === 'promoter'}
                    /> <span style={{ marginLeft: '2px' }}></span>
                    Promoter
                  </label>
                  <label style={{ marginRight: '10px' }}> {/* Adds spacing between label and input */}
                    <input
                      type="radio"
                      {...field}
                      value="advertiser"
                      checked={field.value === 'advertiser'}
                    /> <span style={{ marginLeft: '2px' }}></span>
                    Advertiser
                  </label>
                </div>
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
              Sign Up
            </Button>

            <Button
              className="w-full"
              variant="outline"
              type="button"
              onClick={() =>
                // signIn('github', { callbackUrl: callbackUrl ?? '/dashboard' })
                console.log('Google Sign in clicked')
              }
            >
              <Icons.google className="mr-2 h-4 w-4" />
              Sign up with Google
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
