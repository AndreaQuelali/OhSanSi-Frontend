import axios from 'axios';
import { API_URL } from '@/config/api-config';
import {
  AreaData,
  CreateOlympiadPayload,
  OlympiadData,
} from '../interfaces/olympiad';

export class OlympiadApiService {
  static async getOlympiads(): Promise<OlympiadData[]> {
    try {
      const response = await axios.get(`${API_URL}/olympiads`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener olimpiadas:', error);
      throw error;
    }
  }

  static async createOlympiad(
    payload: CreateOlympiadPayload,
  ): Promise<OlympiadData> {
    try {
      const response = await axios.post(`${API_URL}/olympiads`, payload);
      return response.data;
    } catch (error) {
      console.error('Error al crear olimpiada:', error);
      throw error;
    }
  }

  static async getOlympiadById(id: number): Promise<OlympiadData> {
    try {
      const response = await axios.get(`${API_URL}/olympiads/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener olimpiada:', error);
      throw error;
    }
  }

  static async updateOlympiad(
    id: number,
    payload: Partial<CreateOlympiadPayload>,
  ): Promise<OlympiadData> {
    try {
      const response = await axios.put(`${API_URL}/olympiads/${id}`, payload);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar olimpiada:', error);
      throw error;
    }
  }

  static async deleteOlympiad(id: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/olympiads/${id}`);
    } catch (error) {
      console.error('Error al eliminar olimpiada:', error);
      throw error;
    }
  }

  static async getAreas(): Promise<AreaData[]> {
    try {
      const response = await axios.get(`${API_URL}/areas`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener áreas:', error);
      throw error;
    }
  }

  static async createArea(area: string): Promise<AreaData> {
    try {
      const response = await axios.post(`${API_URL}/areas`, { area });
      return response.data;
    } catch (error) {
      console.error('Error al crear área:', error);
      throw error;
    }
  }

  static async deleteArea(id: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/areas/${id}`);
    } catch (error) {
      console.error('Error al eliminar área:', error);
      throw error;
    }
  }
}
