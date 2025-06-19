import { Button, InputText, Modal } from '@/components';
import CardUploadFile from '../cards/card-upload-file';
import { useNavigate } from 'react-router';
import { useState, useRef } from 'react';
import IconDownload from '@/components/icons/icon-download';
import axios from 'axios';
import { API_URL } from '@/config/api-config';
import { TableOlympians } from '../tables/table-data-excel';
import CircularProgress from '@mui/material/CircularProgress';
import { useForm } from 'react-hook-form';
import ErrorModal from '../modals/modal-error';
import { ConfirmationModal } from '@/components/ui/modal-confirmation';

interface OlimpistaRow {
  Nombre: string;
  Apellido: string;
  CIOlimpista: string;
  FechadeNacimiento: string;
  Correoelectronico: string;
  Departamento: string;
  Provincia: string;
  UnidadEducativa: string;
  Grado: string;
  NombresTutorLegal: string;
  ApellidosTutorLegal: string;
  CITutorLegal: string;
  CelularTutorLegal: string;
  CorreoelectronicoTutorLegal: string;
  Area: string;
  NivelCategoria: string;
  NombresProfesor: string;
  ApellidosProfesor: string;
  CIProfesor: string;
  CelularProfesor: string;
  CorreoelectronicoProfesor: string;
}

interface FormFields {
  ci_responsable: string;
}

