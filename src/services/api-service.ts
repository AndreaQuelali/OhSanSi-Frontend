import { API_URL } from '@/config/api-config';
import axios from 'axios';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export const postData = async (endpoint: string, data: object) => {
  try {
    const response = await apiClient.post(endpoint, data);
    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response) {
      throw error.response;
    }
    throw error;
  }
};

export const postDataAsJson = async (endpoint: string, data: object) => {
  try {
    const response = await apiClient.post(endpoint, data, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response) {
      throw error;
    }
    throw error;
  }
};

export const getData = async (endpoint: string) => {
  try {
    const response = await apiClient.get(endpoint);
    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(error.response?.data || error.message);
  }
};
