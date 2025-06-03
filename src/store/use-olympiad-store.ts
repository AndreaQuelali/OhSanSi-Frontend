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

  const currentDate = new Date();

  for (let i = 0; i < olimpiadas.length; i++) {
    const olimpiada = olimpiadas[i];
    const startDate = new Date(olimpiada.fecha_inicio);
    const endDate = new Date(olimpiada.fecha_fin);

    if (currentDate >= startDate && currentDate <= endDate) {
      return true;
    }
  }

  return false;
}
}));
