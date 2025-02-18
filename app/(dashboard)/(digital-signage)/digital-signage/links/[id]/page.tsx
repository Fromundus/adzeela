'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import LinkInfoForm from '@/components/forms/links/link-form';

const EditLinkPage = () => {
  const { id } = useParams();
  const [linkId, setLinkId] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (id) {
      const numericId = Number(id);
      if (!isNaN(numericId)) {
        setLinkId(numericId);
      }
    }
  }, [id]);

  return (
    <>
      <div className="grid grid-cols-1 xl:grid-cols-1">
            <LinkInfoForm mode="edit" linkId={linkId} />
      </div>
    </>
  );
};

export default EditLinkPage;
