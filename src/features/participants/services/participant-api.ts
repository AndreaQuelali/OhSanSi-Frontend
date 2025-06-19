import { API_URL } from '@/config/api-config';
import axios from 'axios';

export class ParticipantApiService {
  static async uploadExcelFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return axios.post(`${API_URL}/excel/data`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  static async registerExcelData(ciResponsable: string, rawData: any[][]) {
    return axios.post(`${API_URL}/excel/registration`, {
      ci_responsable_inscripcion: ciResponsable,
      data: rawData,
    });
  }

  static async getOlimpistAreasLevels(ci: string) {
    return axios.get(`${API_URL}/olympists/${ci}/areas-levels`);
  }

  static async getOlimpistEnrollments(ci: string) {
    return axios.get(`${API_URL}/olympists/${ci}/enrollments`);
  }

  static async enrollWithTutor(payload: any) {
    return axios.post(`${API_URL}/enrollments/with-tutor`, payload);
  }

  static async getProvincesByDepartment(department: string) {
    return axios.get(`${API_URL}/provinces/${department}`);
  }

  static async getSchoolsByProvince(province: string) {
    return axios.get(`${API_URL}/schools/provinces/${province}`);
  }

  static async getMaxCategoriesByDate(fecha: string) {
    return axios.get(`${API_URL}/olympiads/max-categories?fecha=${fecha}`);
  }

  static async getOlimpistByCI(ci: string) {
    return axios.get(`${API_URL}/olympists/${ci}`);
  }

  static async getTutorByCI(ci: string) {
    return axios.get(`${API_URL}/tutors/${ci}`);
  }

  static async getGrades() {
    return axios.get(`${API_URL}/grades`);
  }

  static async getDepartments() {
    return axios.get(`${API_URL}/departaments`);
  }

  static async registerOlimpist(payload: any) {
    return axios.post(`${API_URL}/olympists`, payload);
  }
}
