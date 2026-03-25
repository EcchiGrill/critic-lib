import { getCookie } from '@/lib/utils/getCookie';
import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

const requestInterceptor = async (config: InternalAxiosRequestConfig) => {
  const token = getCookie('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};

const attachAuthInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.request.use(
    (config) => requestInterceptor(config),
    (error) => Promise.reject(error)
  );
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
export const api = axios.create({ baseURL: apiUrl });

attachAuthInterceptor(api);
