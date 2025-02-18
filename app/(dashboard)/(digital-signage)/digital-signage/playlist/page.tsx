'use client';
import React, { useState, useEffect } from 'react';
import Filters from '@/components/layout/filters';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Playlist } from '@/types/Playlist';
import { PlaylistTable } from '@/components/tables/playlist-tables/client';
import PlaylistGrid from '@/components/tables/playlist-tables/gridView';
import { fetchPlaylists } from '@/app/api/playlistApi';

const Page = () => {
  const [view, setView] = useState('list');
  const [search, setSearch] = useState('');
  const [data, setData] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchPlaylists();
        console.log(response.data);
        setData(response.data.data);
      } catch (err) {
        console.error('Error fetching playlists:', err);
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
            <Link href="/digital-signage/playlist/add">
              <Button>+ Add Playlist</Button>
            </Link>
          </div>
        </div>
      </div>
      <div>
        {view === 'list' ? (
          <PlaylistTable data={data} />
        ) : (
          <PlaylistGrid data={data} />
        )}
      </div>
    </>
  );
};

export default Page;
