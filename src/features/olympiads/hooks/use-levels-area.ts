import { useState, useCallback } from 'react';
import axios from 'axios';
import { API_URL } from '@/config/api-config';
import { LEVELS_AREA_ERROR_MESSAGES } from '../constants/levels-area-constants';
import { TableRow, FormData } from '../interfaces/form-levels-area';

export function useLevelsArea() {
  const [tableData, setTableData] = useState<TableRow[]>([]);
  const [levels, setLevels] = useState<{ level_id: number; name: string }[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLevels = useCallback(async (olympiadId: number) => {
    if (!olympiadId) return;
    try {
      const response = await axios.get(`${API_URL}/levels-areas/${olympiadId}`);
      setLevels(response.data.levels);
    } catch (error) {
      setError('Error al obtener los niveles');
    }
  }, []);

  const fetchTableLA = useCallback(async (olympiadId: number) => {
    if (!olympiadId) return;
    try {
      const response = await axios.get(
        `${API_URL}/olympiads/${olympiadId}/levels-areas`,
      );
      if (response.data && response.data.data) {
        const { year, areas } = response.data.data;
        if (Array.isArray(areas)) {
          let idCounter = 1;
          const formattedData = areas.flatMap((area) =>
            area.levels.map((nivel: { level_name: string }) => ({
              id: idCounter++,
              olympiad: year,
              area: area.area_name,
              level: nivel.level_name,
            })),
          );
          setTableData(formattedData);
        } else {
          setTableData([]);
        }
      } else {
        setTableData([]);
      }
    } catch (error) {
      setTableData([]);
    }
  }, []);

  const checkDuplicateAssociation = useCallback(
    async (olympiadId: number, areaId: number, levelId: number) => {
      try {
        const response = await axios.get(
          `${API_URL}/olympiads/${olympiadId}/levels-areas`,
        );
        const registros = response.data?.data?.areas ?? [];
        return registros.some(
          (area: any) =>
            area.area_id === areaId &&
            area.levels.some((nivel: any) => nivel.level_id === levelId),
        );
      } catch {
        setError(LEVELS_AREA_ERROR_MESSAGES.REGISTER_ERROR);
        return false;
      }
    },
    [],
  );

  const registerAssociation = useCallback(
    async (
      data: FormData,
      areas: { area_id: number; area_name: string }[],
      levels: { level_id: number; name: string }[],
    ) => {
      const areaId = Number(data.area);
      const levelId = Number(data.level);
      const olympiadId = Number(data.olympiad);
      if (!levelId || !areaId || !olympiadId) {
        return { success: false, message: 'Datos inválidos' };
      }
      // Validar periodo de la olimpiada
      try {
        const olimpResponse = await axios.get(`${API_URL}/olympiads`);
        const currentDate = new Date();
        const olimpiada = olimpResponse.data.find(
          (olimpiada: any) => olimpiada.olympiad_id === olympiadId,
        );
        if (!olimpiada) {
          return {
            success: false,
            message: 'No se encontró la olimpiada seleccionada',
          };
        }
        const fechaInicio = new Date(olimpiada.start_date);
        const fechaFin = new Date(olimpiada.end_date);
        const creadoEn = new Date(olimpiada.created_in);
        if (currentDate >= fechaInicio && currentDate <= fechaFin) {
          return {
            success: false,
            message: LEVELS_AREA_ERROR_MESSAGES.ENROLLMENT_ERROR,
          };
        }
        if (!(currentDate >= creadoEn && currentDate < fechaInicio)) {
          return {
            success: false,
            message: LEVELS_AREA_ERROR_MESSAGES.PERIOD_ERROR,
          };
        }
      } catch {
        return {
          success: false,
          message: LEVELS_AREA_ERROR_MESSAGES.VERIFY_ERROR,
        };
      }
      // Validar duplicado
      const alreadyRegistered = await checkDuplicateAssociation(
        olympiadId,
        areaId,
        levelId,
      );
      if (alreadyRegistered) {
        return {
          success: false,
          message: LEVELS_AREA_ERROR_MESSAGES.ALREADY_REGISTERED,
        };
      }
      const payload = {
        olympiad_id: olympiadId,
        area_id: areaId,
        level_id: levelId,
        // max_niveles: 1,
      };
      console.log(payload);
      try {
        await axios.post(`${API_URL}/areas/association`, payload);
        return { success: true };
      } catch {
        return {
          success: false,
          message: LEVELS_AREA_ERROR_MESSAGES.REGISTER_ERROR,
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
    fetchTableLA,
    registerAssociation,
    loading,
    error,
    setError,
  };
}
