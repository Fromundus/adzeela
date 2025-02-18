import axiosInstance from '@/lib/axiosInstance';

const scheduledSlotsUrl = process.env.NEXT_PUBLIC_API_URL + '/api/scheduled-slots';

export const fetchScheduledSlot = async () => {
  return axiosInstance.get(scheduledSlotsUrl);
};

// export const fetchTvScreenById = async (id: number) => {
//   return axiosInstance.get(`${tvScreenUrl}/${id}`);
// };

export const createScheduledSlot = async (data: FormData) => {
  return axiosInstance.post(scheduledSlotsUrl, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

// export const updateTvScreen = async (id: number, data: any) => {
//   return axiosInstance.put(`${tvScreenUrl}/${id}`, data);
// };

// export const deleteTvScreen = async (id: number) => {
//   return axiosInstance.delete(`${tvScreenUrl}/${id}`);
// };