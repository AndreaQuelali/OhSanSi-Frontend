import { API_URL } from '@/config/api-config';
import axios from 'axios';
import { VerificationResult } from '../interfaces/modal-upload-payment';

export const paymentUploadService = {
  uploadPaymentReceipt: async (
    imageBlob: Blob,
    fileName: string,
    list_id?: string | number,
    signal?: AbortSignal,
  ): Promise<VerificationResult> => {
    const formData = new FormData();
    formData.append('voucher', imageBlob, fileName || 'comprobante.jpg');

    if (list_id) {
      formData.append('list_id', list_id.toString());
    }

    const response = await axios.post(`${API_URL}/ocr`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      signal,
    });

    if (response.status !== 200) {
      throw new Error('Error al subir la imagen');
    }

    return response.data;
  },
};
