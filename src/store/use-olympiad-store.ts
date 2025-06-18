import { API_URL } from '@/config/api-config';
import axios from 'axios';
import { create } from 'zustand';
import { OlimpiadaStore } from './store';
import { OlympiadInfo } from '@/interfaces/olympiad';

export const useOlimpiadaStore = create<OlimpiadaStore>((set, get) => ({
  olimpiadas: [],
  loading: false,
  error: null,
  fetchOlimpiadas: async () => {
    try {
      set({ loading: true, error: null });
      const response = await axios.get<OlympiadInfo[]>(`${API_URL}/olympiads`);
      set({ olimpiadas: response.data, loading: false });
    } catch (error) {
      set({ error: 'Error al cargar datos de olimpiada', loading: false });
      console.error('Error al cargar datos de olimpiada:', error);
    }
  },

  isInscripcionActive: () => {
    const { olimpiadas } = get();
    if (olimpiadas.length === 0) return false;

    const currentDate = new Date();

    for (let i = 0; i < olimpiadas.length; i++) {
      const olimpiada = olimpiadas[i];
      const startDate = new Date(olimpiada.start_date);
      const endDate = new Date(olimpiada.end_date);

      if (currentDate >= startDate && currentDate <= endDate) {
        return true;
      }
    }

    return false;
  },
}));
