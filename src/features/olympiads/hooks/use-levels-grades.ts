import { useState, useCallback } from 'react';
import axios from 'axios';
import { API_URL } from '@/config/api-config';
import { LEVELS_GRADES_ERROR_MESSAGES } from '../constants/levels-grades-constants';
import { TableRow, FormData } from '../interfaces/form-levels-grades';

export function useLevelsGrades() {
  const [tableData, setTableData] = useState<TableRow[]>([]);
  const [levels, setLevels] = useState<
    { level_id: number; level_name: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLevels = useCallback(async (olympiadId: number) => {
    if (!olympiadId) return;
    try {
      const response = await axios.get(`${API_URL}/levels/${olympiadId}`);
      setLevels(response.data.levels);
    } catch (error) {
      setError('Error al obtener los niveles');
    }
  }, []);

  const fetchTableData = useCallback(async (olympiadId: number) => {
    if (!olympiadId) return;
    try {
      const response = await axios.get(
        `${API_URL}/grades/levels/${olympiadId}`,
      );
      const levelstable = response.data;
      const formatted = levelstable.map((nivel: any) => ({
        level: nivel.level_name,
        grade:
          nivel.grades.length > 1
            ? `${nivel.grades[0].grade_name} a ${nivel.grades[nivel.grades.length - 1].grade_name}`
            : nivel.grades[0].grade_name,
      }));
      setTableData(formatted);
    } catch (error) {
      setError('Error al obtener los niveles con sus grados');
    }
  }, []);

  const checkDuplicateAssociation = useCallback(
    async (levelId: number, olympiadId: number) => {
      try {
        const response = await axios.get(
          `${API_URL}/grades/levels/${olympiadId}`,
        );
        return response.data.some((item: any) => item.level_id === levelId);
      } catch {
        setError(LEVELS_GRADES_ERROR_MESSAGES.REGISTER_ERROR);
        return false;
      }
    },
    [],
  );

  const registerAssociation = useCallback(
    async (
      data: FormData,
      levels: { level_id: number; level_name: string }[],
    ) => {
      const levelId = levels.find(
        (level) => level.level_id.toString() === data.level,
      )?.level_id;
      if (!levelId) return { success: false, message: 'Nivel no encontrado' };
      const gminId = Number(data.gmin);
      const gmaxId = data.gmax ? Number(data.gmax) : Number(data.gmin);
      const olympiadId = Number(data.olympiad);
      const alreadyRegistered = await checkDuplicateAssociation(
        levelId,
        olympiadId,
      );
      if (alreadyRegistered) {
        return {
          success: false,
          message: LEVELS_GRADES_ERROR_MESSAGES.ALREADY_REGISTERED,
        };
      }
      const payload = {
        level_id: levelId,
        min_grade_id: gminId,
        max_grade_id: gmaxId,
        olympiad_id: olympiadId,
      };
      console.log(payload);
      try {
        await axios.post(`${API_URL}/grades/levels`, payload);
        return { success: true };
      } catch {
        return {
          success: false,
          message: LEVELS_GRADES_ERROR_MESSAGES.REGISTER_ERROR,
        };
      }
    },
    [checkDuplicateAssociation],
  );

  return {
    tableData,
    setTableData,
    levels,
    setLevels,
    fetchLevels,
    fetchTableData,
    registerAssociation,
    loading,
    error,
    setError,
  };
}
