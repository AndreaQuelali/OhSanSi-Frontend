import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ConfirmationModal } from '@/components/ui/modal-confirmation';
import { Button, InputText, Modal } from '@/components';
import { TableAreas } from '../tables/table-areas';
import { useAreas } from '../../hooks/use-areas';
import { AREA_ERROR_MESSAGES, AREA_VALIDATION_PATTERNS, AREA_VALIDATION_LIMITS } from '../../constants/area-constants';
import type { FormData } from '../../interfaces/form-area';

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
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationStatus, setConfirmationStatus] = useState<'success' | 'error' | null>(null);
  const [confirmationMessage, setConfirmationMessage] = useState<string>('');

  const {
    areasRegistered,
    fetchTableAreas,
    checkDuplicateArea,
    registerArea,
    error,
    setError: setAreasError,
    setAreasRegistered
  } = useAreas();

  useEffect(() => {
    fetchTableAreas();
  }, [fetchTableAreas]);

  const onSubmit = async () => {
    clearErrors('inputArea');
    const inputArea = getValues('inputArea');
    const isDuplicate = await checkDuplicateArea(inputArea);
    if (isDuplicate) {
      setError('inputArea', {
        type: 'manual',
        message: AREA_ERROR_MESSAGES.DUPLICATE,
      });
      return;
    }
    setIsModalOpen(true);
  };

  const handleRegister = async () => {
    setIsModalOpen(false);
    const nameArea = getValues('inputArea');
    const result = await registerArea(nameArea);
    if (result.success) {
      setConfirmationStatus('success');
      setConfirmationMessage(AREA_ERROR_MESSAGES.REGISTER_SUCCESS);
      setShowConfirmationModal(true);
      reset();
      fetchTableAreas();
    } else {
      setConfirmationStatus('error');
      setConfirmationMessage(AREA_ERROR_MESSAGES.REGISTER_ERROR);
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
                required: AREA_ERROR_MESSAGES.REQUIRED,
                pattern: {
                  value: AREA_VALIDATION_PATTERNS.NAME,
                  message: AREA_ERROR_MESSAGES.PATTERN,
                },
                maxLength: {
                  value: AREA_VALIDATION_LIMITS.MAX_LENGTH,
                  message: AREA_ERROR_MESSAGES.MAX_LENGTH,
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
            <TableAreas data={areasRegistered} />
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
