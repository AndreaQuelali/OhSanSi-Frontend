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
          `${API_URL}/olympists/${ci}/areas-levels`,
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

        fetchInscripcionesYCombinar(ci, transformedData);
      } catch {
        setAreasDisponibles({});
        setOlimpistaError('No se encontró un olimpista con esa cédula.');
        setLoading(false);
      }
    }, 800),
    [],
  );

  const fetchInscripcionesYCombinar = async (
    ci: string,
    areasDisp: Record<
      string,
      { id_nivel: number; nombre_nivel: string; registrado?: boolean }[]
    >,
  ) => {
    try {
      const response = await axios.get(
        `${API_URL}/olympists/${ci}/enrollments`,
      );

      let nivelesRegistrados: Record<
        string,
        { id_nivel: number; nombre_nivel: string; registrado: boolean }[]
      > = {};

      if (
        response.data &&
        response.data.data &&
        response.data.data.inscripciones
      ) {
        const inscripciones = response.data.data.inscripciones;

        nivelesRegistrados = inscripciones.reduce(
          (acc: any, inscripcion: any) => {
            const areaNombre = inscripcion.area.nombre;
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
      }

      const areasActualizadas = { ...areasDisp };

      Object.keys(nivelesRegistrados).forEach((areaNombre) => {
        if (areasActualizadas[areaNombre]) {
          areasActualizadas[areaNombre] = areasActualizadas[areaNombre].map(
            (nivel) => {
              const nivelRegistrado = nivelesRegistrados[areaNombre].find(
                (n) => n.id_nivel === nivel.id_nivel,
              );
              return nivelRegistrado ? { ...nivel, registrado: true } : nivel;
            },
          );
        } else {
          areasActualizadas[areaNombre] = nivelesRegistrados[areaNombre];
        }
      });

      setAreasDisponibles(areasActualizadas);
      setNivelesSeleccionados(nivelesRegistrados);
      setLoading(false);
    } catch (err) {
      console.error('Error al obtener inscripciones:', err);
      setAreasDisponibles(areasDisp);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ciOlimpista) {
      debouncedFetchData(ciOlimpista);
    } else {
      setAreasDisponibles({});
      setNivelesSeleccionados({});
    }

    return () => {
      debouncedFetchData.cancel();
    };
  }, [ciOlimpista, debouncedFetchData]);

  return {
    areasDisponibles,
    nivelesSeleccionados,
    setNivelesSeleccionados,
    olimpistaError,
    loading,
  };
}
