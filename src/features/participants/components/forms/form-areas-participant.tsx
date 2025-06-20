import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { formattedDate } from '@/utils/date';
import {
  useFormValidity,
  useOlimpistaData,
  useTutorValidation,
  useAreaSelection,
  useConfirmationParticipant,
  useResponsibleModal,
} from '../../hooks';
import {
  ParticipantFormHeader,
  AreasGridSection,
  AreaSelectionModal,
  FormButtons,
  ResponsiblePersonModal,
} from '@/features/participants/components';
import { ConfirmationModal } from '@/components/ui/modal-confirmation';
import { useNavigate } from 'react-router';
import { ERROR_MESSAGES, ROUTES } from '../../constants/participant-constants';
import { FormData } from '../../interfaces';
import { buildEnrollmentPayload } from '../../utils';
import { ParticipantApiService } from '../../services/participant-api';

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
  const ciTutor = watch('tutor.ci');
  const ciOlimpista = watch('olimpista.ci');
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

  const [maxCategorias, setMaxCategorias] = useState(0);
  useEffect(() => {
    async function fetchMaxCategorias() {
      try {
        const response =
          await ParticipantApiService.getMaxCategoriesByDate(formattedDate);
        setMaxCategorias(response.data?.max_categories_per_olympist || 0);
      } catch {
        setMaxCategorias(0);
      }
    }
    fetchMaxCategorias();
  }, []);

  const confirmationModal = useConfirmationParticipant();
  const areaSelection = useAreaSelection({
    nivelesSeleccionados,
    setNivelesSeleccionados,
    areasDisponibles,
    maxCategorias,
    setValue,
    ciTutor,
    openConfirmationModal: confirmationModal.showConfirmation,
  });
  const responsibleModal = useResponsibleModal();

  const clearTutorError = () => {
    setTutorError(null);
  };

  const handleRegistrar = async () => {
    if (!ciOlimpista) {
      alert(ERROR_MESSAGES.ADD_OLYMPIAN_CI);
      return;
    }
    const nivelesNuevos = Object.values(nivelesSeleccionados)
      .flat()
      .filter((nivel) => !nivel.registrado)
      .map((nivel) => nivel.id_nivel);
    if (nivelesNuevos.length === 0) {
      alert(ERROR_MESSAGES.REGISTER_NO_LEVELS);
      return;
    }
    responsibleModal.openResponsibleModal();
  };

  const handleResponsibleConfirm = async (responsibleCi: string) => {
    const payload = buildEnrollmentPayload({
      ciOlimpista,
      nivelesSeleccionados,
      tutoresPorArea: areaSelection.tutoresPorArea,
      responsibleCi,
    });
    try {
      await ParticipantApiService.enrollWithTutor(payload);
      confirmationModal.showSuccess(ERROR_MESSAGES.SUCCESS_REGISTRATION_AREAS);
    } catch (err: any) {
      console.error('Error:', err);
      confirmationModal.showError(
        err.response?.data?.message || ERROR_MESSAGES.ERROR_REGISTRATION_AREAS,
      );
    } finally {
      responsibleModal.closeResponsibleModal();
    }
  };

  const handleCloseConfirmationModal = () => {
    confirmationModal.closeConfirmationModal(() => {
      if (confirmationModal.confirmationStatus === 'success') {
        window.location.href = ROUTES.OLYMPIAN_MENU;
      }
    });
  };

  const handleNextStep = () => {
    navigate(ROUTES.GENERATE_ORDER_PAYMENT);
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
          onAreaClick={areaSelection.handleAreaClick}
        />

        {areaSelection.modalVisible && areaSelection.selectedArea && (
          <AreaSelectionModal
            selectedArea={areaSelection.selectedArea}
            areasDisponibles={areasDisponibles}
            nivelesSeleccionadosTemp={areaSelection.nivelesSeleccionadosTemp}
            onToggleNivel={areaSelection.handleNivelToggle}
            onAccept={areaSelection.handleModalAceptar}
            onCancel={areaSelection.handleModalCancelar}
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
        isOpen={responsibleModal.showResponsibleModal}
        onClose={responsibleModal.closeResponsibleModal}
        onConfirm={handleResponsibleConfirm}
      />
      {confirmationModal.showConfirmationModal && (
        <ConfirmationModal
          onClose={handleCloseConfirmationModal}
          status={confirmationModal.confirmationStatus || 'error'}
          message={confirmationModal.confirmationMessage}
          nextStepText={
            confirmationModal.confirmationStatus === 'success'
              ? ERROR_MESSAGES.NEXT_STEP_AREAS
              : undefined
          }
          onNextStep={
            confirmationModal.confirmationStatus === 'success'
              ? handleNextStep
              : undefined
          }
        />
      )}
    </div>
  );
}
