import { Button, InputText, Modal } from '../../../components';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import CardUploadImage from './card-upload-image';
import { TableAreas } from './table-areas';
import { useFetchData } from '@/hooks/use-fetch-data';
import axios from 'axios';
import { API_URL } from '@/config/api-config';

type FormData = {
  inputArea: string;
};

type TableRow = {
  id: number;
  area: string;
  nombre?: string;
};

const FormAreas = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setError,
    clearErrors,
    reset,
  } = useForm<FormData>({
    mode: 'onChange',
  });

  const [image, setImage] = useState<File | null>(null);
  const [rows, setRows] = useState<TableRow[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: apiAreas } = useFetchData<TableRow[]>('/areas');

  const areas = (apiAreas || []).map((area) => ({
    id: area.id,
    area: String(area.area || area.nombre),
  }));

  const onSubmit = (data: FormData) => {
    clearErrors('inputArea');

    const isDuplicateInTable = rows.some(
      (row) => row.area.toLowerCase() === data.inputArea.toLowerCase(),
    );

    if (isDuplicateInTable) {
      setError('inputArea', {
        type: 'manual',
        message: 'Esta área ya se encuentra agregada en la tabla.',
      });
      return;
    }

    const isDuplicateInDatabase = areas.some(
      (area) => area.area.toLowerCase() === data.inputArea.toLowerCase(),
    );

    if (isDuplicateInDatabase) {
      setError('inputArea', {
        type: 'manual',
        message: 'Esta área ya existe en la base de datos.',
      });
      return;
    }

    const newRow: TableRow = {
      id: Date.now(),
      area: data.inputArea,
    };
    setRows([...rows, newRow]);
  };

  const handleDeleteRow = (id: number) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleRegister = async () => {
    setIsModalOpen(false);

    if (rows.length === 0) {
      alert('Debe agregar al menos un área para registrar.');
      return;
    }
    if (!image) {
      alert('Debe cargar una imagen para registrar las áreas.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('id_olimpiada', '1');
      formData.append('imagen', image); 
      formData.append(
        'areas',
        JSON.stringify(rows.map((row) => ({ nombre: row.area }))),
      );

      await axios.post(`${API_URL}/areas`, formData);

      alert('Áreas registradas correctamente');
      setRows([]); 
      setImage(null); 
      reset();
      window.location.reload();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Error al enviar los datos:', error);
      alert(
        error.response?.data?.message ||
          'Ocurrió un error al registrar las áreas.',
      );
    }
  };

  return (
    <div className="my-5 mx-10 md:mx-0 lg:mx-0 flex flex-col items-center justify-center h-full">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col">
          <h1 className="text-center headline-lg text-primary">
            Registro de Áreas de Competencia de Olimpiada
          </h1>
          <h1 className="text-center headline-md text-primary">Gestión 2025</h1>
          <div className="flex flex-col md:flex-row md:justify-between my-7 md:gap-9">
            <div>
              <InputText
                label="Nombre del Área"
                name="inputArea"
                placeholder="Ingrese nombre del área"
                type="text"
                className="w-full md:w-[250px] lg:w-[580px]"
                labelPadding="py-5"
                register={register}
                errors={errors}
                validationRules={{
                  required: 'El nombre es obligatorio',
                  pattern: {
                    value:
                      /^(?!-)(?! )[A-Za-zÑñÁÉÍÓÚáéíóú-]+(?: [A-Za-zÑñÁÉÍÓÚáéíóú-]+)*(?<!-)(?<! )$/,
                    message:
                      'Solo se permiten letras, guion en medio y un solo espacio entre palabras',
                  },
                  maxLength: {
                    value: 50,
                    message: 'El nombre no puede exceder los 50 caracteres',
                  },
                }}
              />
            </div>
            <div className="md:w-[350px] lg:w-[450px]">
              <CardUploadImage
                onChange={(file) => {
                  if (rows.length > 0) {
                    setImage(file || image);
                  } else {
                    setImage(file);
                  }
                }}
              />
            </div>
          </div>
          <Button
            type="submit"
            label="Agregar"
            disabled={!isValid || !image}
            variantColor={
              !isValid || !image ? 'variantDesactivate' : 'variant1'
            }
          />
          <div className="w-full md:min-h-[150px] flex items-center justify-center">
            {rows.length === 0 ? (
              <p className="text-center body-md text-primary">
                No hay áreas agregadas.
              </p>
            ) : (
              <TableAreas data={rows} onDeleteRow={handleDeleteRow} />
            )}
          </div>
          <div className="flex flex-col md:flex-row md:justify-end space-y-5 md:space-x-5">
            <Button label="Cancelar" variantColor="variant2" />
            <Button
              label="Registrar"
              disabled={rows.length === 0}
              variantColor={
                rows.length === 0 ? 'variantDesactivate' : 'variant1'
              }
              onClick={() => setIsModalOpen(true)}
            />
          </div>
        </div>
      </form>

      {isModalOpen && (
        <Modal
          text="¿Está seguro de registrar las áreas?"
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleRegister}
        />
      )}
    </div>
  );
};

export default FormAreas;
