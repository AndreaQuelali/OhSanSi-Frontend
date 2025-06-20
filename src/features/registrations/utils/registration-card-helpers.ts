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
    const { responsible, payment } = response;

    return {
      ci: responsible.ci,
      nombres: responsible.names,
      apellidos: responsible.surnames,
      cantidadOlimpistas: payment.total_registrations,
      total: payment.total_to_pay,
      unitario: payment.unit_amount,
      totalLiteral: registrationCardUtils.convertNumberToWords(
        payment.total_to_pay,
      ),
      fecha: new Date(payment.payment_date).toLocaleDateString(),
      hora: new Date(payment.payment_date).toLocaleTimeString(),
      nroOrden: payment.reference,
    };
  },
  formatIndividualPaymentData: (
    response: IndividualReceiptResponse,
  ): PaymentData => {
    const { responsible, payment, levels } = response;
    const paymentDate = new Date(payment.payment_date);

    return {
      ci: responsible.ci,
      nombres: responsible.names,
      apellidos: responsible.surnames,
      total: payment.total_to_pay,
      unitario: payment.unit_amount,
      niveles: levels.map((level) => ({
        nivel_id: level.level_id,
        nombre_nivel: level.level_name,
        area: level.area,
      })),
      fecha: paymentDate.toLocaleDateString(),
      hora: paymentDate.toLocaleTimeString(),
      nroOrden: payment.reference,
    };
  },
  findListById: (
    lists: Array<{
      list_id: number;
      detail: { kind: 'individual' | 'grupal' };
    }>,
    listId: string | number,
  ) => {
    return lists.find((l) => l.list_id === Number(listId));
  },
};
