
import type { AxiosError, AxiosInstance } from "axios";
import api from "../services/api";

export interface ApiResponse<T> {
  message: string;
  isStatusValid: boolean;
  data?: T | undefined;
  errors?: Record<string, string | string[]>
}

export const useApi = () => {
  const apiRequest: AxiosInstance = api;

  const transformError = (err: AxiosError) => {
    return err.response
      ? err.response.data
      : {
        message: 'Ocorreu um erro inesperado, tente novamente mais tarde.',
        status: false,
      };
  }

  const get = async <T>(url: string, params?: any): Promise<ApiResponse<T>> => {
    const result = await apiRequest.get(url, { params })
      .then((res) => { return res.data })
      .catch((err) => {
        return transformError(err)
      }) as ApiResponse<T>;
    return result;
  };

  const post = async <T>(url: string, data?: any): Promise<ApiResponse<T>> => {
    return await apiRequest.post(url, data)
      .then((res) => { return res.data })
      .catch((err) => {
        return transformError(err)
      }) as ApiResponse<T>;
  };

  const put = async <T>(url: string, data: any): Promise<ApiResponse<T>> => {
    return await apiRequest.put(url, data)
      .then((res) => { return res.data })
      .catch((err) => {
        return transformError(err)
      }) as ApiResponse<T>;
  };

  const del = async <T>(url: string): Promise<ApiResponse<T>> => {
    return await apiRequest.delete(url)
      .then((res) => { return res.data })
      .catch((err) => {
        return transformError(err)
      }) as ApiResponse<T>;
  };

  return { get, post, put, del };
}