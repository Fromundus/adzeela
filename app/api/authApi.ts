import axiosInstance from '@/lib/axiosInstance';

const url = process.env.NEXT_PUBLIC_API_URL + '/api/auth';

export const login = async (credentials: any) => {
  return axiosInstance.post(url + '/login', credentials);
};

export const register = async (data: RegisterData) => {
  return axiosInstance.post(url + '/register', data);
};

export const getUser = async () => {
  return axiosInstance.get(url + '/user');
};
