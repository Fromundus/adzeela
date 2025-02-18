'use client';
import React, { useState, useEffect } from 'react';
import Filters from '@/components/layout/filters';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Media } from '@/types/Media';
import { fetchMedias } from '@/app/api/mediaApi';
import { AllMediaTable } from '@/components/tables/all-media-tables/client';
import AllMediaGrid from '@/components/tables/all-media-tables/gridView';

const Page = () => {
    const [view, setView] = useState('list');
    const [search, setSearch] = useState('');
    const [data, setData] = useState<Media[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetchMedias();
                setData(response.data.data); // Assuming this is the correct structure of `response.data.data`
            } catch (err) {
                console.error('Error fetching medias:', err);
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
                    <AllMediaTable data={data} />
                ) : (
                    <AllMediaGrid data={data} />
                )}
            </div>
        </>
    );
};

export default Page;
