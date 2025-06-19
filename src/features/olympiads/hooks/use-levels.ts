import { useState, useCallback } from 'react';
import axios from 'axios';
import { API_URL } from '@/config/api-config';
import { normalizeAreaName } from '../utils/olympiad-helpers';
import { TableRow } from '../interfaces/form-levels';
import { LEVEL_ERROR_MESSAGES } from '../constants/level-constants';

export function useLevels() {
  const [levelsRegistered, setLevelsRegistered] = useState<TableRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTableLevels = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/levels`);
      const levelsFromDB = response.data.niveles;
      const formatted = levelsFromDB.map((niveles: { id_nivel: number; nombre: string }) => ({
        id: niveles.id_nivel,
        level: niveles.nombre,
      }));
      setLevelsRegistered(formatted);
    } catch (err) {
      setError(LEVEL_ERROR_MESSAGES.VERIFY_ERROR);
    } finally {
      setLoading(false);
    }
  }, []);

  const checkDuplicateLevel = useCallback(async (inputLevel: string) => {
    try {
      const response = await axios.get(`${API_URL}/levels`);
      const levels = response.data.niveles;
      return levels.some((nivel: { nombre: string }) => normalizeAreaName(nivel.nombre) === normalizeAreaName(inputLevel));
    } catch {
      setError(LEVEL_ERROR_MESSAGES.VERIFY_ERROR);
      return false;
    }
  }, []);

  const registerLevel = useCallback(async (nameLevel: string) => {
    try {
      const payload = { nombre: nameLevel };
      await axios.post(`${API_URL}/levels`, payload);
      return { success: true };
    } catch {
      return { success: false };
    }
  }, []);

  return {
    levelsRegistered,
    fetchTableLevels,
    checkDuplicateLevel,
    registerLevel,
    loading,
    error,
    setError,
    setLevelsRegistered
  };
} 