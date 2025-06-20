import html2pdf from 'html2pdf.js';
import {
  PDFGenerationOptions,
  PaymentData,
  PaymentDataGroup,
} from '../interfaces/payment-order-modal';

export const pdfUtils = {
  generatePaymentOrderOptions: (data: PaymentData): PDFGenerationOptions => ({
    margin: 0.5,
    filename: `OrdenPago_${data.nroOrden}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 3 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
  }),

  generatePaymentOrderGroupOptions: (
    data: PaymentDataGroup,
  ): PDFGenerationOptions => ({
    margin: 0.5,
    filename: `OrdenPago_${data.nroOrden}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 3 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
  }),

  downloadPDF: async (
    element: HTMLElement,
    options: PDFGenerationOptions,
  ): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 100));

    try {
      await html2pdf().set(options).from(element).save();
    } catch (error) {
      console.error('Error al generar PDF:', error);
      throw new Error('No se pudo generar el PDF');
    }
  },

  formatCurrency: (amount: number): string => {
    return `${amount.toFixed(2)} Bs`;
  },

  formatTotalInWords: (amount: number): string => {
    return `${amount} Bolivianos`;
  },
};
