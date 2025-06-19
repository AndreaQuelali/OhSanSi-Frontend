import { useState } from 'react';

export function useConfirmationModal() {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationStatus, setConfirmationStatus] = useState<'success' | 'error' | 'alert' | null>(null);
  const [confirmationMessage, setConfirmationMessage] = useState<string>('');

  const openConfirmationModal = (status: 'success' | 'error' | 'alert', message: string) => {
    setConfirmationStatus(status);
    setConfirmationMessage(message);
    setShowConfirmationModal(true);
  };

  const closeConfirmationModal = () => {
    setShowConfirmationModal(false);
    setConfirmationStatus(null);
    setConfirmationMessage('');
  };

  return {
    showConfirmationModal,
    confirmationStatus,
    confirmationMessage,
    openConfirmationModal,
    closeConfirmationModal,
    setConfirmationStatus,
    setConfirmationMessage,
  };
} 