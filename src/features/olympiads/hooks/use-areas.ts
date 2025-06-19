import { useState, useCallback } from 'react';
import axios from 'axios';
import { API_URL } from '@/config/api-config';
import { normalizeAreaName } from '../utils/olympiad-helpers';
import { TableRow } from '../interfaces/form-area';
import { AREA_ERROR_MESSAGES } from '../constants/area-constants';

export function useAreas() {
  const [areasRegistered, setAreasRegistered] = useState<TableRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTableAreas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/areas`);
      const areasFromDB = response.data;
      const formatted = areasFromDB.map(
        (area: { area_id: number; area_name: string }) => ({
          id: area.area_id,
          area: area.area_name,
        }),
      );
      setAreasRegistered(formatted);
    } catch (err) {
      setError(AREA_ERROR_MESSAGES.VERIFY_ERROR);
    } finally {
      setLoading(false);
    }
  }, []);

  const checkDuplicateArea = useCallback(async (inputArea: string) => {
    try {
      const response = await axios.get(`${API_URL}/areas`);
      const areas = response.data;
      return areas.some(
        (area: { area_name: string }) =>
          normalizeAreaName(area.area_name) === normalizeAreaName(inputArea),
      );
    } catch {
      setError(AREA_ERROR_MESSAGES.VERIFY_ERROR);
      return false;
    }
  }, []);

  const registerArea = useCallback(async (nameArea: string) => {
    try {
      const payload = { name: nameArea };
      await axios.post(`${API_URL}/areas`, payload);
      return { success: true };
    } catch {
      return { success: false };
    }
  }, []);

  return {
    areasRegistered,
    fetchTableAreas,
    checkDuplicateArea,
    registerArea,
    loading,
    error,
    setError,
    setAreasRegistered,
  };
}
