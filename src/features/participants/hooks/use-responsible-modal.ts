import { useState } from 'react';

export function useResponsibleModal() {
  const [showResponsibleModal, setShowResponsibleModal] = useState(false);

  const openResponsibleModal = () => setShowResponsibleModal(true);
  const closeResponsibleModal = () => setShowResponsibleModal(false);

  return {
    showResponsibleModal,
    openResponsibleModal,
    closeResponsibleModal,
    setShowResponsibleModal,
  };
} 