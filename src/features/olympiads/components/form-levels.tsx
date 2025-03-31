import { Button, Dropdown, InputText, Modal } from '../../../components';
import AddIcon from '../icons/add';
import { Table } from './table';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useFetchData } from '@/hooks/use-fetch-data';
import axios from 'axios';
import { Area, FormData, TableRow } from '../interfaces/form-levels';
import { gradeOptions } from '@/utils/grade';

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
    },
  });

  const minGrade = watch('gmin');
  const [rows, setRows] = useState<TableRow[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para el modal
  const { data: areas } = useFetchData<Area[]>('/areas');

  useEffect(() => {
    if (minGrade) {
      trigger('gmax');
    }
  }, [minGrade, trigger]);

  const onSubmit = (data: FormData) => {
    setErrorMessage(null);

    const isDuplicate = rows.some(
      (row) => row.area === data.area && row.level === data.level,
    );

    if (isDuplicate) {
      setErrorMessage('Este nivel/categoría ya se encuentra agregado');
      return;
    }

    const selectedArea =
      areas?.find((area) => area.id_area.toString() === data.area)?.nombre ||
      '';

    const newRow: TableRow = {
      id: Date.now(),
      area: selectedArea,
      level: data.level,
      grade: data.gmax ? `${data.gmin} - ${data.gmax}` : `${data.gmin}`,
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
      for (const row of rows) {
        const areaId = areas?.find((area) => area.nombre === row.area)?.id_area;
        const [grado_min, grado_max] = row.grade.split(' - ').map(Number);

        const payload = {
          nombre: row.level,
          id_area: areaId,
          grado_min,
          grado_max: grado_max || grado_min,
        };

        await axios.post('http://localhost:8000/api/niveles', payload, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }

      alert('Niveles registrados correctamente');
      setRows([]);
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
                areas
                  ? areas.map((area) => ({
                      id: area.id_area.toString(),
                      name: area.nombre,
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
                required: 'El nivel/categoría es obligatorio',
                pattern: {
                  value:
                    /^(?! )[A-Za-zÑñÁÉÍÓÚáéíóú0-9]+(?: *(?:- *)[A-Za-zÑñÁÉÍÓÚáéíóú0-9]+)?(?: [A-Za-zÑñÁÉÍÓÚáéíóú0-9]+(?: *(?:- *)[A-Za-zÑñÁÉÍÓÚáéíóú0-9]+)?)*(?<! )$/,
                  message:
                    'Solo se permiten letras, números, guion en medio y un solo espacio entre palabras',
                },
              }}
              errors={errors}
            />
            <Dropdown
              name="gmin"
              label="Grado Min."
              placeholder="Seleccionar grado min"
              className="h-[50px]"
              options={gradeOptions}
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
              options={[{ id: '', name: '' }, ...gradeOptions]} 
              displayKey="name"
              valueKey="id"
              register={register}
              validationRules={{
                validate: (value: string) => {
                  if (value === '') return true; // Permitir deseleccionar sin error
                  if (!minGrade)
                    return 'Debe seleccionar primero el grado mínimo';
                  if (parseInt(value) <= parseInt(minGrade)) {
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

          <div className="min-h-[24px] flex mt-2">
            {errorMessage && (
              <p className="text-error subtitle-sm">{errorMessage}</p>
            )}
          </div>
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
