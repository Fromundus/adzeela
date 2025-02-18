import axiosInstance from '@/lib/axiosInstance';

const url = `${process.env.NEXT_PUBLIC_API_URL}/api/stripe/invoice`;

export const fetchInvoices = async () => {
  return axiosInstance.get(url + 's');
};
