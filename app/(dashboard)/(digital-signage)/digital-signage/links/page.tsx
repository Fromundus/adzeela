'use client';
import { fetchLinks } from '@/app/api/linkApi';
import Filters from '@/components/layout/filters';
import { AllLinksTable } from '@/components/tables/links-tables/client';
import LinkGrid from '@/components/tables/links-tables/gridView';
import { Button } from '@/components/ui/button';
import { Link as Linktype } from '@/types/Link'; // put alias Linktype because it conflcts with Link from next link

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import FiltersWithSort from '@/components/layout/filters-wsort';

export default function page() {
  const [data, setData] = useState<Linktype[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState('list');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState("name");
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchLinks(search, filter);
        console.log(response.data);
        setData(response.data);
      } catch (err) {
        console.error('Error fetching userss:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [search, filter]);

  const handleViewChange = () => {
    setView((prev) => (prev === 'list' ? 'grid' : 'list'));
  };

  const handleFilterByChange = (selectedOption:any) => {
    setFilter(selectedOption?.value || '');
  };

  const handleSearchChange = (searchValue:any) => {
    setSearch(searchValue?.target?.value || '');
    console.log(search)
  };


  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <div className="mb-10 grid space-y-3 lg:grid-cols-3 lg:space-y-0">
        <div className="lg:col-span-2">
          <FiltersWithSort
            handleViewChange={handleViewChange}
            handleFilterByChange={handleFilterByChange}
            handleSearchChange={handleSearchChange}
            search={search}
            view={view}
            filter={filter}
          />
        </div>
        <div className="col-span-1">
          <div className="flex justify-start lg:justify-end">
            <Link href="/digital-signage/links/add">
              <Button>+ Add Link</Button>
            </Link>
          </div>
        </div>
      </div>
      <div>
        <div>
          {view === 'list' ? (
            <AllLinksTable data={data} />
          ) : (
            <LinkGrid data={data} />
          )}
        </div>
      </div>
    </>
  );
}
