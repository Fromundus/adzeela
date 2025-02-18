'use client';
import NotFound from '@/app/not-found';
import setupInterceptors from '@/lib/axiosInterceptor';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { useSession } from 'next-auth/react';
import React, { useEffect } from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  setupInterceptors();
  const { data: session } = useSession();

  const user: any = session?.user;

  return (
    <ScrollArea>
      <div className="flex-1 space-y-4 p-8">
        {user?.subscriptions.includes('Work Place') ? children : <NotFound />}
      </div>
    </ScrollArea>
  );
};

export default Layout;
