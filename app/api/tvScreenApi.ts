import axiosInstance from '@/lib/axiosInstance';

const tvScreenUrl = process.env.NEXT_PUBLIC_API_URL + '/api/tvscreen';

export const fetchTvScreens = async () => {
  return axiosInstance.get(tvScreenUrl + 's');
};

export const fetchTvScreenById = async (id: number) => {
  return axiosInstance.get(`${tvScreenUrl}/${id}`);
};

export const createTvScreen = async (data: any) => {
  return axiosInstance.post(tvScreenUrl, data);
};

export const updateTvScreen = async (id: number, data: any) => {
  return axiosInstance.put(`${tvScreenUrl}/${id}`, data);
};

export const registerTvScreen = async (id: number, deviceId: string) => {
  var data = {
    deviceId,
    tv_id: id
  };
  return axiosInstance.post(`${tvScreenUrl}/register/${id}`, data);
};

export const deleteTvScreen = async (id: number) => {
  return axiosInstance.delete(`${tvScreenUrl}/${id}`);
};

export const fetchTvScreenAds = async (id: number) => {
  return axiosInstance.get(`${tvScreenUrl}/${id}/ads`);
};
