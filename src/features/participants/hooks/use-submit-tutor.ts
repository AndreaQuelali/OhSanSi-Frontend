// hooks/useSubmitTutor.ts
import { useState } from 'react';
import { useApiForm } from '@/hooks/use-api-form';
import { ERROR_MESSAGES } from '../constants/participant-constants';
import { useConfirmationParticipant } from '../hooks';
import { FormData } from '../interfaces/form-tutor';

export const useSubmitTutor = () => {
  const { submitForm } = useApiForm('/tutors');
  const [formData, setFormData] = useState<FormData | null>(null);
  const [showModal, setShowModal] = useState(false);
  const {
    showConfirmationModal,
    confirmationStatus,
    confirmationMessage,
    closeConfirmationModal,
    showSuccess,
    showError,
  } = useConfirmationParticipant();

  const onSubmit = (data: FormData) => {
    setFormData(data);
    setShowModal(true);
  };

  const onConfirm = async () => {
    if (!formData) return;
    const payload = {
      nombres: formData.name,
      apellidos: formData.lastname,
      ci: formData.ci,
      celular: formData.phone,
      correo_electronico: formData.email,
    };

    try {
      const response = await submitForm(payload);
      if (response) {
        showSuccess(ERROR_MESSAGES.SUCCESS_REGISTRATION_TUTOR);
      }
    } catch (error: any) {
      if (error.data?.errors) {
        const messages = Object.values(error.data.errors).flat().join('\n');
        showError(messages);
      } else {
        showError(error.data?.message || ERROR_MESSAGES.ERROR_REGISTRATION_TUTOR);
      }
    }

    setShowModal(false);
  };

  return {
    onSubmit,
    onConfirm,
    showModal,
    setShowModal,
    closeConfirmationModal,
    showConfirmationModal,
    confirmationStatus,
    confirmationMessage,
  };
};
