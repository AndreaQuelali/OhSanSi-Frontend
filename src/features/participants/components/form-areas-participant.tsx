import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Button, InputText } from '@/components';
import { API_URL } from '@/config/api-config';
import CardArea from './card-area';
import IconClose from '@/components/icons/icon-close';
import { useFetchDataWithBody } from '@/hooks/use-fetch-with-body';
import { formattedDate } from '@/utils/date';
import { debounce } from 'lodash';

export default function FormAreaPart() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid: formFieldsValid }, 
    watch,
  } = useForm({
    mode: 'all', 
    defaultValues: {
      'olimpista.ci': '',
      'tutor.ci': '',
    },
  });

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
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [olimpistaError, setOlimpistaError] = useState<string | null>(null);
  const [tutorError, setTutorError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formIsValid, setFormIsValid] = useState(false);

  const ciTutor = watch('tutor.ci');
  const ciOlimpista = watch('olimpista.ci');

  const { data: maxCategoriasData } = useFetchDataWithBody<{
    success: boolean;
    fecha: string;
    id_olimpiada: number;
    max_categorias_olimpista: number;
  }>(`${API_URL}/olimpiada/max-categorias?fecha=${formattedDate}`, {
    method: 'GET',
  });
  const maxCategorias = maxCategoriasData?.max_categorias_olimpista || 0;

  const limiteAlcanzado =
    Object.keys(nivelesSeleccionados).length >= maxCategorias;

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
            area: {
              nombre_area: string;
              niveles: { id_nivel: number; nombre_nivel: string }[];
            },
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
          (
            acc: Record<
              string,
              { id_nivel: number; nombre_nivel: string; registrado: boolean }[]
            >,
            inscripcion: any,
          ) => {
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
      debouncedFetchInscripciones(ciOlimpista);
    } else {
      setNivelesSeleccionados({});
    }
    return () => {
      debouncedFetchInscripciones.cancel();
    };
  }, [ciOlimpista, debouncedFetchInscripciones]);

  useEffect(() => {
    const verificarTutor = async () => {
      if (!ciTutor) {
        setTutorError(null);
        return;
      }

      try {
        const response = await axios.get(
          `${API_URL}/tutores/cedula/${ciTutor}`,
        );

        if (response.data.status === 200) {
          setTutorError(null);
        }
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          setTutorError('El tutor con esta cédula no existe.');
        } else {
          console.error('Error al verificar el tutor:', err);
        }
      }
    };

    verificarTutor();
  }, [ciTutor]);

  const handleRegistrar = async () => {
    if (!ciOlimpista) {
      alert('Por favor, ingrese la cédula del olimpista.');
      return;
    }

    const nivelesNuevos = Object.values(nivelesSeleccionados)
      .flat()
      .filter((nivel) => !nivel.registrado)
      .map((nivel) => nivel.id_nivel);

    if (nivelesNuevos.length === 0) {
      alert('No hay nuevos niveles para registrar.');
      return;
    }

    const payload = {
      ci: ciOlimpista,
      niveles: nivelesNuevos,
      ci_tutor: ciTutor || null,
    };

    try {
      const response = await axios.post(
        `${API_URL}/inscripciones-con-tutor`,
        payload,
      );

      alert('Registro exitoso');
      console.log('Response:', response.data);
      window.location.href = '/register-selected-areas';
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const [nivelesSeleccionadosTemp, setNivelesSeleccionadosTemp] = useState<
    { id_nivel: number; nombre_nivel: string; registrado?: boolean }[]
  >([]);

  const handleNivelToggle = (nivel: {
    id_nivel: number;
    nombre_nivel: string;
    registrado?: boolean;
  }) => {
    if (nivel.registrado) {
      alert('No puedes deseleccionar un nivel ya registrado.');
      return;
    }

    setNivelesSeleccionadosTemp((prev) => {
      const nivelYaSeleccionado = prev.some(
        (n) => n.id_nivel === nivel.id_nivel,
      );
      if (nivelYaSeleccionado) {
        return prev.filter((n) => n.id_nivel !== nivel.id_nivel);
      } else {
        return [...prev, nivel];
      }
    });
  };

  const handleModalAceptar = () => {
    if (selectedArea) {
      const nivelesRegistrados = nivelesSeleccionadosTemp.filter(
        (nivel) => nivel.registrado,
      );

      if (
        nivelesRegistrados.length > 0 &&
        nivelesRegistrados.length === nivelesSeleccionadosTemp.length
      ) {
        alert('No puedes deseleccionar un área completamente registrada.');
        setModalVisible(false);
        return;
      }

      setNivelesSeleccionados((prev) => {
        if (nivelesSeleccionadosTemp.length === 0) {
          const nivelesRegistrados = nivelesSeleccionados[selectedArea]?.filter(
            (n) => n.registrado,
          );
          if (nivelesRegistrados?.length > 0) {
            return {
              ...prev,
              [selectedArea]: nivelesRegistrados,
            };
          } else {
            const { [selectedArea]: _, ...rest } = prev;
            return rest;
          }
        } else {
          return {
            ...prev,
            [selectedArea]: nivelesSeleccionadosTemp,
          };
        }
      });
    }
    setModalVisible(false);
  };
  const handleModalCancelar = () => {
    setModalVisible(false);
    setNivelesSeleccionadosTemp([]);
  };

  const handleAreaClick = (area: string) => {
    const seleccionados = nivelesSeleccionados[area] || [];

    if (seleccionados.length === 0 && limiteAlcanzado) {
      alert('Ya has alcanzado el límite de áreas permitidas.');
      return;
    }

    setSelectedArea(area);
    setNivelesSeleccionadosTemp([...seleccionados]);
    setModalVisible(true);
  };

  useEffect(() => {
    const checkFormValidity = () => {
      const hasNewSelections = Object.values(nivelesSeleccionados)
        .flat()
        .some((nivel) => !nivel.registrado);

      const hayAreasDisponibles = Object.keys(areasDisponibles).length > 0;

      console.log({
        formFieldsValid, 
        hasNewSelections,
        hayAreasDisponibles,
        olimpistaError,
        tutorError,
      });

      return (
        formFieldsValid &&
        !olimpistaError &&
        !tutorError &&
        hasNewSelections &&
        hayAreasDisponibles
      );
    };

    setFormIsValid(checkFormValidity());
  }, [
    formFieldsValid,
    nivelesSeleccionados,
    areasDisponibles,
    olimpistaError,
    tutorError,
  ]);

  return (
    <div className="my-6">
      <form
        onSubmit={handleSubmit(handleRegistrar)}
        className="max-w-9/12 mx-auto w-full px-0 sm:px-6 md:px-0"
      >
        <h2 className="text-primary text-lg sm:text-xl md:text-2xl font-semibold mb-6 md:text-center sm:text-left headline-lg">
          Registro de Olimpista en una o varias áreas de competencia
        </h2>
        <section className="grid grid-cols-1 md:grid-cols-2 items-start gap-4 mb-6 mt-10">
          <div className="flex flex-col">
            <InputText
              label="Cédula de identidad del olimpista"
              name="olimpista.ci"
              placeholder="Ingresar ci del olimpista"
              className="w-full"
              register={register}
              validationRules={{
                required: 'Debe ingresar la cédula del olimpista.',
                pattern: {
                  value: /^(?! )[0-9]+(?<! )$/,
                  message:
                    'Solo se permiten números y no puede haber espacios.',
                },
              }}
              errors={errors}
            />
          </div>
          <div className="flex flex-col">
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
                  message:
                    'Solo se permiten números y no puede haber espacios.',
                },
              }}
              errors={errors}
            />
            {tutorError && (
              <p className="text-error subtitle-sm text-wrap mt-[-22px]">
                {tutorError}
              </p>
            )}
          </div>
        </section>
        <section className="min-h-[300px]">
          <h2 className="text-primary subtitle-lg text-center font-bold mb-6 md:text-left sm:text-left headline-lg">
            Áreas Disponibles
          </h2>
          {loading ? (
            <p className="text-center">Cargando áreas disponibles...</p>
          ) : olimpistaError ? (
            <p className="text-error text-center">{olimpistaError}</p>
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
                onClick={handleModalCancelar}
              >
                <IconClose className="w-6 h-6" />
              </div>

              <h3 className="text-lg font-semibold mb-4">
                Seleccione un nivel para el área: {selectedArea}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {areasDisponibles[selectedArea].map((nivel) => (
                  <div
                    key={nivel.id_nivel}
                    className={`flex justify-center p-3 rounded-lg cursor-pointer border ${
                      nivelesSeleccionadosTemp.some(
                        (n) => n.id_nivel === nivel.id_nivel,
                      )
                        ? nivel.registrado
                          ? 'bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed'
                          : 'bg-primary text-white border-primary'
                        : 'bg-gray-100 text-gray-700 border-gray-300'
                    }`}
                    onClick={() => {
                      if (nivel.registrado) {
                        alert(
                          'Este nivel ya está registrado y no se puede deseleccionar.',
                        );
                      } else {
                        handleNivelToggle(nivel);
                      }
                    }}
                  >
                    <p>{nivel.nombre_nivel}</p>
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-4 mt-4">
                <Button
                  label="Cancelar"
                  variantColor="variant2"
                  onClick={handleModalCancelar}
                />
                <Button
                  label="Aceptar"
                  variantColor="variant1"
                  onClick={handleModalAceptar}
                />
              </div>
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
            type="submit"
            label="Registrar"
            disabled={!formIsValid}
            variantColor={!formIsValid ? 'variantDesactivate' : 'variant1'}
          />
        </div>
      </form>
    </div>
  );
}
