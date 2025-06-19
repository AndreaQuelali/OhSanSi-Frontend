import { useState, useCallback, useEffect } from 'react';
import { debounce } from 'lodash';
import { ParticipantApiService } from '../services/participant-api';

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
        const response = await ParticipantApiService.getOlimpistAreasLevels(ci);
        if (!response.data || response.data.length === 0) {
          setAreasDisponibles({});
          setOlimpistaError('No hay áreas disponibles para esa cédula.');
          setLoading(false);
          return;
        }
        const transformedData = response.data.reduce(
          (
            acc: Record<string, { id_nivel: number; nombre_nivel: string }[]>,
            area: any,
          ) => {
            acc[area.area_name] = area.levels.map(
              (nivel: { level_id: number; level_name: string }) => ({
                id_nivel: nivel.level_id,
                nombre_nivel: nivel.level_name ?? 'Nivel sin nombre',
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
      const response = await ParticipantApiService.getOlimpistEnrollments(ci);
      let nivelesRegistrados: Record<
        string,
        { id_nivel: number; nombre_nivel: string; registrado: boolean }[]
      > = {};
      if (
        response.data &&
        response.data.data &&
        response.data.data.enrollments
      ) {
        const inscripciones = response.data.data.enrollments;
        nivelesRegistrados = inscripciones.reduce(
          (acc: any, inscripcion: any) => {
            const areaNombre = inscripcion.area.area_name;
            const nivel = {
              id_nivel: inscripcion.level.level_id,
              nombre_nivel: inscripcion.level.level_name ?? 'Nivel sin nombre',
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
