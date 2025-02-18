import { Metadata } from 'next';
import Link from 'next/link';
import UserAuthForm from '@/components/forms/user-auth-form';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Authentication forms built using the components.'
};

export default function AuthenticationPage() {
  return (
    <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-3 lg:px-0">
      <Link
        href="/examples/authentication"
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'absolute right-4 top-4 hidden md:right-8 md:top-8'
        )}
      >
        Login
      </Link>

      <div className="flex h-full items-center p-4 lg:col-span-2 lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl text-4xl font-semibold tracking-tight text-primary">
              <Image
                src="/media/images/sidebar/adzeela.png"
                alt="Picture of the author"
                width={300}
                height={300}
              />
            </h1>
            {/* <p className="text-sm text-muted-foreground">
              Enter your email below to create your account
            </p> */}
          </div>
          <UserAuthForm />
          <p className="px-8 text-center text-sm text-muted-foreground">
            Don`t have an account?{' '}
            <Link
              href="/auth/signup"
              className=" text-primary hover:font-semibold"
            >
              Sign up
            </Link>
          </p>
          <div className="flex justify-center pt-20">
            <p className="text-center text-xl font-semibold">
              Transform your advertising campaigns{' '}
              <span className="text-primary">
                from ordinary to extraordinary
              </span>{' '}
              with Adzeela!
            </p>
          </div>
        </div>
      </div>
      <div className="relative hidden h-full flex-col bg-[#1F0028]  p-10 text-white  opacity-80 lg:flex dark:border-r">
        <Image
          src="/media/images/auth/side-bg.png"
          alt="Picture of the author"
          // width={500}
          // height={500}
          layout="fill"
          objectFit="cover"
          className="mix-blend-overlay"
        />

        <div
          className="mt-[50%] flex h-full  justify-center  text-2xl"
          style={{ zIndex: '1' }}
        >
          <div style={{ width: '80%' }}>
            <div className="font-semibold">
              Advertising is vital in modern business. As an advertiser, your
              goal is to create captivating campaigns that engage audiences and
              boost sales.
            </div>
          </div>
        </div>

        <div className="absolute bottom-5 left-[-150px]">
          <Image
            src="/media/images/auth/login-floating.svg"
            alt="Picture of the author"
            width={500}
            height={500}
          />
        </div>
        {/* <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-6 w-6"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          Logo
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;This library has saved me countless hours of work and
              helped me deliver stunning designs to my clients faster than ever
              before.&rdquo;
            </p>
            <footer className="text-sm">Sofia Davis</footer>
          </blockquote>
        </div> */}
      </div>
    </div>
  );
}
