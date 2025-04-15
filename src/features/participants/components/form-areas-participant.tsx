import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Button, InputText } from '@/components';
import { API_URL } from '@/config/api-config';
import CardArea from './card-area';
import IconClose from '@/components/icons/icon-close';
import { useFetchDataWithBody } from '@/hooks/use-fetch-with-body';

export default function FormAreaPart() {
  const {
    register,
    formState: { errors },
    watch,
  } = useForm({ mode: 'onBlur' });

  const [areasDisponibles, setAreasDisponibles] = useState<
    Record<string, { id_nivel: number; nombre_nivel: string }[]>
  >({});
  const [nivelesSeleccionados, setNivelesSeleccionados] = useState<
    Record<string, { id_nivel: number; nombre_nivel: string }[]>
  >({});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ciTutor = watch('tutor.ci');
  const ciOlimpista = watch('olimpista.ci');

  const { data: maxCategoriasData } = useFetchDataWithBody<{
    success: boolean;
    fecha: string;
    id_olimpiada: number;
    max_categorias_olimpista: number;
  }>(`${API_URL}/olimpiada/max-categorias?fecha=2025-05-27`, {
    method: 'GET',
  });

  const { data: totalInscripcionesData } = useFetchDataWithBody<{
    success: boolean;
    ci_olimpista: string;
    total_inscripciones: number;
  }>(
    ciOlimpista
      ? `${API_URL}/olimpista/${ciOlimpista}/total-inscripciones`
      : null,
    ciOlimpista
      ? {
          method: 'GET',
        }
      : undefined,
  );
  const maxCategorias = maxCategoriasData?.max_categorias_olimpista || 0;
  const totalInscripciones = totalInscripcionesData?.total_inscripciones || 0;

  const limiteAlcanzado =
    totalInscripciones + Object.keys(nivelesSeleccionados).length >=
    maxCategorias;

  useEffect(() => {
    const fetchAreasDisponibles = async () => {
      if (ciOlimpista) {
        setLoading(true);
        setError(null);
        try {
          const response = await axios.get(
            `${API_URL}/olimpistas/${ciOlimpista}/areas-niveles`,
          );

          const transformedData = response.data.reduce(
            (
              acc: Record<string, { id_nivel: number; nombre_nivel: string }[]>,
              area: {
                nombre_area: string;
                niveles: { id_nivel: number; nombre_nivel: string }[];
              },
            ) => {
              acc[area.nombre_area] = area.niveles.map(
                (nivel: { id_nivel: number; nombre_nivel: string }) => ({
                  id_nivel: nivel.id_nivel,
                  nombre_nivel: nivel.nombre_nivel,
                }),
              );
              return acc;
            },
            {},
          );

          setAreasDisponibles(transformedData);
        } catch {
          setError('Error al cargar las áreas disponibles.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAreasDisponibles();
  }, [ciOlimpista]);

  const handleAreaClick = (area: string) => {
    if (limiteAlcanzado) {
      alert('Ya has alcanzado el límite de áreas permitidas.');
      return;
    }
    setSelectedArea(area);
    setModalVisible(true);
  };

  const handleNivelSeleccionado = (
    area: string,
    nivel: { id_nivel: number; nombre_nivel: string },
  ) => {
    setNivelesSeleccionados((prev) => {
      const nivelesEnArea = prev[area] || [];
      const nivelYaSeleccionado = nivelesEnArea.some(
        (n) => n.id_nivel === nivel.id_nivel,
      );

      if (nivelYaSeleccionado) {
        return {
          ...prev,
          [area]: nivelesEnArea.filter((n) => n.id_nivel !== nivel.id_nivel),
        };
      } else {
        return {
          ...prev,
          [area]: [...nivelesEnArea, nivel],
        };
      }
    });
  };

  const handleRegistrar = async () => {
    if (!ciOlimpista) {
      alert('Por favor, ingrese la cédula del olimpista.');
      return;
    }

    const nivelesSeleccionadosIds = Object.values(nivelesSeleccionados)
      .flat()
      .map((nivel) => nivel.id_nivel);

    if (nivelesSeleccionadosIds.length === 0) {
      alert('Por favor, seleccione al menos un nivel.');
      return;
    }

    const payload = {
      ci: ciOlimpista,
      niveles: nivelesSeleccionadosIds,
      ci_tutor: ciTutor || null,
    };

    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(
        `${API_URL}/inscripciones-con-tutor`,
        payload,
      );

      alert('Registro exitoso');
      console.log('Response:', response.data);
    } catch (err) {
      console.error('Error:', err);
      setError('Error al registrar la inscripción.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-6">
      <div className="max-w-9/12 mx-auto w-full px-0 sm:px-6 md:px-0">
        <h2 className="text-primary text-lg sm:text-xl md:text-2xl font-semibold mb-6 md:text-center sm:text-left headline-lg">
          Registro de Olimpista en una o varias áreas de competencia
        </h2>
        <section className="grid grid-cols-1 md:grid-cols-2 items-center gap-4 mb-6 mt-10">
          <InputText
            label="Cédula de identidad del olimpista"
            name="olimpista.ci"
            placeholder="Ingresar ci del olimpista"
            className="w-full"
            register={register}
            validationRules={{
              required: 'La cédula es obligatoria',
              pattern: {
                value: /^(?! )[0-9]+(?<! )$/,
                message: 'Solo se permiten números y no puede haber espacios',
              },
            }}
            errors={errors}
          />
          <InputText
            label="Cédula de identidad del tutor académico (Opcional)"
            name="tutor.ci"
            placeholder="Ingresar ci del tutor académico"
            className="w-full"
            register={register}
            isRequired={false}
            validationRules={{
              pattern: {
                value: /^(?! )[0-9]+(?<! )$/,
                message: 'Solo se permiten números y no puede haber espacios',
              },
            }}
            errors={errors}
          />
        </section>
        <section className="min-h-[300px]">
          <h2 className="text-primary subtitle-lg text-center font-bold mb-6 md:text-left sm:text-left headline-lg">
            Áreas Disponibles
          </h2>
          {loading ? (
            <p className="text-center">Cargando áreas disponibles...</p>
          ) : error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : Object.keys(areasDisponibles).length === 0 ? (
            <p className="text-center text-gray-500 mt-4 text-lg font-roboto">
              No hay áreas disponibles aún. Por favor, ingrese la cédula del
              olimpista.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {Object.entries(areasDisponibles).map(([area, niveles]) => (
                <CardArea
                  key={area}
                  area={area}
                  niveles={niveles}
                  onClick={() => handleAreaClick(area)}
                  nivelesSeleccionados={nivelesSeleccionados[area] || []}
                />
              ))}
            </div>
          )}
        </section>

        {modalVisible && selectedArea && (
          <div className="fixed inset-0 bg-white bg-opacity-30 flex justify-center items-center z-50">
            <div className="relative bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <div
                className="absolute top-2 right-2 cursor-pointer text-gray-500 hover:text-gray-700"
                onClick={() => setModalVisible(false)}
              >
                <IconClose className="w-6 h-6" />
              </div>

              <h3 className="text-lg font-semibold mb-4">
                Seleccione un nivel para el área: {selectedArea}
              </h3>
              <ul>
                {areasDisponibles[selectedArea].map((nivel) => (
                  <li
                    key={nivel.id_nivel}
                    className={`cursor-pointer p-2 rounded ${
                      nivelesSeleccionados[selectedArea]?.some(
                        (n) => n.id_nivel === nivel.id_nivel,
                      )
                        ? 'bg-gray-300 text-gray-500'
                        : 'hover:bg-gray-200'
                    }`}
                    onClick={() => handleNivelSeleccionado(selectedArea, nivel)}
                  >
                    {nivel.nombre_nivel}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        <div className="flex flex-col-reverse md:flex-row md:justify-end md:space-x-5 mb-28">
          <Button
            label="Cancelar"
            variantColor="variant2"
            className="mt-5 md:mt-0"
            onClick={() => (window.location.href = '/')}
          />
          <Button
            type="button"
            label="Registrar"
            variantColor="variant1"
            onClick={handleRegistrar}
          />
        </div>
      </div>
    </div>
  );
}
