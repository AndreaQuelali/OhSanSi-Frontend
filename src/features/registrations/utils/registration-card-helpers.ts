import {
  PaymentData,
  PaymentDataGroup,
} from '../interfaces/payment-order-modal';
import {
  GroupReceiptResponse,
  IndividualReceiptResponse,
} from '../interfaces/registration-card';

export const registrationCardUtils = {
  convertNumberToWords: (amount: number): string => {
    return `Son: ${amount} Bolivianos`;
  },
  formatGroupPaymentData: (
    response: GroupReceiptResponse,
  ): PaymentDataGroup => {
    const { responsable, pago } = response;

    return {
      ci: responsable.ci,
      nombres: responsable.nombres,
      apellidos: responsable.apellidos,
      cantidadOlimpistas: pago.total_inscripciones,
      total: pago.total_a_pagar,
      unitario: pago.monto_unitario,
      totalLiteral: registrationCardUtils.convertNumberToWords(
        pago.total_a_pagar,
      ),
      fecha: new Date(pago.fecha_pago).toLocaleDateString(),
      hora: new Date(pago.fecha_pago).toLocaleTimeString(),
      nroOrden: pago.referencia,
    };
  },
  formatIndividualPaymentData: (
    response: IndividualReceiptResponse,
  ): PaymentData => {
    const { responsable, pago, niveles } = response;
    const fechaPago = new Date(pago.fecha_pago);

    return {
      ci: responsable.ci,
      nombres: responsable.nombres,
      apellidos: responsable.apellidos,
      total: pago.total_a_pagar,
      unitario: pago.monto_unitario,
      niveles,
      fecha: fechaPago.toLocaleDateString(),
      hora: fechaPago.toLocaleTimeString(),
      nroOrden: pago.referencia,
    };
  },

  findListById: (
    lists: Array<{
      id_lista: number;
      detalle: { tipo: 'individual' | 'grupal' };
    }>,
    listId: string | number,
  ) => {
    return lists.find((l) => l.id_lista === Number(listId));
  },
};
