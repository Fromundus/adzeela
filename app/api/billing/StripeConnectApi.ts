import axiosInstance from '@/lib/axiosInstance';

const url = `${process.env.NEXT_PUBLIC_API_URL}/api/stripe`;

export const fetchConnectStatus = async () => {
  return axiosInstance.get(url + '/connect-status');
};

export const connectAccount = async () => {
  return axiosInstance.post(`${url}/connect`);
};
