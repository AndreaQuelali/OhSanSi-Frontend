import { API_URL } from '@/config/api-config';
import axios from 'axios';
import {
  PaymentResponse,
  EnrollmentApiResponse,
} from '../interfaces/registrations-list';
import { API_ENDPOINTS } from '../constants/registrations-list';

export const registrationsListService = {
  checkPayment: async (ci: string): Promise<PaymentResponse> => {
    const response = await axios.get(`${API_URL}${API_ENDPOINTS.payment(ci)}`);
    return response.data;
  },

  getEnrollmentsPending: async (ci: string): Promise<EnrollmentApiResponse> => {
    const response = await axios.get(
      `${API_URL}${API_ENDPOINTS.enrollmentsPending(ci)}`,
    );
    return response.data;
  },

  getEnrollmentsPendingForUpload: async (
    ci: string,
  ): Promise<EnrollmentApiResponse> => {
    const response = await axios.get(
      `${API_URL}${API_ENDPOINTS.enrollmentsPendingUpload(ci)}`,
    );
    return response.data;
  },

  getEnrollmentsAll: async (ci: string): Promise<EnrollmentApiResponse> => {
    const response = await axios.get(
      `${API_URL}${API_ENDPOINTS.enrollmentsAll(ci)}`,
    );
    return response.data;
  },
};
