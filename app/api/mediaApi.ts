import axiosInstance from '@/lib/axiosInstance';

const mediaUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/media`;

export const fetchMedias = async () => {
  return axiosInstance.get(mediaUrl + 's');
};

export const fetchMediaById = async (id: number) => {
  return axiosInstance.get(`${mediaUrl}/${id}`);
};

export const createMedia = async (data: FormData) => {
  return axiosInstance.post(mediaUrl, data);
};

export const updateMedia = async (id: number, data: any) => {
  return axiosInstance.put(`${mediaUrl}/${id}`, data);
};

export const deleteMedia = async (id: number) => {
  return axiosInstance.delete(`${mediaUrl}/${id}`);
};

export const addMedia = async (id: number, data: any) => {
  return axiosInstance.patch(`${mediaUrl}/${id}`, data);
};

export const removeMediaFile = async (id: number) => {
  return axiosInstance.delete(`${mediaUrl}/file/${id}`);
};
