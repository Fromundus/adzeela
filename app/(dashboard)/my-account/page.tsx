'use client';
import { getUser } from '@/app/api/authApi';
import AccountDetails from '@/components/forms/account-details-form';
import { ScrollArea } from '@/components/ui/scroll-area';
import setupInterceptors from '@/lib/axiosInterceptor';
import { User } from '@/types/User';
import React, { useEffect, useState } from 'react';

const Page = () => {
  setupInterceptors();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = () => {
    getUser()
      .then((res) => {
        setUser(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching user:', err);
      });
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <ScrollArea>
      <div className="flex-1 space-y-4 p-8">
        {/* filter */}
        {loading ? (
          <div>Loading...</div>
        ) : (
          user && <AccountDetails user={user} />
        )}
      </div>
    </ScrollArea>
  );
};

export default Page;
