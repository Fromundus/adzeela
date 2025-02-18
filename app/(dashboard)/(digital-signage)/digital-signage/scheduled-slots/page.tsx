'use client';
import React, { useState, useEffect } from 'react';
import Filters from '@/components/layout/filters';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ScheduledSlots } from '@/types/ScheduledSlots';
import { fetchScheduledSlot } from '@/app/api/scheduledSlotsApi';

import { ScheduledSlotsTable } from '@/components/tables/scheduled-tables/client';
import ScheduledSlotsGrid from '@/components/tables/scheduled-tables/gridView';
import { AdvertisersPlanFeatures } from '@/types/Plan';
import { fetchCurrentUserId, fetchUserPermissions } from '@/app/api/userApi';

const Page = () => {
  const [view, setView] = useState('list');
  const [search, setSearch] = useState('');
  const [data, setData] = useState<ScheduledSlots[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<AdvertisersPlanFeatures>();
  const [loadingPermissions, setLoadingPermissions] = useState(true);


    useEffect(() => {
      const fetchData = async () => {
        try {
          const userId = await fetchCurrentUserId();
          const [scheduleSlotResponse, permissionsResponse] = await Promise.all([
            fetchScheduledSlot(),
            fetchUserPermissions(userId.data?.user_id).catch(error => {
              console.error('Failed to fetch user permissions:', error);
              return null;
            })
          ]);
    
          console.log(scheduleSlotResponse.data.data);
          setData(scheduleSlotResponse.data.data);
    
          // console.log(permissionsResponse.data);
         if(permissionsResponse) setPermissions(permissionsResponse.data);
        } catch (err) {
          console.error('Error fetching data:', err);
          setError('Failed to load data');
        } finally {
          setLoading(false);
          setLoadingPermissions(false);
        }
      };
    
      fetchData();
    }, [data]);

  const handleViewChange = () => {
    setView((prev) => (prev === 'list' ? 'grid' : 'list'));
  };

  if (loadingPermissions) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>

      <div className="mb-10 grid space-y-3 lg:grid-cols-3 lg:space-y-0">
        <div className="lg:col-span-2">
          <Filters
            handleViewChange={handleViewChange}
            search={search}
            view={view}
          />
        </div>
        <div className="col-span-1">
          <div className="flex justify-start lg:justify-end">
  
            {permissions?.create_ads !== 0 ? (
                         <Link href="/digital-signage/scheduled-slots/add">
                         <Button>+ Add Scheduled Slots</Button>
                       </Link>
           
              ) : (
                <Button disabled>+ Add Scheduled Slots</Button>
              )}
          </div>
        </div>
      </div>
      <div>
        {view === 'list' ? (
          <ScheduledSlotsTable data={data} />
        ) : (
          <ScheduledSlotsGrid data={data} />
        )}
      </div>
    </>
  );
};

export default Page;
