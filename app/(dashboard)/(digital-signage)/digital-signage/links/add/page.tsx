'use client';
import React from 'react';
import LinkInfoForm from '@/components/forms/links/link-form';

const AddLinkPage = () => {
  return (
    <>
      <div className="grid grid-cols-1 xl:grid-cols-1">
        <LinkInfoForm mode="add" />
      </div>
    </>
  );
};

export default AddLinkPage;
