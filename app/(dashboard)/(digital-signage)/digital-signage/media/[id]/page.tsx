'use client';
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { useParams } from 'next/navigation';
import MediaFormUpdate from '@/components/forms/media/media-form-update';

const EditMediaPage = () => {
  const { id } = useParams();
  const [mediId, setMediaId] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (id) {
      const numericId = Number(id);
      if (!isNaN(numericId)) {
        setMediaId(numericId);
      }
    }
  }, [id]);

  return (
    <>
      <div className="grid grid-cols-1 xl:grid-cols-1">
        <div className="m-2">
          <p className="mb-3 text-primary">Upload details</p>
          <Card className="p-10">
            <MediaFormUpdate mode="edit" mediaId={mediId} />
          </Card>
        </div>
      </div>
    </>
  );
};

export default EditMediaPage;
