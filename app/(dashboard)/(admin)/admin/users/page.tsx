'use client';
import { fetchUsers } from '@/app/api/userApi';
import FiltersWithSort from '@/components/layout/filters-wsort';
import { AllUsersTable } from '@/components/tables/user-info-tables/client';
import UserGrid from '@/components/tables/user-info-tables/gridView';
import { Button } from '@/components/ui/button';

import { User } from '@/types/User';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';

export default function page() {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState('grid');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('name');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchUsers(search, filter);
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
  }, [search, filter]); // execute every time filters change

  // execute every time filters change
  //   useEffect(() => {
  //     const fetchData = async () => {
  //         try {
  //             const response = await searchUser(search, filter);
  //             setData(response.data);
  //         } catch (error) {
  //             console.error("Error fetching user:", error);
  //         }
  //     };

  //     fetchData();
  // }, [search, filter]);

  const handleViewChange = () => {
    setView((prev) => (prev === 'list' ? 'grid' : 'list'));
  };

  const handleFilterByChange = (selectedOption: any) => {
    setFilter(selectedOption?.value || '');
  };

  const handleSearchChange = (searchValue: any) => {
    setSearch(searchValue?.target?.value || '');
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
            <Link href="/admin/users/add">
              <Button>+ Add User</Button>
            </Link>
          </div>
        </div>
      </div>
      <div>
        {view === 'list' ? (
          <AllUsersTable data={data} />
        ) : (
          <UserGrid data={data} />
        )}
      </div>
    </>
  );
}
