'use client';
import React from 'react';
import { Card } from '@/components/ui/card';
import MediaForm from '@/components/forms/media/media-form';


const AddMediaPage = () => {
  return (
    <>
      <div className="grid grid-cols-1 xl:grid-cols-1">
        <div className="m-2">
          <p className="mb-3 text-primary">Upload details</p>
          <Card className="p-10">
            <MediaForm mode="add" />
          </Card>
        </div>
      </div>
    </>
  );
};

export default AddMediaPage;
