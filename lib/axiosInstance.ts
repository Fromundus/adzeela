// import { auth } from '@/auth';
import axios from 'axios';

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // Set your API base URL
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
    'Access-Control-Allow-Headers':
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  }
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // const session = auth();
    // console.log(session);
    // Modify request config before the request is sent
    // config.headers['Custom-Header'] = 'CustomValue';
    // config.headers['Authorization'] = `Bearer ${auth().accessToken}`;
    // config.headers['Access-Control-Allow-Origin'] = '*';

    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Handle the response
    return response;
  },
  (error) => {
    // Handle response error
    if (error.response) {
      // Server responded with a status other than 2xx
      const errorMessage = error.response.data.message || 'Fetch error';
      return Promise.reject(new Error(errorMessage));
    } else {
      // Network error or other issues
      return Promise.reject(new Error(error.message));
    }
  }
);

export default axiosInstance;
