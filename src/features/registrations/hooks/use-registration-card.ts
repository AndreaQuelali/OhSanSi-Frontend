import { useState } from 'react';
import {
  RegistrationCardState,
  RegistrationCardProps,
} from '../interfaces/registration-card';
import { registrationCardService } from '../services/registration-card-api';
import { registrationCardUtils } from '../utils/registration-card-helpers';

export const useRegistrationCard = (list: RegistrationCardProps['list']) => {
  const [state, setState] = useState<RegistrationCardState>({
    showVisualModal: false,
    paymentData: null,
    modalType: null,
    showModalUpload: false,
  });

  const updateState = (updates: Partial<RegistrationCardState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const handleOpenVisualModal = async (showUploadButton: boolean) => {
    try {
      // Verificar comprobante de pago si es necesario
      if (showUploadButton) {
        const paymentCheck = await registrationCardService.checkPaymentExists(
          list.ci,
        );
        if (!paymentCheck.exists) {
          alert(paymentCheck.message);
          return;
        }
      } // Obtener inscripciones
      const enrollmentData = await registrationCardService.getEnrollmentsByCI(
        list.ci,
      );
      const lists = enrollmentData.lists;

      // Buscar lista específica
      const listaEncontrada = registrationCardUtils.findListById(
        lists,
        list.id_lista,
      );
      if (!listaEncontrada) {
        throw new Error('No se encontró la lista de inscripción');
      }

      const tipo = listaEncontrada.detail.kind as 'individual' | 'grupal';

      let paymentDataTemp;

      if (tipo === 'grupal') {
        const response = await registrationCardService.getGroupReceipt(
          list.id_lista,
        );
        paymentDataTemp =
          registrationCardUtils.formatGroupPaymentData(response);
      } else {
        const response = await registrationCardService.getIndividualReceipt(
          list.id_lista,
        );
        paymentDataTemp =
          registrationCardUtils.formatIndividualPaymentData(response);
      }
      updateState({
        modalType: tipo,
        paymentData: paymentDataTemp,
        showVisualModal: true,
      });
    } catch (error) {
      console.error('Error al abrir boleta', error);
      alert(
        'Error al obtener los datos de la boleta. Por favor, inténtalo de nuevo.',
      );
    }
  };

  const handleOpenModalUpload = () => {
    updateState({ showModalUpload: true });
  };
  const handleCloseVisualModal = () => {
    updateState({
      showVisualModal: false,
      paymentData: null,
      modalType: null,
    });
  };

  const handleCloseUploadModal = () => {
    updateState({ showModalUpload: false });
  };

  return {
    state,
    handlers: {
      handleOpenVisualModal,
      handleOpenModalUpload,
      handleCloseVisualModal,
      handleCloseUploadModal,
    },
  };
};
