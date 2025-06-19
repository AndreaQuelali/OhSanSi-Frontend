import { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { API_URL } from '@/config/api-config';
import { useFetchDataWithBody } from '@/hooks/use-fetch-with-body';
import { formattedDate } from '@/utils/date';
import {
  useFormValidity,
  useOlimpistaData,
  useTutorValidation,
} from '../../hooks';
import ParticipantFormHeader from './form-header';
import AreasGridSection from './../grids/selection-grid-areas';
import AreaSelectionModal from './../modals/selection-areas-modal';
import FormButtons from '@/components/ui/form-buttons';
import ResponsiblePersonModal from '@/components/ui/modal-responsible';
import { ConfirmationModal } from '@/components/ui/modal-confirmation';
import { useNavigate } from 'react-router';

interface FormData {
  olimpista: {
    ci: string;
  };
  tutor: {
    ci: string;
  };
}

export default function FormAreaPart() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid: formFieldsValid },
    watch,
    control,
    setValue,
  } = useForm<FormData>({
    mode: 'all',
    defaultValues: {
      olimpista: { ci: '' },
      tutor: { ci: '' },
    },
  });
  const [showResponsibleModal, setShowResponsibleModal] = useState(false);
  const ciTutor = watch('tutor.ci');
  const ciOlimpista = watch('olimpista.ci');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationStatus, setConfirmationStatus] = useState<
    'success' | 'error' | 'alert' | null
  >(null);
  const [confirmationMessage, setConfirmationMessage] = useState<string>('');
  const navigate = useNavigate();

  const {
    areasDisponibles,
    nivelesSeleccionados,
    setNivelesSeleccionados,
    olimpistaError,
    loading,
  } = useOlimpistaData(ciOlimpista);
  const { tutorError, setTutorError } = useTutorValidation(ciTutor);
  const { formIsValid } = useFormValidity({
    formFieldsValid,
    nivelesSeleccionados,
    areasDisponibles,
    olimpistaError,
    tutorError,
    ciTutor,
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [nivelesSeleccionadosTemp, setNivelesSeleccionadosTemp] = useState<
    { id_nivel: number; nombre_nivel: string; registrado?: boolean }[]
  >([]);

  const { data: maxCategoriasData } = useFetchDataWithBody<{
    success: boolean;
    fecha: string;
    id_olimpiada: number;
    max_categorias_olimpista: number;
  }>(`${API_URL}/olympiads/max-categories?fecha=${formattedDate}`, {
    method: 'GET',
  });
  const [tutoresPorArea, setTutoresPorArea] = useState<Record<string, string>>(
    {},
  );
  const maxCategorias = maxCategoriasData?.max_categorias_olimpista || 0;

  const clearTutorError = () => {
    setTutorError(null);
  };

  const handleNivelToggle = (nivel: {
    id_nivel: number;
    nombre_nivel: string;
    registrado?: boolean;
  }) => {
    if (nivel.registrado) {
      alert('No puedes deseleccionar un nivel ya registrado.');
      return;
    }

    const nivelesYaRegistrados = nivelesSeleccionadosTemp.filter(
      (n) => n.registrado,
    );

    if (nivelesSeleccionadosTemp.some((n) => n.id_nivel === nivel.id_nivel)) {
      setNivelesSeleccionadosTemp([...nivelesYaRegistrados]);
    } else {
      setNivelesSeleccionadosTemp([...nivelesYaRegistrados, nivel]);
    }
  };

  const handleCloseConfirmationModal = () => {
    setShowConfirmationModal(false);
    if (confirmationStatus === 'success') {
      window.location.href = '/olympian/register-selected-areas';
    }
    setConfirmationStatus(null);
    setConfirmationMessage('');
  };

  const handleModalAceptar = () => {
    if (selectedArea) {
      const hayNivelesNuevosSeleccionados = nivelesSeleccionadosTemp.some(
        (nivel) => !nivel.registrado,
      );

      if (hayNivelesNuevosSeleccionados) {
        setTutoresPorArea((prev) => ({
          ...prev,
          [selectedArea]: ciTutor || '',
        }));
      } else {
        setTutoresPorArea((prev) => {
          const { [selectedArea]: _, ...rest } = prev;
          return rest;
        });
      }

      const nivelesRegistradosEnArea =
        areasDisponibles[selectedArea]?.filter((nivel) => nivel.registrado) ||
        [];

      const todosLosNivelesRegistradosIncluidos =
        nivelesRegistradosEnArea.every((nivelReg) =>
          nivelesSeleccionadosTemp.some(
            (nivel) => nivel.id_nivel === nivelReg.id_nivel,
          ),
        );

      if (
        nivelesRegistradosEnArea.length > 0 &&
        !todosLosNivelesRegistradosIncluidos
      ) {
        alert('No puedes deseleccionar niveles ya registrados.');
        setModalVisible(false);
        return;
      }

      const nivelesDisponiblesSinRegistrar =
        areasDisponibles[selectedArea]?.filter((nivel) => !nivel.registrado) ||
        [];

      if (nivelesDisponiblesSinRegistrar.length === 0) {
        alert('No hay nuevos niveles para registrar en esta área.');
        setModalVisible(false);
        return;
      }

      setNivelesSeleccionados((prev) => {
        if (nivelesSeleccionadosTemp.length === 0) {
          const nivelesRegistrados = prev[selectedArea]?.filter(
            (n) => n.registrado,
          );
          if (nivelesRegistrados?.length > 0) {
            return {
              ...prev,
              [selectedArea]: nivelesRegistrados,
            };
          } else {
            const { [selectedArea]: _, ...rest } = prev;
            return rest;
          }
        } else {
          return {
            ...prev,
            [selectedArea]: nivelesSeleccionadosTemp,
          };
        }
      });
    }

    setValue('tutor.ci', '');
    setModalVisible(false);
  };

  const handleModalCancelar = () => {
    setModalVisible(false);
    setNivelesSeleccionadosTemp([]);
  };

  const handleAreaClick = (area: string) => {
    const seleccionados = nivelesSeleccionados[area] || [];
    const tutorCiForArea = tutoresPorArea[area] || '';
    setValue('tutor.ci', tutorCiForArea);
    if (seleccionados.length > 0) {
      setSelectedArea(area);
      setNivelesSeleccionadosTemp([...seleccionados]);
      setModalVisible(true);
      return;
    }

    if (maxCategorias <= 0) {
      console.warn(
        'Valor de maxCategorias no válido:',
        maxCategorias,
        'permitiendo selección',
      );
      setSelectedArea(area);
      setNivelesSeleccionadosTemp([]);
      setModalVisible(true);
      return;
    }

    const areasConSelecciones = Object.keys(nivelesSeleccionados).length;
    if (areasConSelecciones >= maxCategorias) {
      setConfirmationStatus('alert');
      setConfirmationMessage(
        `Ya has alcanzado el límite de ${maxCategorias} áreas permitidas.`,
      );
      setShowConfirmationModal(true);
      return;
    }
    setSelectedArea(area);
    setNivelesSeleccionadosTemp([]);
    setModalVisible(true);
  };

  const handleRegistrar = async () => {
    if (!ciOlimpista) {
      alert('Por favor, ingrese la cédula del olimpista.');
      return;
    }

    const nivelesNuevos = Object.values(nivelesSeleccionados)
      .flat()
      .filter((nivel) => !nivel.registrado)
      .map((nivel) => nivel.id_nivel);

    if (nivelesNuevos.length === 0) {
      alert('No hay nuevos niveles para registrar.');
      return;
    }

    setShowResponsibleModal(true);
  };

  const handleResponsibleConfirm = async (responsibleCi: string) => {
    const nivelesNuevosFlat = Object.entries(nivelesSeleccionados).flatMap(
      ([area, niveles]) => {
        return niveles
          .filter((nivel) => !nivel.registrado)
          .map((nivel) => ({
            id_nivel: nivel.id_nivel,
            ...(tutoresPorArea[area]
              ? { ci_tutor_academico: parseInt(tutoresPorArea[area]) }
              : {}),
          }));
      },
    );

    const payload = {
      ci: parseInt(ciOlimpista),
      niveles: nivelesNuevosFlat,
      ci_responsable: parseInt(responsibleCi),
    };

    try {
      await axios.post(`${API_URL}/enrollments/with-tutor`, payload);
      setConfirmationStatus('success');
      setConfirmationMessage(
        'Registro exitoso. Si desea generar la boleta de orden de pago, puede continuar con el siguiente paso.',
      );
    } catch (err: any) {
      console.error('Error:', err);
      setConfirmationStatus('error');
      setConfirmationMessage(
        err.response?.data?.message ||
          'Error al realizar el registro. Por favor intente nuevamente.',
      );
    } finally {
      setShowResponsibleModal(false);
      setShowConfirmationModal(true);
    }
  };

  const handleNextStep = () => {
    navigate('/olympian/generate-order-payment');
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(handleRegistrar)(e);
        }}
        className="mx-5 mt-5 mb-32 w-11/12 md:w-9/12 lg:w-9/12"
      >
        <h2 className="text-center text-primary mb-8 md:mb-10 headline-lg">
          Registro de Olimpista en una o varias áreas de competencia
        </h2>

        <ParticipantFormHeader register={register} errors={errors} />

        <AreasGridSection
          loading={loading}
          olimpistaError={olimpistaError}
          areasDisponibles={areasDisponibles}
          nivelesSeleccionados={nivelesSeleccionados}
          onAreaClick={handleAreaClick}
        />

        {modalVisible && selectedArea && (
          <AreaSelectionModal
            selectedArea={selectedArea}
            areasDisponibles={areasDisponibles}
            nivelesSeleccionadosTemp={nivelesSeleccionadosTemp}
            onToggleNivel={handleNivelToggle}
            onAccept={handleModalAceptar}
            onCancel={handleModalCancelar}
            register={register}
            errors={errors}
            tutorError={tutorError}
            clearTutorError={clearTutorError}
            control={control}
          />
        )}

        <FormButtons formIsValid={formIsValid} />
      </form>
      <ResponsiblePersonModal
        isOpen={showResponsibleModal}
        onClose={() => setShowResponsibleModal(false)}
        onConfirm={handleResponsibleConfirm}
      />
      {showConfirmationModal && (
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
    </div>
  );
}
