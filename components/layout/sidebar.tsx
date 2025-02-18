'use client';
import React, { useState } from 'react';
import { DashboardNav } from '@/components/dashboard-nav';
import { nagGroups, getUserNavigations } from '@/constants/data';
import { cn } from '@/lib/utils';
import { ChevronLeft } from 'lucide-react';
import { useSidebar } from '@/hooks/useSidebar';
import { Button } from '../ui/button';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { GradientButton } from '../ui/gradient-button';

type SidebarProps = {
  className?: string;
};

export default function Sidebar({ className }: SidebarProps) {
  const { isMinimized, toggle } = useSidebar();
  const [status, setStatus] = useState(false);

  const { data: session } = useSession();

  const userNavigations = getUserNavigations(session);

  const handleToggle = () => {
    setStatus(true);
    toggle();
    setTimeout(() => setStatus(false), 500);
  };
  return (
    <div className='relative'>
    <nav
      className={cn(
        `no-scrollbar max-h-screen h-[100vh] overflow-y-auto z-30 hidden flex-none border-r bg-white md:block`,
        status && 'duration-500',
        !isMinimized ? 'w-72' : 'w-[72px]',
        className
      )}
    >

      <div className="w-100 flex justify-center pt-6">
        <Image
          src={
            isMinimized
              ? '/media/images/sidebar/adzeela-square.png'
              : '/media/images/sidebar/adzeela.png'
          }
          alt="Adzeela"
          width={isMinimized ? 40 : 230}
          height={isMinimized ? 40 : 100}
          quality={100}
        />
      </div>
      <ChevronLeft
        className={cn(
          'absolute -right-4 top-20 cursor-pointer rounded-full border bg-background text-3xl text-foreground',
          isMinimized && 'rotate-180'
        )}
        onClick={handleToggle}
      />
      <div className="space-y-4 py-4 pt-10">
        <div className="px-3 py-2">
          <div className="mt-1 space-y-1">
            <DashboardNav navGroups={userNavigations} />
          </div>
        </div>
      </div>
      {!isMinimized && (
        <div className="flex items-center justify-center pb-5 text-white">
          <GradientButton size="lg" className="w-50">
            Learning hub
          </GradientButton>
        </div>
      )}
      {/* {!isMinimized && (
        <div
          className={cn(
            'absolute bottom-10 flex justify-center transition-all duration-500 ease-in-out',
            !isMinimized ? 'w-72 opacity-100' : 'w-0 opacity-0'
          )}
        >
          <Button
            size="lg"
            className={cn(
              'transition-all duration-500 ease-in-out',
              !isMinimized ? 'opacity-100' : 'opacity-0'
            )}
          >
            Learning hub
          </Button>
        </div>
      )} */}
    </nav>
  </div>
  );
}
