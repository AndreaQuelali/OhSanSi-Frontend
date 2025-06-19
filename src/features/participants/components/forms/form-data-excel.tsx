import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { useState } from 'react';

import { Button, InputText, Modal } from '@/components';
import CardUploadFile from '../cards/card-upload-file';
import IconDownload from '@/components/icons/icon-download';
import { TableOlympians } from '../tables/table-data-excel';
import CircularProgress from '@mui/material/CircularProgress';
import ErrorModal from '../modals/modal-error';
import { ConfirmationModal } from '@/components/ui/modal-confirmation';

import { useExcelUpload } from '../../hooks/use-excel-upload';
import { parseExcelErrors } from '../../utils/parse-excel-errors';
import { ParticipantApiService } from '../../services/participant-api';

import {
  ERROR_MESSAGES,
  ROUTES,
  VALIDATION_PATTERNS,
} from '../../constants/participant-constants';

import {
  FormFields,
} from '../../interfaces/form-data-excel';

export default function FormDataExcel() {
  const {
    register,
    formState: { errors },
    watch,
  } = useForm<FormFields>({ mode: 'all' });

  const navigate = useNavigate();
  const ciResponsable = watch('ci_responsable');

  const {
    fileName,
    isLoading,
    olimpistas,
    rawDataToSend,
    inputRef,
    errorMessage,
    showErrorModal,
    setShowErrorModal,
    setFileName,
    handleFileChange,
    clearFile,
    setErrorMessage,
  } = useExcelUpload();

  const [showModal, setShowModal] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [confirmationStatus, setConfirmationStatus] = useState<'success' | 'error' | 'alert' | null>(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleUploadClick = () => {
    inputRef.current?.click();
  };

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleConfirmRegister = async () => {
    setShowModal(false);
    await handleRegister();
  };

  const handleRegister = async () => {
    if (rawDataToSend.length === 0) {
      alert(ERROR_MESSAGES.REGISTER_NO_DATA);
      return;
    }

    if (!ciResponsable) {
      setConfirmationMessage(ERROR_MESSAGES.CI_RESPONSIBLE_WARNING);
      setConfirmationStatus('alert');
      setShowConfirmationModal(true);
      return;
    }

    setIsRegistering(true);

    try {
      await ParticipantApiService.registerExcelData(ciResponsable, rawDataToSend);
      setConfirmationMessage(ERROR_MESSAGES.SUCCESS_REGISTRATION_EXCEL);
      setConfirmationStatus('success');
      setShowConfirmationModal(true);
    } catch (error: any) {
      const data = error.response?.data;
      const resultado = data?.response;

      let mensaje = '';
      if (data?.message) mensaje += `${data.message}\n`;
      if (data?.error && data?.error !== data?.message) mensaje += `${data.error}\n`;
      if (resultado) {
        mensaje += parseExcelErrors(resultado, '', ERROR_MESSAGES.ERROR_REGISTER_EXCEL);
      }
      if (!mensaje) {
        mensaje = ERROR_MESSAGES.ERROR_REGISTER_EXCEL;
      }
        setErrorMessage(mensaje);
        setShowErrorModal(true);
    } finally {
      setIsRegistering(false);
    }
  };

  const handleCloseConfirmationModal = () => {
    setShowConfirmationModal(false);
    if (confirmationStatus === 'success') {
      window.location.reload();
    }
    setConfirmationStatus(null);
    setConfirmationMessage('');
  };

  const handleNextStep = () => {
    navigate(ROUTES.GENERATE_ORDER_PAYMENT);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <form
        className="mx-5 mt-10 mb-32 w-11/12 md:w-9/12 lg:w-9/12"
        onSubmit={(e) => e.preventDefault()}
      >
        <h1 className="text-center text-primary mb-8 headline-lg">
          Registrar datos de olimpistas a través de archivo Excel
        </h1>

        <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-10 mb-5">
          <div className="flex">
            <InputText
              label="Cédula de identidad del responsable de la lista (Deberá haber sido registrado previamente)"
              name="ci_responsable"
              placeholder="Ingresar ci del responsable"
              className="w-full"
              register={register}
              validationRules={{
                required: ERROR_MESSAGES.CI_RESPONSIBLE_REQUIRED,
                pattern: {
                  value: VALIDATION_PATTERNS.CI_RESPONSIBLE,
                  message: ERROR_MESSAGES.CI_RESPONSIBLE_INVALID
                },
              }}
              errors={errors}
            />
          </div>
          <div className="flex flex-col">
            <CardUploadFile
              fileName={fileName}
              setFileName={setFileName}
              ref={inputRef}
              onFileChange={onFileChange}
            />
            <div className="flex flex-row items-center justify-start mt-2">
              <button
                type="button"
                onClick={() =>
                  window.open(ROUTES.DOWNLOAD_EXCEL_TEMPLATE , '_blank')
                }
                className="flex items-center text-primary underline body-md hover:text-secondary2 transition cursor-pointer"
              >
                <IconDownload classname="h-5 w-5 mr-0.5" />
                Descargar plantilla Excel
              </button>
            </div>
          </div>

          <div className="flex flex-col w-full md:w-auto">
            {fileName ? (
              <Button
                label="Borrar archivo"
                variantColor={isLoading ? 'variantDesactivate' : 'variant2'}
                className="mt-5 md:mt-0"
                onClick={clearFile}
                disabled={isLoading}
              />
            ) : (
              <Button
                label="Subir archivo"
                variantColor="variant1"
                className="mt-5 md:mt-0"
                onClick={handleUploadClick}
              />
            )}
          </div>
        </div>

        <p className="subtitle-md text-primary mb-5">Datos cargados:</p>
        {isLoading && (
          <div className="flex justify-center my-4">
            <CircularProgress />
          </div>
        )}
        {!isLoading && (
          <div className="w-full">
            <TableOlympians data={olimpistas} />
          </div>
        )}

        <div className="flex flex-col-reverse md:flex-row md:justify-end gap-5 md:gap-0 md:space-x-5 mt-5">
          <Button
            label="Cancelar"
            variantColor="variant2"
            onClick={() => navigate(ROUTES.OLYMPIAN_MENU)}
          />
          <Button
            type="button"
            label="Registrar"
            variantColor={
              rawDataToSend.length === 0 ? 'variantDesactivate' : 'variant1'
            }
            onClick={() => setShowModal(true)}
            disabled={rawDataToSend.length === 0}
          />
        </div>
      </form>

      {showModal && (
        <Modal
          text={ERROR_MESSAGES.CONFIRMATION_TEXT_EXCEL}
          onClose={() => setShowModal(false)}
          onConfirm={handleConfirmRegister}
        />
      )}
      {showErrorModal && (
        <ErrorModal
          isOpen={showErrorModal}
          onClose={() => setShowErrorModal(false)}
          errorMessage={errorMessage}
          title={ERROR_MESSAGES.MODAL_ERROR_TITLE}
        />
      )}
      {showConfirmationModal && (
        <ConfirmationModal
          onClose={handleCloseConfirmationModal}
          status={confirmationStatus || 'error'}
          message={confirmationMessage}
          nextStepText={
            confirmationStatus === 'success'
              ? ERROR_MESSAGES.NEXT_STEP_TEXT_EXCEL
              : undefined
          }
          onNextStep={
            confirmationStatus === 'success' ? handleNextStep : undefined
          }
        />
      )}
      {isRegistering && (
        <div className="fixed top-0 left-0 w-full h-full bg-neutral2 opacity-40 flex items-center justify-center z-50">
          <CircularProgress size={80} />
        </div>
      )}
    </div>
  );
}
