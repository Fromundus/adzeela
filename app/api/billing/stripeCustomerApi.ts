import axiosInstance from '@/lib/axiosInstance';

const url = `${process.env.NEXT_PUBLIC_API_URL}/api/stripe/customer`;

export const fetchCustomers = async () => {
  return axiosInstance.get(url + 's');
};

export const fetchSubscriptionExpiry = async (stripe_customer_id: string) => {
  return axiosInstance.get(`${url}/${stripe_customer_id}/subscription-expiry`);
};

export const fetchPaymentMethodByCustomer = async (customerId: string) => {
  return axiosInstance.get(`${url}/${customerId}/payment-methods`);
};
