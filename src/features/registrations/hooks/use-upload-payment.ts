import { useRef, useState } from 'react';
import { UploadPaymentState } from '../interfaces/modal-upload-payment';
import { imageValidationUtils } from '../utils/image-validation';
import { paymentUploadService } from '../services/payment-upload-api';

export const useUploadPayment = (
  onClose: () => void,
  id_lista?: string | number,
) => {
  const [state, setState] = useState<UploadPaymentState>({
    dragActive: false,
    fileName: null,
    imagePreview: null,
    enhancedPreview: null,
    isSubmitting: false,
    verificationResult: null,
    showSuccess: false,
    showError: false,
    abortController: null,
  });

  const ref = useRef<HTMLInputElement>(null);

  const updateState = (updates: Partial<UploadPaymentState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const processFile = async (file: File) => {
    if (!imageValidationUtils.isValidImage(file)) {
      alert('Archivo inválido. Solo se permiten imágenes (.jpg, .jpeg, .png)');
      if (ref.current) ref.current.value = '';
      return;
    }

    if (!imageValidationUtils.isUnder5MB(file)) {
      alert('Archivo demasiado grande. El tamaño máximo es 5 MB.');
      if (ref.current) ref.current.value = '';
      return;
    }

    imageValidationUtils.hasMinimumResolution(file, async (valid, url) => {
      if (!valid) {
        alert('La imagen debe tener al menos 300x300 píxeles.');
        if (ref.current) ref.current.value = '';
        return;
      }

      try {
        const enhancedFile =
          await imageValidationUtils.enhanceImageQuality(file);
        const enhancedUrl = URL.createObjectURL(enhancedFile);

        updateState({
          fileName: file.name,
          imagePreview: url,
          enhancedPreview: enhancedUrl,
        });
      } catch (error) {
        console.error('Error al mejorar la imagen:', error);
        alert('Ocurrió un error al procesar la imagen.');
      }
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    updateState({ dragActive: false });
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    updateState({ dragActive: true });
  };

  const handleDragLeave = () => {
    updateState({ dragActive: false });
  };

  const handleSubmitImage = async () => {
    if (!state.enhancedPreview) {
      alert('No hay imagen para subir');
      return;
    }

    const controller = new AbortController();
    updateState({
      abortController: controller,
      isSubmitting: true,
      verificationResult: null,
      showSuccess: false,
      showError: false,
    });

    try {
      const response = await fetch(state.enhancedPreview);
      const imageBlob = await response.blob();
      const result = await paymentUploadService.uploadPaymentReceipt(
        imageBlob,
        state.fileName || 'comprobante.jpg',
        id_lista, // Se mantiene id_lista como parámetro del hook, pero internamente se convierte a list_id
        controller.signal,
      );

      updateState({ verificationResult: result });

      if (result.verificacion_pago === null) {
        updateState({ showError: true });
        return;
      }

      if (
        result.verificacion_pago?.verificado &&
        !result.verificacion_pago?.mensaje?.includes('ya había sido verificado')
      ) {
        updateState({ showSuccess: true });
        setTimeout(() => {
          onClose();
          window.location.reload();
        }, 3000);
      } else {
        updateState({ showError: true });
      }
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        (error.name === 'AbortError' || error.name === 'CanceledError')
      ) {
        console.log('Subida cancelada por el usuario');
        return;
      }
      console.error('Error al procesar la imagen:', error);
      updateState({ showError: true });
    } finally {
      updateState({
        isSubmitting: false,
        abortController: null,
      });
    }
  };

  const handleCancel = () => {
    if (state.abortController) {
      state.abortController.abort();
    }

    updateState({
      isSubmitting: false,
      showError: false,
      showSuccess: false,
      verificationResult: null,
      fileName: null,
      imagePreview: null,
      enhancedPreview: null,
      abortController: null,
    });

    if (ref.current) {
      ref.current.value = '';
    }

    onClose();
  };

  const handleRetry = () => {
    updateState({
      showError: false,
      showSuccess: false,
      verificationResult: null,
      fileName: null,
      imagePreview: null,
      enhancedPreview: null,
    });
    if (ref.current) ref.current.value = '';
  };

  return {
    state,
    ref,
    handlers: {
      handleFileChange,
      handleDrop,
      handleDragOver,
      handleDragLeave,
      handleSubmitImage,
      handleCancel,
      handleRetry,
    },
  };
};
