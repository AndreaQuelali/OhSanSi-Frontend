import { Button, Dropdown, Modal } from '../../../components';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useFetchData } from '@/hooks/use-fetch-data';
import axios from 'axios';
import { API_URL } from '@/config/api-config';
import { useNavigate } from 'react-router';
import { Table } from './table';

interface FormData {
  olympiad: string;
  area: string;
  level: string;
}

export default function FormLevelsArea() {
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
      olympiad: '',
      area: '',
      level: '',
    },
  });
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tableData, setTableData] = useState<
    { area: string; level: string; grade: string }[]
  >([]);
  const { data: olympiads } = useFetchData<
    { id_olimpiada: number; gestion: number }[]
  >(`${API_URL}/olimpiadas`);

  const { data: areas } = useFetchData<{ id_area: number; nombre: string }[]>(
    `${API_URL}/areas`,
  );
  const { data: levels } = useFetchData<{
    niveles: { id_nivel: number; nombre: string }[];
  }>(`${API_URL}/get-niveles`);

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
      (level) => level.id_nivel.toString() === data.level,
    )?.id_nivel;
    const olympiadId = olympiads?.find(
      (o) => o.gestion === currentYear,
    )?.id_olimpiada;

    if (!levelId || !olympiadId) {
      alert('Datos inválidos');
      return;
    }

    const payload = [
      {
        id_olimpiada: olympiadId,
        id_area: areaId,
        id_nivel: levelId,
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
    <div className="flex flex-col w-full">
      <div className="flex flex-col items-center">
        <form
          onSubmit={handleSubmit(() => setIsModalOpen(true))}
          className="mt-10 mb-32 mx-5 md:w-9/12 lg:w-9/12"
        >
          <div className="flex flex-col">
            <h1 className="text-center text-primary mb-8 headline-lg">
              Registro de Niveles/Categorías en Áreas de Olimpiada
            </h1>

            <div className="grid lg:grid-cols-3 lg:gap-9 mb-6">
              <Dropdown
                name="olympiad"
                label="Olimpiada"
                placeholder="Seleccionar año o gestión"
                className="w-full"
                options={
                  olympiads?.map((olimpiada) => ({
                    id: olimpiada.id_olimpiada.toString(),
                    name: olimpiada.gestion,
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
              Niveles/Categorías registradas en Áreas
            </h2>
            <div className="mt-2 md:w-11/12 mx-auto">
              <Table data={tableData} />
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
