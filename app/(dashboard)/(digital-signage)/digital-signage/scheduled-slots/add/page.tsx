'use client';
import {
  Card,
} from '@/components/ui/card';
import React, { useEffect, useState } from 'react';
import ScreenInfoForm from '@/components/forms/scheduled-slots/screen-info-form';
import { fetchTvScreens } from '@/app/api/tvScreenApi';
import { format } from 'date-fns';
import Filters from '@/components/layout/filters';

const Page = () => {
  const [tvscreenData, setTvscreenData] = useState([]);
  const [selectedTvscreen, setSelectedTvscreen] = useState<any>(null);

  const fetchTvScreensData = () => {
    fetchTvScreens()
      .then((response) => {
        setTvscreenData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching tvscreen:', error);
      });
  };

  const formatDate = () => {
    const newDate = new Date(selectedTvscreen?.updated_at);

    return format(newDate, 'MMM d, yyyy hh:mm a');
  };

  const handleViewChange = () => {
    setView((prev) => (prev === 'list' ? 'grid' : 'list'));
  };

  const [view, setView] = useState('list');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchTvScreensData();
  }, []);

  return (
    <div>
      {/* details */}
      <div className="grid space-y-3 lg:grid-cols-3 lg:space-y-0">
        <div className="lg:col-span-2">
          <Filters
            handleViewChange={handleViewChange}
            search={search}
            view={view}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-1">
        <div className="m-2">
          <p className="mb-3 text-primary">Upload details</p>
          <Card className="p-10">
            <ScreenInfoForm
              tvscreens={tvscreenData}
              // setSelectedTvscreen={setSelectedTvscreen}
            />
          </Card>
        </div>
      </div>
      {/* tabs */}
    </div>
  );
};

export default Page;
