import { auth } from '@/auth';
import setupInterceptors from '@/lib/axiosInterceptor';
import { useSession } from 'next-auth/react';
import React from 'react';

const LayoutWrapper = () => {
  // const { data: session } = useSession();
  const ddd = auth();

  console.log('ddd');
  console.log(ddd);
  return <div>layoutWrapper</div>;
};

export default LayoutWrapper;
