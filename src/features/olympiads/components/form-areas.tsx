import { Button, InputText, Modal } from '../../../components';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '@/config/api-config';
import { useNavigate } from 'react-router';
import { TableAreas } from './table-areas';
import { ConfirmationModal } from '@/components/ui/modal-confirmation';

type FormData = {
  inputArea: string;
};

type TableRow = {
  id: number;
  area: string;
};

const normalizeAreaName = (str: string) =>
  removeAccents(str.toUpperCase())
    .replace(/ ?- ?/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const removeAccents = (str: string) =>
  str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const FormAreas = () => {
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
  const [areasRegistradas, setAreasRegistradas] = useState<TableRow[]>([]);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationStatus, setConfirmationStatus] = useState<'success' | 'error' | null>(null);
  const [confirmationMessage, setConfirmationMessage] = useState<string>('');

  const fetchAreas = async () => {
    try {
      const response = await axios.get(`${API_URL}/areas`);
      const areasFromDB = response.data;

      const formatted = areasFromDB.map(
        (area: { id_area: number; nombre: string }) => ({
          id: area.id_area,
          area: area.nombre,
        }),
      );

      setAreasRegistradas(formatted);
    } catch (error) {
      console.error('Error al obtener las áreas:', error);
    }
  };

  useEffect(() => {
    fetchAreas();
  }, []);

  const onSubmit = async () => {
    clearErrors('inputArea');
    const inputArea = getValues('inputArea');

    try {
      const response = await axios.get(`${API_URL}/areas`);
      const areas = response.data;

      const isDuplicate = areas.some(
        (area: { nombre: string }) =>
          normalizeAreaName(area.nombre) === normalizeAreaName(inputArea),
      );

      if (isDuplicate) {
        setError('inputArea', {
          type: 'manual',
          message: 'Esta área ya se encuentra registrada.',
        });
        return;
      }

      setIsModalOpen(true);
    } catch (error) {
      console.error('Error al verificar las áreas:', error);
      alert('No se pudo verificar si el área ya existe. Intente nuevamente.');
    }
  };

  const handleRegister = async () => {
    setIsModalOpen(false);
    const inputArea = getValues('inputArea');

    try {
      const payload = {
        nombre: inputArea,
      };

      await axios.post(`${API_URL}/areas`, payload);

      setConfirmationStatus('success');
      setConfirmationMessage('Registro exitoso del área.');
      setShowConfirmationModal(true);
      reset();
      fetchAreas();
    } catch (error: any) {
      console.error('Error al registrar el área:', error);
      setConfirmationStatus('error');
      setConfirmationMessage(
        error.response?.data?.message || 'Error al registrar el área. Por favor, intente nuevamente.'
      );
      setShowConfirmationModal(true);
    }
  };

  const handleCloseConfirmationModal = () => {
    setShowConfirmationModal(false);
    setConfirmationStatus(null);
    setConfirmationMessage('');
  };

  return (
    <div className="flex flex-col items-center w-full">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-5 mt-10 mb-32 md:w-9/12 lg:w-7/12"
      >
        <div className="flex flex-col">
          <h1 className="text-center headline-lg text-primary">
            Registro de Áreas de Competencia
          </h1>

          <div className="grid grid-cols-1 mb-2 md:mt-5 lg:mt-0">
            <InputText
              label="Nombre del Área"
              name="inputArea"
              placeholder="Ingresar nombre del área"
              type="text"
              className="w-full"
              labelPadding="py-5"
              register={register}
              errors={errors}
              validationRules={{
                required: 'El nombre del área es obligatorio',
                pattern: {
                  value: /^[A-ZÑÁÉÍÓÚ]+(?:(?: |-| - | -|- | - )[A-ZÑÁÉÍÓÚ]+)*$/,
                  message:
                    'Solo se permiten letras mayúsculas, guion en medio y un solo espacio entre palabras',
                },
                maxLength: {
                  value: 50,
                  message: 'El nombre no puede exceder los 50 caracteres',
                },
              }}
            />
          </div>

          <div className="flex flex-col-reverse md:flex-row md:justify-end md:space-x-5">
            <Button
              label="Cancelar"
              variantColor="variant2"
              className="mt-5 md:mt-0"
              onClick={() => navigate('/administrator')}
            />
            <Button
              type="submit"
              label="Registrar"
              disabled={!isValid}
              variantColor={!isValid ? 'variantDesactivate' : 'variant1'}
            />
          </div>
          <h2 className="text-primary subtitle-md mb-5 mt-7 md:mt-5">
            Áreas registradas
          </h2>
          <div className="mt-2 md:w-11/12 mx-auto">
            <TableAreas data={areasRegistradas} />
          </div>
        </div>
      </form>

      {isModalOpen && (
        <Modal
          text="¿Está seguro de registrar esta área?"
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleRegister}
        />
      )}
      {showConfirmationModal && (
        <ConfirmationModal
          onClose={handleCloseConfirmationModal}
          status={confirmationStatus || 'error'}
          message={confirmationMessage}
        />
      )}
    </div>
  );
};

export default FormAreas;
