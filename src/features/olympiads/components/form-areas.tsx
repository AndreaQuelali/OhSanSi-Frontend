import { Button, InputText, Modal } from '../../../components';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import CardUploadImage from './card-upload-image';
import { TableAreas } from './table-areas';
import { useFetchData } from '@/hooks/use-fetch-data';
import axios from 'axios';

type FormData = {
  inputArea: string;
};

type TableRow = {
  id: number;
  area: string;
  [x: string]: string | number;
};

const FormAreas = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    mode: 'onChange',
  });

  const [image, setImage] = useState<File | null>(null);
  const [rows, setRows] = useState<TableRow[]>([]); // Áreas temporales
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: apiAreas, loading, error } = useFetchData<TableRow[]>('/areas');

  const areas = (apiAreas || []).map((area) => ({
    id: area.id, 
    area: area.area || area.nombre, 
  }));

  const handleRegister = async () => {
    setIsModalOpen(false);
    if (rows.length === 0 || !image) {
      alert('Debe agregar al menos un área y una imagen.');
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

      await axios.post('http://127.0.0.1:8000/api/areas', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Áreas registradas correctamente');
      setRows([]);
      setImage(null);
    } catch (error: any) {
      console.error('Error al enviar los datos:', error);
      alert(
        error.response?.data?.message ||
          'Ocurrió un error al registrar las áreas.',
      );
    }
  };

  const onSubmit = (data: FormData) => {
    setErrorMessage(null);

    const isDuplicate = rows.some(
      (row) => row.area.toLowerCase() === data.inputArea.toLowerCase(),
    );
    if (isDuplicate) {
      setErrorMessage('Esta área ya se encuentra agregada');
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
                }}
              />
            </div>
            <div className="md:w-[350px] lg:w-[450px]">
              <CardUploadImage onChange={setImage} />
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
          <div className="min-h-[24px] flex mt-2">
            {errorMessage && (
              <p className="text-error subtitle-sm">{errorMessage}</p>
            )}
          </div>
          <div className="w-full md:min-h-[150px]">
            {loading ? (
              <p>Cargando áreas...</p>
            ) : error ? (
              <p className="text-error">{error}</p>
            ) : (
              <TableAreas
                data={[...areas, ...rows]} 
                onDeleteRow={handleDeleteRow}
              />
            )}
          </div>
          <div className="flex flex-col md:flex-row md:justify-end space-y-5 md:space-x-5">
            <Button label="Cancelar" variantColor="variant2" />
            <Button
              label="Registrar"
              disabled={rows.length === 0 || !image}
              variantColor={
                rows.length === 0 || !image ? 'variantDesactivate' : 'variant1'
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