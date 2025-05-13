import { Button, InputText, Modal } from '../../../components';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '@/config/api-config';
import { useNavigate } from 'react-router';
import { TableLevel } from './table-level';

type FormData = {
  inputLevel: string;
};

type TableRow = {
  id: number;
  level: string;
};

const normalizeAreaName = (str: string) =>
  removeAccents(str.toUpperCase())
    .replace(/ ?- ?/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const removeAccents = (str: string) =>
  str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

export const FormLevel = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setError,
    clearErrors,
    reset,
    getValues,
  } = useForm<FormData>({
    mode: 'onChange',
  });

  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [levelsRegistered, setLevelsRegistered] = useState<TableRow[]>([]);

  const fetchTableLevels = async () => {
    try {
      const response = await axios.get(`${API_URL}/get-niveles`);
      const levelsFromDB = response.data.niveles;

      const formatted = levelsFromDB.map(
        (niveles: { id_nivel: number; nombre: string }) => ({
          id: niveles.id_nivel,
          level: niveles.nombre,
        }),
      );

      setLevelsRegistered(formatted);
    } catch (error) {
      console.error('Error al obtener los niveles:', error);
    }
  };

  useEffect(() => {
    fetchTableLevels();
  }, []);

  const onSubmit = async () => {
    clearErrors('inputLevel');
    const inputLevel = getValues('inputLevel');

    try {
      const response = await axios.get(`${API_URL}/get-niveles`);
      const levels = response.data.niveles;

      const isDuplicate = levels.some(
        (nivel: { nombre: string }) =>
          normalizeAreaName(nivel.nombre) === normalizeAreaName(inputLevel),
      );

      if (isDuplicate) {
        setError('inputLevel', {
          type: 'manual',
          message: 'Este nivel ya se encuentra registrado.',
        });
        return;
      }

      setIsModalOpen(true);
    } catch (error) {
      console.error('Error al verificar los niveles:', error);
      alert('No se pudo verificar si el nivel ya existe. Intente nuevamente.');
    }
  };

  const handleRegister = async () => {
    setIsModalOpen(false);
    const nameLevel = getValues('inputLevel');

    try {
      const payload = {
        nombre: nameLevel,
      };

      await axios.post(`${API_URL}/niveles-categoria`, payload);
      alert('Nivel registrado correctamente');
      reset();
      fetchTableLevels();
    } catch {
      alert('Error al registrar el nivel');
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-5 mt-10 mb-32 md:w-9/12 lg:w-7/12"
      >
        <div className="flex flex-col">
          <h1 className="text-center headline-lg text-primary">
            Registro de Niveles/Categorías de Competencia
          </h1>

          <div className="grid grid-cols-1 mb-2 md:mt-5 lg:mt-0">
            <InputText
              label="Nombre del Nivel/Categoría"
              name="inputLevel"
              placeholder="Ingresar nombre del nivel o categoría"
              type="text"
              className="w-full"
              labelPadding="py-5"
              register={register}
              errors={errors}
              validationRules={{
                required: 'El nombre es obligatorio',
                pattern: {
                  value:
                    /^[A-Za-zÑñÁÉÍÓÚáéíóú0-9]+(?:(?: |-| - | -|- | - )[A-Za-zÑñÁÉÍÓÚáéíóú0-9]+)*$/,
                  message:
                    'Solo se permiten letras, números, guiones en medio y un solo espacio entre palabras',
                },

                maxLength: {
                  value: 30,
                  message: 'El nombre no puede exceder los 30 caracteres',
                },
              }}
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
              type="submit"
              label="Registrar"
              disabled={!isValid}
              variantColor={!isValid ? 'variantDesactivate' : 'variant1'}
            />
          </div>
          <h2 className="text-primary subtitle-md mb-5 mt-7 md:mt-5">
            Niveles/Categorías registradas
          </h2>
          <div className="mt-2 md:w-11/12 mx-auto">
            <TableLevel data={levelsRegistered} />
          </div>
        </div>
      </form>

      {isModalOpen && (
        <Modal
          text="¿Está seguro de registrar este nivel o categoría?"
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleRegister}
        />
      )}
    </div>
  );
};
