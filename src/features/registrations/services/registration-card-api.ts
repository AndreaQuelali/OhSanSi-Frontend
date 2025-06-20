import { API_URL } from '@/config/api-config';
import axios from 'axios';
import {
  PaymentVerificationResponse,
  EnrollmentResponse,
  GroupReceiptResponse,
  IndividualReceiptResponse,
} from '../interfaces/registration-card';

export const registrationCardService = {
  checkPaymentExists: async (
    ci: string,
  ): Promise<PaymentVerificationResponse> => {
    const response = await axios.get(`${API_URL}/payment/${ci}`);
    return response.data;
  },

  getEnrollmentsByCI: async (ci: string): Promise<EnrollmentResponse> => {
    const response = await axios.get(`${API_URL}/enrollments/${ci}/PENDIENTE`);
    return response.data;
  },

  getGroupReceipt: async (
    listId: string | number,
  ): Promise<GroupReceiptResponse> => {
    const response = await axios.get(`${API_URL}/receipts/group/${listId}`);
    return response.data;
  },

  getIndividualReceipt: async (
    listId: string | number,
  ): Promise<IndividualReceiptResponse> => {
    const response = await axios.get(
      `${API_URL}/receipts/individual/${listId}`,
    );
    return response.data;
  },
};
