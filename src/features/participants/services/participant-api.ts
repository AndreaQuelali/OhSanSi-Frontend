import { API_URL } from '@/config/api-config';
import axios from 'axios';

export const registerExcelData = async (
  ciResponsable: string,
  rawData: any[][],
) => {
  return axios.post(`${API_URL}/excel/registration`, {
    ci_responsable_inscripcion: ciResponsable,
    data: rawData,
  });
};