export default function FormDataExcel() {
  const {
    register,
    formState: { errors },
    watch,
  } = useForm<FormFields>({
    mode: 'all',
  });

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [fileName, setFileName] = useState<string | null>(null);
  const [olimpistas, setOlimpistas] = useState<OlimpistaRow[]>([]);
  const [rawDataToSend, setRawDataToSend] = useState<any[][]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [showModal, setShowModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [confirmationStatus, setConfirmationStatus] = useState<
    'success' | 'error' | 'alert' | null
  >(null);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleClearFile = () => {
    setFileName(null);
    setOlimpistas([]);
    setRawDataToSend([]);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleConfirmRegister = async () => {
    setShowModal(false);
    await handleRegister();
  };

  const handleUploadClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API_URL}/excel/data`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const rawData: any[][] = response.data.data;
      setRawDataToSend(rawData);

      const parsedData: OlimpistaRow[] = rawData
        .filter((row) => row.some((cell) => cell !== null && cell !== ''))
        .map((row) => ({
          Nombre: row[0] ?? '',
          Apellido: row[1] ?? '',
          CIOlimpista: row[2]?.toString() ?? '',
          FechadeNacimiento: row[3]?.toString() ?? '',
          Correoelectronico: row[4] ?? '',
          Departamento: row[5] ?? '',
          Provincia: row[6] ?? '',
          UnidadEducativa: row[7] ?? '',
          Grado: row[8] ?? '',
          NombresTutorLegal: row[9] ?? '',
          ApellidosTutorLegal: row[10] ?? '',
          CITutorLegal: row[11]?.toString() ?? '',
          CelularTutorLegal: row[12]?.toString() ?? '',
          CorreoelectronicoTutorLegal: row[13] ?? '',
          Area: row[14] ?? '',
          NivelCategoria: row[15] ?? '',
          NombresProfesor: row[16] ?? '',
          ApellidosProfesor: row[17] ?? '',
          CIProfesor: row[18]?.toString() ?? '',
          CelularProfesor: row[19]?.toString() ?? '',
          CorreoelectronicoProfesor: row[20] ?? '',
        }));

      setOlimpistas(parsedData);
    } catch (error: any) {
      const errores = error.response?.data?.errors;

      if (errores) {
        let mensaje = 'Errores al procesar el archivo Excel:\n';

        const erroresArchivo = errores.archivo ?? [];
        const erroresFormato = errores.formato ?? [];

        if (erroresArchivo.length > 0) {
          mensaje += `\n• ${erroresArchivo.join('\n• ')}`;
        }

        if (erroresFormato.length > 0) {
          mensaje += `\n• ${erroresFormato.join('\n• ')}`;
        }

        setErrorMessage(mensaje);
        setShowErrorModal(true);
      } else {
        setErrorMessage(
          'No se pudo procesar el archivo. Asegúrate de que el formato es correcto.',
        );
        setShowErrorModal(true);
      }

      handleClearFile();
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (rawDataToSend.length === 0) {
      alert('No hay datos para registrar.');
      return;
    }

    const ciResponsable = watch('ci_responsable');
    if (!ciResponsable) {
      setConfirmationMessage('Debe ingresar el CI del responsable.');
      setConfirmationStatus('alert');
      setShowSuccessModal(true);
      return;
    }

    setIsRegistering(true);

    try {
      await axios.post(`${API_URL}/excel/registration`, {
        ci_responsable_inscripcion: ciResponsable,
        data: rawDataToSend,
      });

      setConfirmationMessage(
        'Datos registrados exitosamente. Si desea generar la boleta de orden de pago, puede continuar con el siguiente paso.',
      );
      setConfirmationStatus('success');
      setShowSuccessModal(true);
    } catch (error: any) {
      console.error('Error al registrar los datos:', error);
      const data = error.response?.data;

      if (data?.resultado) {
        const resultado = data.resultado;
        let mensaje = '';

        if (data.message) {
          mensaje += `${data.message}\n`;
        }

        if (data.error) {
          mensaje += `Error: ${data.error}\n`;
        }

        const erroresPorEntidad = [
          { key: 'olimpistas_errores', label: 'Errores en olimpistas' },
          { key: 'profesores_errores', label: 'Errores en profesores' },
          { key: 'tutores_errores', label: 'Errores en tutores' },
          { key: 'inscripciones_errores', label: 'Errores en inscripciones' },
          { key: 'Colegio_errores', label: 'Errores en unidad educativa' },
          { key: 'Departamento_errores', label: 'Errores en departamento' },
          { key: 'Provincia_errores', label: 'Errores en provincia' },
          { key: 'Nivel_errores', label: 'Errores en nivel' },
          { key: 'Grado_errores', label: 'Errores en grado' },
        ];

        for (const { key, label } of erroresPorEntidad) {
          const errores = resultado[key];
          if (Array.isArray(errores) && errores.length > 0) {
            mensaje += `\n${label}:\n`;
            errores.forEach((item: any) => {
              const fila = item.fila !== undefined ? `Fila ${item.fila}` : '';
              const ci = item.ci ? ` (CI: ${item.ci})` : '';
              mensaje += `• ${fila}${ci}:\n`;

              if (Array.isArray(item.message)) {
                item.message.forEach((e: string) => {
                  mensaje += `    - ${e}\n`;
                });
              } else if (typeof item.message === 'string') {
                mensaje += `    - ${item.message}\n`;
              } else {
                mensaje += `    - Error desconocido\n`;
              }
            });
          }
        }

        setErrorMessage(mensaje);
        setShowErrorModal(true);
      } else if (data?.error) {
        setErrorMessage(`Error: ${data.error}`);
        setShowErrorModal(true);
      } else {
        setErrorMessage(
          'Hubo un error al registrar los datos. Verifique el formato del Excel.',
        );
        setShowErrorModal(true);
      }
    } finally {
      setIsRegistering(false);
    }
  };

  const handleCloseConfirmationModal = () => {
    setShowSuccessModal(false);
    if (confirmationStatus === 'success') {
      window.location.reload();
    }
    setConfirmationStatus(null);
    setConfirmationMessage('');
  };

  const handleNextStep = () => {
    navigate('/olympian/generate-order-payment');
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
                required: 'Debe ingresar la cédula del responsable.',
                pattern: {
                  value: /^(?! )[0-9]+(?<! )$/,
                  message:
                    'Solo se permiten números y no puede haber espacios.',
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
              onFileChange={handleFileChange}
            />
            <div className="flex flex-row items-center justify-start mt-2">
              <button
                type="button"
                onClick={() =>
                  window.open('/templates/template-excel.xlsx', '_blank')
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
                onClick={handleClearFile}
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
            onClick={() => navigate('/olympian')}
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
          text="¿Estás seguro de que deseas registrar los datos?"
          onClose={() => setShowModal(false)}
          onConfirm={handleConfirmRegister}
        />
      )}
      {showErrorModal && (
        <ErrorModal
          isOpen={showErrorModal}
          onClose={() => setShowErrorModal(false)}
          errorMessage={errorMessage}
          title="Error en el archivo Excel"
        />
      )}
      {showSuccessModal && (
        <ConfirmationModal
          onClose={handleCloseConfirmationModal}
          status={confirmationStatus || 'error'}
          message={confirmationMessage}
          nextStepText={
            confirmationStatus === 'success'
              ? 'Ir a generar boleta de orden de pago.'
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
