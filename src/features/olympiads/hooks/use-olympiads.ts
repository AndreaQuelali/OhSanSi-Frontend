import { useState, useEffect } from 'react';
import { OlympiadApiService } from '../services/olympiad-api';
import { OlympiadData } from '../interfaces/olympiad';


export const useOlympiads = () => {
  const [olympiads, setOlympiads] = useState<OlympiadData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOlympiads = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await OlympiadApiService.getOlympiads();
      setOlympiads(data);
    } catch (err) {
      setError('Error al cargar las olimpiadas');
      console.error('Error fetching olympiads:', err);
    } finally {
      setLoading(false);
    }
  };


  const createOlympiad = async (
    payload: Parameters<typeof OlympiadApiService.createOlympiad>[0],
  ) => {
    try {
      setLoading(true);
      setError(null);
      const newOlympiad = await OlympiadApiService.createOlympiad(payload);
      setOlympiads((prev) => [...prev, newOlympiad]);
      return newOlympiad;
    } catch (err) {
      setError('Error al crear la olimpiada');
      throw err;
    } finally {
      setLoading(false);
    }
  };


  const deleteOlympiad = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await OlympiadApiService.deleteOlympiad(id);
      setOlympiads((prev) =>
        prev.filter((olympiad) => olympiad.id_olimpiada !== id),
      );
    } catch (err) {
      setError('Error al eliminar la olimpiada');
      throw err;
    } finally {
      setLoading(false);
    }
  };

 
  const updateOlympiad = async (
    id: number,
    payload: Parameters<typeof OlympiadApiService.updateOlympiad>[1],
  ) => {
    try {
      setLoading(true);
      setError(null);
      const updatedOlympiad = await OlympiadApiService.updateOlympiad(
        id,
        payload,
      );
      setOlympiads((prev) =>
        prev.map((olympiad) =>
          olympiad.id_olimpiada === id ? updatedOlympiad : olympiad,
        ),
      );
      return updatedOlympiad;
    } catch (err) {
      setError('Error al actualizar la olimpiada');
      throw err;
    } finally {
      setLoading(false);
    }
  };


  const checkOlympiadNameExists = (name: string, year: number): boolean => {
    return olympiads.some(
      (olympiad) =>
        olympiad.gestion === year &&
        olympiad.nombre_olimpiada.toUpperCase() === name.toUpperCase(),
    );
  };


  const getOlympiadsByYear = (year: number): OlympiadData[] => {
    return olympiads.filter((olympiad) => olympiad.gestion === year);
  };

  useEffect(() => {
    fetchOlympiads();
  }, []);

  return {
    olympiads,
    loading,
    error,
    fetchOlympiads,
    createOlympiad,
    deleteOlympiad,
    updateOlympiad,
    checkOlympiadNameExists,
    getOlympiadsByYear,
  };
};
