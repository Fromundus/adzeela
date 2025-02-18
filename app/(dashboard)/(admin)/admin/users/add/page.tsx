'use client';
import React from 'react';
import UserInfoForm from '@/components/forms/user/user-info-form';

const AddUserPage = () => {
  return (
    <>
      <div className="grid grid-cols-1 xl:grid-cols-1">
        <UserInfoForm mode="add" user={null} />
      </div>
    </>
  );
};

export default AddUserPage;
