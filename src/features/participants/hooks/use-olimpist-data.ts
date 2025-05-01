import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '@/config/api-config';
import { debounce } from 'lodash';

export function useOlimpistaData(ciOlimpista: string) {
  const [areasDisponibles, setAreasDisponibles] = useState<
    Record<
      string,
      { id_nivel: number; nombre_nivel: string; registrado?: boolean }[]
    >
  >({});
  const [nivelesSeleccionados, setNivelesSeleccionados] = useState<
    Record<
      string,
      { id_nivel: number; nombre_nivel: string; registrado?: boolean }[]
    >
  >({});
  const [olimpistaError, setOlimpistaError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFetchData = useCallback(
    debounce(async (ci: string) => {
      if (!ci) {
        setAreasDisponibles({});
        setNivelesSeleccionados({});
        setOlimpistaError(null);
        return;
      }

      setLoading(true);
      setOlimpistaError(null);
      try {
        const response = await axios.get(
          `${API_URL}/olimpistas/${ci}/areas-niveles`,
        );

        if (!response.data || response.data.length === 0) {
          setAreasDisponibles({});
          setOlimpistaError('No se encontró un olimpista con esa cédula.');
          return;
        }

        const transformedData = response.data.reduce(
          (
            acc: Record<string, { id_nivel: number; nombre_nivel: string }[]>,
            area: any,
          ) => {
            acc[area.nombre_area] = area.niveles.map(
              (nivel: { id_nivel: number; nombre_nivel: string }) => ({
                id_nivel: nivel.id_nivel,
                nombre_nivel: nivel.nombre_nivel,
                registrado: false,
              }),
            );
            return acc;
          },
          {},
        );

        setAreasDisponibles(transformedData);
      } catch {
        setAreasDisponibles({});
        setOlimpistaError('No se encontró un olimpista con esa cédula.');
      } finally {
        setLoading(false);
      }
    }, 800),
    [],
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFetchInscripciones = useCallback(
    debounce(async (ci: string) => {
      if (!ci) {
        setNivelesSeleccionados({});
        return;
      }

      try {
        const response = await axios.get(
          `${API_URL}/olimpista/${ci}/inscripciones`,
        );

        if (!response.data || response.data.length === 0) {
          setNivelesSeleccionados({});
          return;
        }

        const inscripciones = response.data.inscripciones;
        const nivelesPorArea = inscripciones.reduce(
          (acc: any, inscripcion: any) => {
            const areaNombre = inscripcion.nivel.asociaciones[0].area.nombre;
            const nivel = {
              id_nivel: inscripcion.nivel.id_nivel,
              nombre_nivel: inscripcion.nivel.nombre,
              registrado: true,
            };

            if (!acc[areaNombre]) {
              acc[areaNombre] = [];
            }

            acc[areaNombre].push(nivel);
            return acc;
          },
          {},
        );

        setNivelesSeleccionados(nivelesPorArea);
      } catch (err) {
        console.error(err);
      }
    }, 800),
    [],
  );

  useEffect(() => {
    if (ciOlimpista) {
      debouncedFetchData(ciOlimpista);
      debouncedFetchInscripciones(ciOlimpista);
    } else {
      setAreasDisponibles({});
      setNivelesSeleccionados({});
    }

    return () => {
      debouncedFetchData.cancel();
      debouncedFetchInscripciones.cancel();
    };
  }, [ciOlimpista, debouncedFetchData, debouncedFetchInscripciones]);

  return {
    areasDisponibles,
    nivelesSeleccionados,
    setNivelesSeleccionados,
    olimpistaError,
    loading,
  };
}
