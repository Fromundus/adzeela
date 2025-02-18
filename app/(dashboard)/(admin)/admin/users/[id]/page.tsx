'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import UserInfoForm from '@/components/forms/user/user-info-form';
import { User } from '@/types/User';
import { getUser } from '@/app/api/authApi';

const EditUserPage = () => {
    const { id } = useParams();
    const [userId, setUserId] = useState<number | undefined>(undefined);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

     const fetchCurrentUser = () => {
          getUser()
            .then((res) => {
              setUser(res.data);
              setLoading(false);
            })
            .catch((err) => {
              console.error('Error fetching user:', err);
            });
        };
      
        useEffect(() => {
          fetchCurrentUser();
        }, []);

    useEffect(() => {
        if (id) {
            const numericId = Number(id);
            if (!isNaN(numericId)) {
                setUserId(numericId);
            }
        }
    }, [id]);

    return (
        <>
            <div className="grid grid-cols-1 xl:grid-cols-1">
             <UserInfoForm mode="edit" userId={userId} user={user}/>
            </div>
        </>
    );
};

export default EditUserPage;
