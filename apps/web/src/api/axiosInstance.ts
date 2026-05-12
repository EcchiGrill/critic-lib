import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { getSession } from 'next-auth/react';

const requestInterceptor = async (config: InternalAxiosRequestConfig) => {
  if (typeof window !== 'undefined') {
    const session = await getSession();
    const token = session?.user?.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
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
