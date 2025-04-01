import { Button, Dropdown, InputText, Modal } from '../../../components';
import AddIcon from '../icons/add';
import { Table } from './table';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useFetchData } from '@/hooks/use-fetch-data';
import axios from 'axios';
import { FormData, TableRow } from '../interfaces/form-levels';
import { API_URL } from '@/config/api-config';

export default function FormLevels() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    trigger,
    setError,
    clearErrors,
  } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      area: '',
      gmin: '',
      gmax: '',
    },
  });

  const minGrade = watch('gmin');
  const [rows, setRows] = useState<TableRow[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: areasData } = useFetchData<
    {
      id_area: number;
      nombre_area: string;
      niveles: {
        id_nivel: number;
        nombre_nivel: string;
      }[];
    }[]
  >(`${API_URL}/areas-niveles-grados`);

  const { data: grades } = useFetchData<
    {
      id_grado: number;
      nombre_grado: string;
      nivel_academico: string;
      orden: number;
    }[]
  >(`${API_URL}/grados`);

  useEffect(() => {
    if (minGrade) {
      trigger('gmax');
    }
  }, [minGrade, trigger]);

  const onSubmit = (data: FormData) => {
    clearErrors('level');

    const isDuplicateInTable = rows.some(
      (row) =>
        row.area ===
          areasData?.find((area) => area.id_area.toString() === data.area)
            ?.nombre_area &&
        row.level.toLowerCase() === data.level.toLowerCase(),
    );

    if (isDuplicateInTable) {
      setError('level', {
        type: 'manual',
        message: 'Este nivel ya existe en la tabla para el área seleccionada.',
      });
      return;
    }

    const area = areasData?.find(
      (area) => area.id_area.toString() === data.area,
    );
    const nivelExiste = area?.niveles.some(
      (nivel) => nivel.nombre_nivel.toLowerCase() === data.level.toLowerCase(),
    );

    if (nivelExiste) {
      setError('level', {
        type: 'manual',
        message: 'Este nivel ya existe en el área seleccionada.',
      });
      return;
    }

    const selectedArea =
      areasData?.find((area) => area.id_area.toString() === data.area)
        ?.nombre_area || '';

    const minGradeName =
      grades?.find((grade) => grade.id_grado.toString() === data.gmin)
        ?.nombre_grado || '';
    const maxGradeName =
      grades?.find((grade) => grade.id_grado.toString() === data.gmax)
        ?.nombre_grado || '';

    const newRow: TableRow = {
      id: Date.now(),
      area: selectedArea,
      level: data.level,
      grade: maxGradeName
        ? `${minGradeName} - ${maxGradeName}`
        : `${minGradeName}`,
    };

    setRows([...rows, newRow]);
  };
  const handleRegister = async () => {
    if (rows.length === 0) {
      alert('Debe agregar al menos un nivel/categoría.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = rows.map((row) => {
        const areaId = areasData?.find(
          (area) => area.nombre_area === row.area,
        )?.id_area;
        const [grado_min_name, grado_max_name] = row.grade.split(' - ');
        const grado_min = grades?.find(
          (grade) => grade.nombre_grado === grado_min_name,
        )?.id_grado;
        const grado_max =
          grades?.find((grade) => grade.nombre_grado === grado_max_name)
            ?.id_grado || grado_min;

        return {
          nombre: row.level,
          id_area: areaId,
          grado_min,
          grado_max,
        };
      });

      await axios.post(`${API_URL}/niveles`, payload);

      alert('Niveles registrados correctamente');
      setRows([]);
      window.location.reload();
    } catch (error: any) {
      console.error('Error al registrar los niveles:', error);
      alert('Ocurrió un error al registrar los niveles.');
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleDeleteRow = (id: number) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  return (
    <div className="flex flex-col justify-center items-center h-[78vh]">
      <div className="flex flex-col items-center justify-center flex-grow">
        <form onSubmit={handleSubmit(onSubmit)}>
          <h1 className="text-center text-primary mb-10 headline-lg">
            Registro de Niveles/Categorías de Olimpiada
          </h1>
          <div className="px-10 md:px-3 lg:px-0 flex flex-col md:flex-row justify-between gap-6">
            <Dropdown
              name="area"
              label="Área"
              className="w-[340px] h-[50px]"
              placeholder="Seleccionar área"
              options={
                areasData
                  ? areasData.map((area) => ({
                      id: area.id_area.toString(),
                      name: area.nombre_area,
                    }))
                  : []
              }
              displayKey="name"
              valueKey="id"
              register={register}
              validationRules={{
                required: 'Debe seleccionar el área',
              }}
              errors={errors}
            />

            <InputText
              label="Nivel/Categoría"
              className="w-[340px]"
              name="level"
              placeholder="Ingresar nivel/categoria"
              type="text"
              register={register}
              validationRules={{
                required: 'El nombre es obligatorio',
                pattern: {
                  value: /^[A-Za-z0-9]+(?: [A-Za-z0-9]+)*$/,
                  message: 'Solo se permiten letras y números',
                },
              }}
              errors={errors}
            />
            <Dropdown
              name="gmin"
              label="Grado Min."
              placeholder="Seleccionar grado min"
              className="h-[50px]"
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
              className="h-[50px]"
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
                  )?.orden;
                  const maxOrder = grades?.find(
                    (grade) => grade.id_grado.toString() === value,
                  )?.orden;
                  if (!minOrder)
                    return 'Debe seleccionar primero el grado mínimo';
                  if (maxOrder && maxOrder <= minOrder) {
                    return 'El grado máximo debe ser mayor al grado mínimo';
                  }
                  return true;
                },
              }}
              errors={errors}
              isRequired={false}
            />
          </div>
          <Button
            label="Agregar"
            className="w-full"
            icon={AddIcon}
            type="submit"
            disabled={!isValid}
            variantColor={!isValid ? 'variantDesactivate' : 'variant1'}
          />
          <div className="w-full min-h-[180px]">
            <Table data={rows} onDeleteRow={handleDeleteRow} />
          </div>
          <div className="mx-auto w-full flex justify-end gap-4">
            <Button label="Cancelar" variantColor="variant2" />
            <Button
              label="Registrar"
              disabled={rows.length === 0 || isSubmitting}
              variantColor={
                rows.length === 0 || isSubmitting
                  ? 'variantDesactivate'
                  : 'variant1'
              }
              onClick={() => setIsModalOpen(true)}
            />
          </div>
        </form>
      </div>

      {isModalOpen && (
        <Modal
          text="¿Está seguro de registrar los niveles?"
          onClose={() => setIsModalOpen(false)}
          onConfirm={async () => {
            setIsModalOpen(false);
            await handleRegister();
          }}
        />
      )}
    </div>
  );
}
