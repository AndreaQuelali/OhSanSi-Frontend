import { useState } from 'react';
import { CONFIRMATION_STATUS } from '../constants/participant-constants';

type ConfirmationStatus = 'success' | 'error' | 'alert' | null;

export const useConfirmationParticipant = () => {
  const [showModal, setShowModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationStatus, setConfirmationStatus] =
    useState<ConfirmationStatus>(null);
  const [confirmationMessage, setConfirmationMessage] = useState<string>('');

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const showConfirmation = (
    status: 'success' | 'error' | 'alert',
    message: string,
  ) => {
    setConfirmationStatus(status);
    setConfirmationMessage(message);
    setShowConfirmationModal(true);
  };

  const closeConfirmationModal = (onSuccessCallback?: () => void) => {
    setShowConfirmationModal(false);
    if (
      confirmationStatus === CONFIRMATION_STATUS.SUCCESS &&
      onSuccessCallback
    ) {
      onSuccessCallback();
    }
    setConfirmationStatus(null);
    setConfirmationMessage('');
  };

  const showSuccess = (message: string) => {
    showConfirmation(CONFIRMATION_STATUS.SUCCESS, message);
  };

  const showError = (message: string) => {
    showConfirmation(CONFIRMATION_STATUS.ERROR, message);
  };

  const showAlert = (message: string) => {
    showConfirmation(CONFIRMATION_STATUS.ALERT, message);
  };

  return {
    showModal,
    showConfirmationModal,
    confirmationStatus,
    confirmationMessage,

    openModal,
    closeModal,
    showConfirmation,
    closeConfirmationModal,
    showSuccess,
    showError,
    showAlert,
  };
};
