'use client';
import React from 'react';
import PlaylistForm from '@/components/forms/playlist/playlist-form';

const AddPlaylistPage = () => {
  return (
    <>
      <div className="grid grid-cols-1 xl:grid-cols-1">
        <PlaylistForm mode="add" />
      </div>
    </>
  );
};

export default AddPlaylistPage;
