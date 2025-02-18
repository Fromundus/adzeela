import axiosInstance from '@/lib/axiosInstance';

const url = `${process.env.NEXT_PUBLIC_API_URL}/api/stripe/subscription`;

export const fetchSubscriptions = async () => {
  return axiosInstance.get(url + 's');
};


export const createSubscriptions = async (data: any) => {
  return axiosInstance.post(url + 's', data);
};  

export const cancelSubscription = async () => {
  return axiosInstance.post(url + '-cancel');
};  

