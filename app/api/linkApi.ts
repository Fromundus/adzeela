import axiosInstance from '@/lib/axiosInstance';

const url = process.env.NEXT_PUBLIC_API_URL + '/api/links';


export const updateLinks = (id: any, data: any) => {
  return axiosInstance.put(`${url}/${id}`, data);
};

// export const fetchLinks = async () => {
//   return axiosInstance.get(url);
// };

export const fetchLinks = async (search?: string, filter?: string) => {
    return axiosInstance.get(`${url}/search`, { 
       params: {
         'filter': filter,
         'search': search,
       }
   });
 };

export const fetchLinksById = async (id: number) => {
  return axiosInstance.get(`${url}/${id}`);
};

export const createLinks = async (data: any) => {
  return axiosInstance.post(url, data);
};

export const deleteLinks = async (id: number) => {
  return axiosInstance.delete(`${url}/${id}`);
};

