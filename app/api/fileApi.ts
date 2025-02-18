import axiosInstance from '@/lib/axiosInstance';

const fileUrl = process.env.NEXT_PUBLIC_API_URL + '/api/files';

export const fetchFiles = async () => {
    return axiosInstance.get(fileUrl);
};

export const fetchFileById = async (id: number) => {
    return axiosInstance.get(`${fileUrl}/${id}`);
};

export const createFile = async (data: FormData) => {
    return axiosInstance.post(fileUrl, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const updateFile = async (id: number, data: Partial<FormData>) => {
    return axiosInstance.put(`${fileUrl}/${id}`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const deleteFile = async (id: number) => {
    return axiosInstance.delete(`${fileUrl}/${id}`);
};

export const fetchFilesByType = async (type: string) => {
    return axiosInstance.get(`/api/files/by-type/${type}`);
};
