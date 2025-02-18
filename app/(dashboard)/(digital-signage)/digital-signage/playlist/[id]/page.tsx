'use client';
import React, { useState, useEffect } from 'react';
import PlaylistForm from '@/components/forms/playlist/playlist-form';
import { useParams } from 'next/navigation';

const EditPlaylistPage = () => {
    const { id } = useParams();
    const [playlistId, setPlaylistId] = useState<number | undefined>(undefined);

    useEffect(() => {
        if (id) {
            const numericId = Number(id);
            if (!isNaN(numericId)) {
                setPlaylistId(numericId);
            }
        }
    }, [id]);

    return (
        <>
            <div className="grid grid-cols-1 xl:grid-cols-1">
                <PlaylistForm mode="edit" playlistId={playlistId} />
            </div>
        </>
    );
};

export default EditPlaylistPage;
