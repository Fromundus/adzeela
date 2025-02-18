'use client';
import NotFound from '@/app/not-found';
import setupInterceptors from '@/lib/axiosInterceptor';
import { useSession } from 'next-auth/react';
import React from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  setupInterceptors();

  const { data: session } = useSession();

  const user: any = session?.user;

  return (
    <div className="flex-1 space-y-4 p-8">
    {user?.roles.includes('Admin') ? children : <NotFound />}
    </div>

  ) 

};

export default Layout;
