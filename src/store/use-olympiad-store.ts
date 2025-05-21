import { API_URL } from '@/config/api-config';
import axios from 'axios';
import { create } from 'zustand';

interface Olimpiada {
  id_olimpiada: number;
  gestion: number;
  costo: string;
  fecha_inicio: string;
  fecha_fin: string;
  creado_en: string;
  max_categorias_olimpista: number;
  nombre_olimpiada: string;
}

interface OlimpiadaStore {
  olimpiadas: Olimpiada[];
  loading: boolean;
  error: string | null;
  fetchOlimpiadas: () => Promise<void>;
  isInscripcionActive: () => boolean;
}
export const useOlimpiadaStore = create<OlimpiadaStore>((set, get) => ({
  olimpiadas: [],
  loading: false,
  error: null,
  fetchOlimpiadas: async () => {
    try {
      set({ loading: true, error: null });
      const response = await axios.get<Olimpiada[]>(`${API_URL}/olimpiadas`);
      set({ olimpiadas: response.data, loading: false });
    } catch (error) {
      set({ error: 'Error al cargar datos de olimpiada', loading: false });
      console.error('Error al cargar datos de olimpiada:', error);
    }
  },

  isInscripcionActive: () => {
    const { olimpiadas } = get();
    if (olimpiadas.length === 0) return false;
    const currentOlimpiada = olimpiadas[0];
    const currentDate = new Date();
    const startDate = new Date(currentOlimpiada.fecha_inicio);
    const endDate = new Date(currentOlimpiada.fecha_fin);
    return currentDate >= startDate && currentDate <= endDate;
  },
}));
