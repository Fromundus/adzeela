import axiosInstance from '@/lib/axiosInstance';

const url = `${process.env.NEXT_PUBLIC_API_URL}/api/stripe`;

export const fetchPayments = async () => {
  return axiosInstance.get(url + '/payments');
};

export const fetchPaymentMethods = async (stripe_customer_id: string) => {
  return axiosInstance.get(url + `/${stripe_customer_id}/payment-methods`);
};

export const createPaymentMethod = async (data: any) => {
  return axiosInstance.post(`${url}/payment-method`, data);
};

export const updateDefaultPaymentMethod = async (data: any) => {
  return axiosInstance.post(`${url}/update-payment-method`, data);
};
