import axiosInstance from '@/lib/axiosInstance';

const countryUrl = process.env.NEXT_PUBLIC_API_URL + '/api/country';

export const fetchAllCountries = async () => {
  return axiosInstance.get(countryUrl);
};

export const fetchStateByCountry = async (country_id: number) => {
  return axiosInstance.get(`${countryUrl}/state/${country_id}`);
};

export const fetchCityByState = async (state_id: number) => {
  return axiosInstance.get(`${countryUrl}/state/city/${state_id}`);
};
