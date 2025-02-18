'use client';
import React, { useState, useEffect } from 'react';
import Filters from '@/components/layout/filters';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { File } from '@/types/File';
import { fetchFilesByType } from '@/app/api/fileApi';
import { MediaTable } from '@/components/tables/media-tables/client';
import MediaGrid from '@/components/tables/media-tables/gridView';

const Page = () => {
  const [view, setView] = useState('list');
  const [search, setSearch] = useState('');
  const [data, setData] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchFilesByType('image');
        console.log(response.data);
        setData(response.data);
      } catch (err) {
        console.error('Error fetching images:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleViewChange = () => {
    setView((prev) => (prev === 'list' ? 'grid' : 'list'));
  };

  if (loading) return <div>Loading...</div>;
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
            <Link href="/digital-signage/media/add">
              <Button>+ Add Media</Button>
            </Link>
          </div>
        </div>
      </div>
      <div>
        {view === 'list' ? (
          <MediaTable data={data} />
        ) : (
          <MediaGrid data={data} />
        )}
      </div>
    </>
  );
};

export default Page;
