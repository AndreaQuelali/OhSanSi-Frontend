import { Button, InputText, Modal } from '../../../components';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import CardUploadImage from './card-upload-image';
import { TableAreas } from './table-areas';
import axios from 'axios';
import AddIcon from '../icons/add';
import { API_URL } from '@/config/api-config';
import { useNavigate } from 'react-router-dom';


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

  const navigate = useNavigate();
  const [image, setImage] = useState<File | null>(null);
  const [rows, setRows] = useState<TableRow[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gestion, setGestion] = useState<number | null>(null);
  const [idOlimpiada, setIdOlimpiada] = useState<number | null>(null);

  useEffect(() => {
    const storedGestion = localStorage.getItem('gestion');
    if (storedGestion) {
      setGestion(Number(storedGestion));
    }
  }, []);

  useEffect(() => {
    if (!gestion) return;

    const fetchOlimpiada = async () => {
      try {
        const response = await axios.get(`${API_URL}/olympiad/${gestion}`);
        setIdOlimpiada(response.data.id_olimpiada);
      } catch (error) {
        console.error('Error al obtener la olimpiada:', error);
        alert('No se pudo obtener la información de la olimpiada.');
      }
    };

    fetchOlimpiada();
  }, [gestion]);

  const onSubmit = async (data: FormData) => {
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

    try {
      const response = await axios.get(`${API_URL}/areas`);
      const areas = response.data;

      const isDuplicateInDatabase = areas.some(
        (area: { id_olimpiada: number; nombre: string }) =>
          area.id_olimpiada === idOlimpiada &&
          area.nombre.toLowerCase() === data.inputArea.toLowerCase(),
      );

      if (isDuplicateInDatabase) {
        setError('inputArea', {
          type: 'manual',
          message: 'Esta área ya existe en la base de datos.',
        });
        return;
      }
    } catch (error) {
      console.error('Error al verificar las áreas en la base de datos:', error);
      alert('No se pudo verificar si el área ya existe. Intente nuevamente.');
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
      if (idOlimpiada) {
        formData.append('id_olimpiada', idOlimpiada.toString());
      } else {
        alert('No se pudo obtener el ID de la olimpiada.');
        return;
      }
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
    <div className=" mx-10 md:mx-0 lg:mx-0 flex flex-col items-center">
      <form onSubmit={handleSubmit(onSubmit)} className="mt-10 mb-32">
        <div className="flex flex-col">
          <h1 className="text-center headline-lg text-primary ">
            Registro de Áreas de Competencia de Olimpiada
          </h1>

          <h1 className="text-center headline-md text-primary mb-8">
            Gestión {gestion}
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2  mb-6 gap-9">

            <div>
              <InputText
                label="Nombre del Área"
                name="inputArea"
                placeholder="MATEMÁTICAS"
                type="text"
                className="w-full lg:w-[480px]"
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

            <div className="w-full  lg:w-[480px]">
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
            icon={AddIcon}
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
          <div className="flex flex-col-reverse md:flex-row md:justify-end md:space-x-5">
            <Button
              label="Cancelar"
              variantColor="variant2"
              className="mt-5 md:mt-0"
              onClick={() => navigate('/')}
            />
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
