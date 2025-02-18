import axiosInstance from '@/lib/axiosInstance';

const url = process.env.NEXT_PUBLIC_API_URL + '/api/user';
const url2 = process.env.NEXT_PUBLIC_API_URL + '/api/stripe';


export const updateUser = (id: any, data: any) => {
  return axiosInstance.put(`${url}/${id}`, data);
};

// export const fetchUsers = async () => {
//   return axiosInstance.get(url + 's');
// };

export const fetchUsers = async (search?: string, filter?: string) => {
   return axiosInstance.get(`${url + 's'}`, { 
      params: {
        'filter': filter,
        'search': search,
      }
  });
};

export const fetchUserById = async (id: number) => {
  return axiosInstance.get(`${url}/${id}`);
};

export const createUser = async (data: any) => {
  return axiosInstance.post(url, data);
};

export const deleteUser = async (id: number) => {
  return axiosInstance.delete(`${url}/${id}`);
};


export const fetchUserPermissions = async (id: number) => {
  return axiosInstance.get(`${url}/${id}/permissions`);
};


export const fetchCurrentUserId = async () => {
  return axiosInstance.get(`${url}/get-userid`);
};

// export const fetchUserBalance = async () => {
//   return axiosInstance.get(`${url}-balance`);
// };


export const fetchUserBalance = async () => {
  return axiosInstance.get(`${url2}/account-balance`);
};

export const fetchUserTransactions = async (type: string) => {
  return axiosInstance.get(`${url}-transactions/${type}`);
};

// export const searchUser = async (search: string, filterBy: string) => {
//   return axiosInstance.get(`${url}`, { 
//       params: {
//         'filterBy': filterBy,
//         'search': search,
//       }
//   });
// };