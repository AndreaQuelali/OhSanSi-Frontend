import { useRef } from 'react';
import { PaymentData } from '../interfaces/payment-order-modal';
import { pdfUtils } from '../utils/pdf-generator';

export const usePaymentOrderModal = (data: PaymentData) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const handleDownload = async (): Promise<void> => {
    if (!contentRef.current) {
      console.error(
        'No se encontró el elemento de contenido para generar el PDF',
      );
      return;
    }

    try {
      const options = pdfUtils.generatePaymentOrderOptions(data);
      await pdfUtils.downloadPDF(contentRef.current, options);
    } catch (error) {
      console.error('Error al descargar PDF:', error);
      // Aquí podrías agregar una notificación de error para el usuario
      alert('Error al generar el PDF. Por favor, inténtalo de nuevo.');
    }
  };

  const formattedData = {
    ...data,
    formattedUnitario: pdfUtils.formatCurrency(data.unitario),
    formattedTotal: pdfUtils.formatCurrency(data.total),
    totalInWords: pdfUtils.formatTotalInWords(data.total),
  };

  return {
    contentRef,
    handleDownload,
    formattedData,
  };
};
