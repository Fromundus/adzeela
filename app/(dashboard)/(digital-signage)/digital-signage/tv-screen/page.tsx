'use client';
import React, { useState, useEffect } from 'react';
import BreadCrumb from '@/components/breadcrumb';
import Filters from '@/components/layout/filters';
import { TvScreenTable } from '@/components/tables/tv-screen-tables/client';
import TvScreenGrid from '@/components/tables/tv-screen-tables/gridView';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from 'next/link';
import { TvScreen } from '@/types/TvScreen';
import { fetchTvScreens } from '@/app/api/tvScreenApi';
import { fetchCurrentUserId, fetchUserPermissions } from '@/app/api/userApi';
import { PromotersPlanFeatures } from '@/types/Plan';

const Page = () => {
  const [view, setView] = useState('list');
  const [search, setSearch] = useState('');
  const [data, setData] = useState<TvScreen[]>([]);
  const [permissions, setPermissions] = useState<PromotersPlanFeatures>();

  const [loading, setLoading] = useState(true);
  const [loadingPermissions, setLoadingPermissions] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const userId = await fetchCurrentUserId();
        const [tvScreensResponse, permissionsResponse] = await Promise.all([
          fetchTvScreens(),
          fetchUserPermissions(userId.data?.user_id).catch(error => {
            console.error('Failed to fetch user permissions:', error);
            return null;
          })
        ]);
  
        console.log(tvScreensResponse.data);
        setData(tvScreensResponse.data);
  
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
              {permissions?.register_tv_screen !== 0 ? (
                <Link href="/digital-signage/tv-screen/add">
                  <Button>+ Add Tv Screen</Button>
                </Link>
              ) : (
                <Button disabled>+ Add Tv Screen</Button>
              )}
            </div>
          </div>
        </div>
        <div>
          {view === 'list' ? (
            <TvScreenTable data={data} />
          ) : (
            <TvScreenGrid data={data} />
          )}
        </div>
    </>
  );
};

export default Page;
