import { useState, useEffect } from 'react';
import { OlympiadApiService } from '../services/olympiad-api';
import { AreaData } from '../interfaces/olympiad';


export const useAreas = () => {
  const [areas, setAreas] = useState<AreaData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAreas = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await OlympiadApiService.getAreas();
      setAreas(data);
    } catch (err) {
      setError('Error al cargar las áreas');
      console.error('Error fetching areas:', err);
    } finally {
      setLoading(false);
    }
  };


  const createArea = async (areaName: string) => {
    try {
      setLoading(true);
      setError(null);
      const newArea = await OlympiadApiService.createArea(areaName);
      setAreas((prev) => [...prev, newArea]);
      return newArea;
    } catch (err) {
      setError('Error al crear el área');
      throw err;
    } finally {
      setLoading(false);
    }
  };

 
  const deleteArea = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await OlympiadApiService.deleteArea(id);
      setAreas((prev) => prev.filter((area) => area.id !== id));
    } catch (err) {
      setError('Error al eliminar el área');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const checkAreaExists = (areaName: string): boolean => {
    return areas.some(
      (area) => area.area.toUpperCase() === areaName.toUpperCase(),
    );
  };

  useEffect(() => {
    fetchAreas();
  }, []);

  return {
    areas,
    loading,
    error,
    fetchAreas,
    createArea,
    deleteArea,
    checkAreaExists,
  };
};
