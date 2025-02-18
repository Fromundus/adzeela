'use client';
import NotFound from '@/app/not-found';
import { getUserNavigations } from '@/constants/data';
import setupInterceptors from '@/lib/axiosInterceptor';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import React, { useEffect } from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  setupInterceptors();
  const { data: session } = useSession();

  const user: any = session?.user;
  
  const userNavigations = getUserNavigations(session) || [];
  const path = usePathname();

  const isPathIncluded = userNavigations.some((group: { items: any[]; }) =>
    group.items?.some((item) => path.startsWith(item.href))
);
  
  return (
    <ScrollArea>
      <div className="flex-1 space-y-4 p-8">
        {user?.subscriptions.includes('Digital Signage') && isPathIncluded ? (
          children
        ) : (
          <NotFound />
        )}
      </div>
    </ScrollArea>
  );
};

export default Layout;
