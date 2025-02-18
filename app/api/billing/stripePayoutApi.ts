import axiosInstance from '@/lib/axiosInstance';

const url = `${process.env.NEXT_PUBLIC_API_URL}/api/stripe`;


export const createPayout = async (data: any) => {
  return axiosInstance.post(`${url}/payout`, data);
};
