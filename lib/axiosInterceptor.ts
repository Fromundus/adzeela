// import axiosInstance from './axios';
import { auth } from '@/auth';
import axiosInstance from './axiosInstance';
import { useSession } from 'next-auth/react';
// import { getSession } from 'next-auth/react';

const SetupInterceptors = () => {
  const { data: session } = useSession<boolean>();

  axiosInstance.interceptors.request.use(
    (config) => {
      // const session = auth();
      // console.log(session);
      // Modify request config before the request is sent
      // config.headers['Custom-Header'] = 'CustomValue';
      config.headers['Authorization'] = `Bearer ${session?.user?.token}`;
      // config.headers['Access-Control-Allow-Origin'] = '*';

      return config;
    },
    (error) => {
      // Handle request error
      return Promise.reject(error);
    }
  );
};

export default SetupInterceptors;
