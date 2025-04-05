import { Button, Dropdown, Modal } from '../../../components';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useFetchData } from '@/hooks/use-fetch-data';
import axios from 'axios';
import { API_URL } from '@/config/api-config';
import { useNavigate } from 'react-router';
import { Table } from './table';

interface FormData {
  area: string;
  level: string;
  gmin: string;
  gmax: string;
  year: string;
}

export default function FormLevels() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    trigger,
  } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      area: '',
      gmin: '',
      gmax: '',
      year: '',
    },
  });

  const navigate = useNavigate();
  const minGrade = watch('gmin');
  const selectedYear = watch('year');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tableData, setTableData] = useState<
    { area: string; level: string; grade: string }[]
  >([]);

  const { data: olympiads } = useFetchData<
    {
      id_olimpiada: number;
      gestion: number;
    }[]
  >(`${API_URL}/olimpiadas`);

  const { data: areas } = useFetchData<{ id_area: number; nombre: string }[]>(
    `${API_URL}/areas`,
  );
  const { data: levels } = useFetchData<{
    niveles: { id_nivel: number; nombre: string }[];
  }>(`${API_URL}/get-niveles`);

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
    if (selectedYear) {
      const olympiadId = olympiads?.find(
        (o) => o.gestion.toString() === selectedYear,
      )?.id_olimpiada;

      if (olympiadId) {
        fetchTableData(olympiadId);
      }
    }
  }, [selectedYear, olympiads]);

  const fetchTableData = async (olympiadId: number) => {
    try {
      const response = await axios.get(
        `${API_URL}/estructura-olimpiada/${olympiadId}`,
      );
      const estructura = response.data.estructura;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const formattedData = estructura.flatMap((area: any, areaIndex: number) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        area.niveles.map((nivel: any, nivelIndex: number) => ({
          id: areaIndex * 100 + nivelIndex, // Generate a unique id
          area: area.nombre_area,
          level: nivel.nombre_nivel,
          grade:
            nivel.grados.length > 1
              ? `${nivel.grados[0].nombre_grado} a ${
                  nivel.grados[nivel.grados.length - 1].nombre_grado
                }`
              : nivel.grados[0].nombre_grado,
        })),
      );

      setTableData(formattedData);
    } catch (error) {
      console.error('Error al cargar la estructura de la olimpiada:', error);
    }
  };

  const handleRegister = async (data: FormData) => {
    console.log('Datos enviados:', data);

    const areaId = Number(data.area);
    const levelId = levels?.niveles.find(
      (level) => level.id_nivel.toString() === data.level, // Cambiado para comparar con id_nivel
    )?.id_nivel;
    const olympiadId = olympiads?.find(
      (o) => o.gestion.toString() === selectedYear,
    )?.id_olimpiada;

    const grados = [Number(data.gmin)];
    if (data.gmax) {
      grados.push(Number(data.gmax));
    }

    if (!levelId || !olympiadId) {
      alert('Datos inválidos');
      return;
    }

    const payload = [
      {
        id_olimpiada: olympiadId,
        id_area: areaId,
        id_nivel: levelId,
        grados,
      },
    ];

    setIsSubmitting(true);

    try {
      await axios.post(`${API_URL}/niveles`, payload);
      alert('Nivel registrado correctamente');
      window.location.reload();
    } catch (error) {
      console.error('Error al registrar:', error);
      alert('Error al registrar el nivel');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="flex flex-col items-center mx-10 md:mx-5 lg:mx-0">
      <form
        onSubmit={handleSubmit(() => setIsModalOpen(true))}
        className="mt-10 mb-32"
      >
        <div className="flex flex-col">
          <div className='flex justify-between items-center mb-8'>
            <h1 className="text-center text-primary mb-8 headline-lg">
              Registro de Niveles/Categorías en Áreas de Olimpiada
            </h1>
            <Dropdown
              name="year"
              label="Año"
              placeholder="Seleccionar año"
              options={
                olympiads?.map((olympiad) => ({
                  id: olympiad.gestion.toString(),
                  name: olympiad.gestion.toString(),
                })) || []
              }
              displayKey="name"
              valueKey="id"
              register={register}
              validationRules={{
                required: 'Debe seleccionar un año',
              }}
              errors={errors}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-9 mb-6">
            <Dropdown
              name="area"
              label="Área"
              className="w-full"
              placeholder="Seleccionar área"
              options={
                areas?.map((area) => ({
                  id: area.id_area.toString(),
                  name: area.nombre,
                })) || []
              }
              displayKey="name"
              valueKey="id"
              register={register}
              validationRules={{
                required: 'Debe seleccionar un área',
              }}
              errors={errors}
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
            <Dropdown
              name="gmax"
              label="Grado Max."
              placeholder="Seleccionar grado max"
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
                    return 'El grado máximo debe ser mayor al grado mínimo';
                  }

                  return true;
                },
              }}
              errors={errors}
              isRequired={false}
            />
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
          <div className="w-full min-h-[180px]">
            <Table
              data={tableData}
              columns={[
                { header: 'Área', accessor: 'area' },
                { header: 'Nivel/Categoría', accessor: 'level' },
                { header: 'Grados', accessor: 'grade' },
              ]}
            />
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
  );
}
