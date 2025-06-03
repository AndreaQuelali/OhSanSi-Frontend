import { Button, Dropdown, Modal } from '../../../components';
import { useForm } from 'react-hook-form';
import { useState, useEffect, useCallback } from 'react';
import { useFetchData } from '@/hooks/use-fetch-data';
import axios from 'axios';
import { API_URL } from '@/config/api-config';
import { useNavigate } from 'react-router';
import { Table } from './table';

interface FormData {
  level: string;
  gmin: string;
  gmax: string;
  olympiad: string;
}

export default function FormLevelsGrades() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    trigger,
    setValue,
  } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      level: '',
      gmin: '',
      gmax: '',
      olympiad: ''
    },
  });

  const navigate = useNavigate();
  const minGrade = watch('gmin');
  const selectedOlympiad = watch('olympiad');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tableData, setTableData] = useState<
    { id: number; area: string; level: string; grade: string }[]
  >([]);

  const { data: levels } = useFetchData<{
    niveles: { id_nivel: number; nombre: string }[];
  }>(`${API_URL}/get-niveles`);

  const { data: olympiads } = useFetchData<{
    id_olimpiada: number; gestion: number; nombre_olimpiada: string }[]
  >(`${API_URL}/olimpiadas`);

  const { data: grades } = useFetchData<
    {
      id_grado: number;
      nombre_grado: string;
    }[]
  >(`${API_URL}/grados`);

  useEffect(() => {
    if (minGrade) {
      trigger('gmax');
    }
  }, [minGrade, trigger]);

  useEffect(() => {
    if (minGrade === '12') {
      setValue('gmax', '');
    }
  }, [minGrade]);

  const fetchTableData = useCallback(async (olympiadId: number) => {
    if (!olympiadId) {
      return;
    }
    try {
      const response = await axios.get(`${API_URL}/grados-niveles/${olympiadId}`);
      const levelstable = response.data;

      const formatted = levelstable.map((nivel: any) => ({
        level: nivel.nombre_nivel,
        grade:
          nivel.grados.length > 1
            ? `${nivel.grados[0].nombre_grado} a ${
                nivel.grados[nivel.grados.length - 1].nombre_grado
              }`
            : nivel.grados[0].nombre_grado,
      }));
      setTableData(formatted);
    } catch (error) {
      console.error('Error al obtener los niveles con sus grados:', error);
    }

  }, []);

  useEffect(() => {
    if (selectedOlympiad) {
      console.log('Olimpiada seleccionada cambió a:', selectedOlympiad);
      fetchTableData(Number(selectedOlympiad));
    }
  }, [selectedOlympiad, fetchTableData]);

  const handleRegister = async (data: FormData) => {
    const levelId = levels?.niveles.find(
      (level) => level.id_nivel.toString() === data.level,
    )?.id_nivel;
    const gminId = Number(data.gmin);
    const gmaxId = data.gmax ? Number(data.gmax) : Number(data.gmin);
    const olympiadId = Number(data.olympiad);

    if (!levelId) {
      alert('Datos inválidos');
      return;
    }

    const response = await axios.get(`${API_URL}/grados-niveles`);
    const alreadyRegistered = response.data.some(
      (item: any) => item.id_nivel === levelId,
    );
    if (alreadyRegistered) {
      alert('Este nivel ya se encuentra asociado a grados');
      return;
    }

    try {
      const olimpResponse = await axios.get(`${API_URL}/olimpiadas`);
      const currentDate = new Date();

      const algunaEnInscripcion = olimpResponse.data.some((olimpiada: any) => {
        const fechaInicio = new Date(olimpiada.fecha_inicio);
        const fechaFin = new Date(olimpiada.fecha_fin);

        return currentDate >= fechaInicio && currentDate <= fechaFin;
      });

      if (algunaEnInscripcion) {
        alert(
          'No se puede registrar, la olimpiada está en etapa de inscripción',
        );
        return;
      }

      const dentroDePreparacion = olimpResponse.data.some((olimpiada: any) => {
        const creadoEn = new Date(olimpiada.creado_en);
        const fechaInicio = new Date(olimpiada.fecha_inicio);

        return currentDate >= creadoEn && currentDate < fechaInicio;
      });

      if (!dentroDePreparacion) {
        alert(
          'No se puede registrar fuera del periodo de preparación de las olimpiadas',
        );
        return;
      }
    } catch (error) {
      console.error('Error al verificar el estado de las olimpiadas:', error);
      alert(
        'No se pudo verificar la etapa de las olimpiadas. Intenta nuevamente.',
      );
      return;
    }

    const payload = {
      id_nivel: levelId,
      id_grado_min: gminId,
      id_grado_max: gmaxId,
      id_olimpiada: olympiadId,
    };
    setIsSubmitting(true);

    try {
      await axios.post(`${API_URL}/asociar-grados-nivel`, payload);
      alert('Nivel asociado a grados correctamente');
      window.location.reload();
    } catch (error) {
      console.error('Error al registrar:', error);
      alert('Error al registrar el nivel');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col items-center">
        <form
          onSubmit={handleSubmit(() => setIsModalOpen(true))}
          className="mt-10 mb-32 mx-5 md:w-9/12 lg:w-9/12"
        >
          <div className="flex flex-col">
            <h1 className="text-center text-primary mb-8 headline-lg">
              Asociación de Niveles/Categorías con Grados
            </h1>

            <div className="grid lg:grid-cols-4 lg:gap-9 mb-6">
              <Dropdown
                name="olympiad"
                label="Olimpiada"
                placeholder="Seleccionar olimpiada"
                className="w-full"
                options={
                  olympiads?.map((olimpiada) => ({
                    id: olimpiada.id_olimpiada.toString(),
                    name: `${olimpiada.gestion} - ${olimpiada.nombre_olimpiada}`,
                  })) || []
                }
                displayKey="name"
                valueKey="id"
                register={register}
                errors={errors}
                validationRules={{
                  required: 'Debe seleccionar un año/gestión',
                }}
              />
              <Dropdown
                label="Nivel/Categoría"
                className="w-full"
                name="level"
                placeholder="Seleccionar nivel o categoría"
                options={
                  levels?.niveles.map((level) => ({
                    id: level.id_nivel.toString(),
                    name: level.nombre,
                  })) || []
                }
                displayKey="name"
                valueKey="id"
                register={register}
                validationRules={{
                  required: 'Debe seleccionar un nivel o categoría',
                }}
                errors={errors}
              />
              <Dropdown
                name="gmin"
                label="Grado Min."
                placeholder="Seleccionar grado min"
                options={
                  grades
                    ? grades.map((grade) => ({
                        id: grade.id_grado.toString(),
                        name: grade.nombre_grado,
                      }))
                    : []
                }
                displayKey="name"
                valueKey="id"
                register={register}
                validationRules={{
                  required: 'Debe seleccionar el grado mínimo',
                }}
                errors={errors}
              />
              <div>
                <Dropdown
                  name="gmax"
                  label="Grado Max."
                  placeholder="Seleccionar grado max"
                  options={
                    grades
                      ? grades.slice(1).map((grade) => ({
                          id: grade.id_grado.toString(),
                          name: grade.nombre_grado,
                        }))
                      : []
                  }
                  displayKey="name"
                  valueKey="id"
                  register={register}
                  validationRules={{
                    validate: (value: string) => {
                      if (value === '') return true;

                      const minOrder = grades?.find(
                        (grade) => grade.id_grado.toString() === minGrade,
                      )?.id_grado;
                      const maxOrder = grades?.find(
                        (grade) => grade.id_grado.toString() === value,
                      )?.id_grado;

                      if (!minOrder) {
                        return 'Debe seleccionar primero el grado mínimo';
                      }

                      if (maxOrder && Number(maxOrder) <= Number(minOrder)) {
                        if (minGrade === '12') {
                          return 'El grado mínimo es el más alto';
                        }
                        return 'El grado máximo debe ser mayor al grado mínimo';
                      }

                      return true;
                    },
                  }}
                  errors={errors}
                  isRequired={false}
                  disablePlaceholder={false}
                  disabled={minGrade === '12'}
                />
              </div>
            </div>
            <div className="flex flex-col-reverse md:flex-row md:justify-end md:space-x-5">
              <Button
                label="Cancelar"
                variantColor="variant2"
                className="mt-5 md:mt-0"
                onClick={() => navigate('/')}
              />
              <Button
                label="Registrar"
                type="submit"
                disabled={!isValid || isSubmitting}
                variantColor={
                  !isValid || isSubmitting ? 'variantDesactivate' : 'variant1'
                }
              />
            </div>

            <h2 className="text-primary subtitle-md mt-7 md:mt-5">
              Niveles/Categorías asociadas con grados
            </h2>
            <div className="mt-2 md:w-11/12 mx-auto">
              {tableData.length > 0 ? (
                <Table data={tableData} />
              ) : selectedOlympiad ? (
                <p className="text-center py-4 text-neutral">
                  No hay asociacion de niveles con grados para esta olimpiada
                </p>
              ) : (
                <p className="text-center py-4 text-neutral">
                  Seleccione una olimpiada para ver datos
                </p>
              )}
            </div>
          </div>
        </form>
        {isModalOpen && (
          <Modal
            text="¿Está seguro de registrar los niveles?"
            onClose={() => setIsModalOpen(false)}
            onConfirm={handleSubmit(handleRegister)}
          />
        )}
      </div>
    </div>
  );
}
