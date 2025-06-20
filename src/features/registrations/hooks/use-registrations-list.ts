import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  RegistrationsListState,
  FormData,
} from '../interfaces/registrations-list';
import { registrationsListService } from '../services/registrations-list-api';
import { registrationsListUtils } from '../utils/registrations-list-helpers';
import { ERROR_MESSAGES, FORM_CONFIG } from '../constants/registrations-list';

interface UseRegistrationsListProps {
  showUploadButton: boolean;
  title: string;
  showGenerateButton: boolean;
}

export const useRegistrationsList = ({
  showUploadButton,
  title,
  showGenerateButton,
}: UseRegistrationsListProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ mode: FORM_CONFIG.mode });

  const [state, setState] = useState<RegistrationsListState>({
    data: [],
    loading: false,
    errorMessage: '',
  });

  const updateState = (updates: Partial<RegistrationsListState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const getRegistrations = async (ci: string) => {
    updateState({ loading: true, errorMessage: '' });

    try {
      if (showUploadButton || title.includes('Subir comprobante de pago')) {
        try {
          const paymentData = await registrationsListService.checkPayment(ci);
          if (!paymentData.exists) {
            updateState({
              errorMessage: paymentData.message,
              data: [],
              loading: false,
            });
            return;
          }
        } catch {
          updateState({
            errorMessage: ERROR_MESSAGES.paymentConsultError,
            data: [],
            loading: false,
          });
          return;
        }
      }

      const endpointType = registrationsListUtils.getEndpointType(
        showUploadButton,
        title,
        showGenerateButton,
      );

      let enrollmentData;
      switch (endpointType) {
        case 'upload':
          enrollmentData =
            await registrationsListService.getEnrollmentsPendingForUpload(ci);
          break;
        case 'all':
          enrollmentData = await registrationsListService.getEnrollmentsAll(ci);
          break;
        default:
          enrollmentData =
            await registrationsListService.getEnrollmentsPending(ci);
      }

      const mappedData =
        registrationsListUtils.mapEnrollmentResponse(enrollmentData);
      updateState({ data: mappedData, loading: false });
    } catch (error: unknown) {
      console.error('Error al obtener inscripciones', error);
      updateState({ data: [], loading: false });

      if (
        !showUploadButton &&
        !title.includes('Verificar') &&
        !title.includes('Subir comprobante de pago') &&
        ((error instanceof Error && error.message.includes('404')) || !error)
      ) {
        try {
          const paymentData = await registrationsListService.checkPayment(ci);
          if (!paymentData.exists) {
            updateState({ errorMessage: paymentData.message });
          } else {
            updateState({ errorMessage: ERROR_MESSAGES.noEnrollmentsFound });
          }
        } catch {
          updateState({ errorMessage: ERROR_MESSAGES.noEnrollmentsFound });
        }
      } else {
        updateState({ errorMessage: ERROR_MESSAGES.enrollmentConsultError });
      }
    }
  };

  const onSubmit = (values: FormData) => {
    if (values.ci && values.ci.length >= FORM_CONFIG.minimumCILength) {
      getRegistrations(values.ci);
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
    data: state.data,
    loading: state.loading,
    errorMessage: state.errorMessage,
    getRegistrations,
  };
};
