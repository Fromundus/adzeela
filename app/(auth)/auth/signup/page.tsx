import { Metadata } from 'next';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import SignupForm from '@/components/forms/signup-form';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Authentication forms built using the components.'
};

export default function AuthenticationPage() {
  return (
    <div className="relative h-screen flex-col items-center justify-center overflow-hidden md:grid lg:max-w-none lg:grid-cols-3 lg:px-0">
      <Link
        href="/examples/authentication"
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'absolute right-4 top-4 hidden md:right-8 md:top-8'
        )}
      >
        Sign up
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
          <SignupForm />
          <p className="px-8 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/" className=" text-primary hover:font-semibold">
              Log in
            </Link>
          </p>
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
          className="relative mt-[25%] flex h-full justify-center text-2xl"
          style={{ zIndex: '1' }}
        >
          <div style={{ width: '80%' }}>
            <div className="mb-10">
              <div className="relative" style={{ height: '400px' }}>
                <Image
                  src="/media/images/auth/signup-floating.png"
                  alt="Picture of the author"
                  width={500}
                  height={500}
                  className="absolute  right-[-150px]"
                />
              </div>
            </div>
            <div>
              <p className="font-semibold">
                Transform your advertising campaigns{' '}
                <span className="text-[#DF73FF]">
                  from ordinary to extraordinary
                </span>{' '}
                with Adzeela!
              </p>
            </div>
          </div>
        </div>

        {/* <div className="absolute bottom-5 left-[-150px]">
          <Image
            src="/media/images/auth/signup-floating.png"
            alt="Picture of the author"
            width={500}
            height={500}
          />
        </div> */}
      </div>
    </div>
  );
}
