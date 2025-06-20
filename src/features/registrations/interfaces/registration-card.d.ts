import { PaymentData, PaymentDataGroup } from './payment-order-modal';

export interface RegistrationCardProps {
  list: {
    id_lista: string | number;
    ci: string;
    responsable: string;
    tipo: 'individual' | 'grupal';
    cantidad: number;
    cantidadOlimpistas: number;
    estado: string;
  };
  registrations: Array<{
    nombre: string;
    ci: string;
    area: string;
    categoria: string;
  }>;
  isAlternate: boolean;
  showGenerateButton: boolean;
  showUploadButton: boolean;
}

export interface PaymentVerificationResponse {
  existe: boolean;
  mensaje: string;
}

export interface EnrollmentResponse {
  listas: Array<{
    id_lista: number;
    detalle: {
      tipo: 'individual' | 'grupal';
    };
  }>;
}

export interface GroupReceiptResponse {
  responsable: {
    ci: string;
    nombres: string;
    apellidos: string;
  };
  pago: {
    total_inscripciones: number;
    total_a_pagar: number;
    monto_unitario: number;
    fecha_pago: string;
    referencia: string;
  };
}

export interface IndividualReceiptResponse {
  responsable: {
    ci: string;
    nombres: string;
    apellidos: string;
  };
  pago: {
    total_inscripciones?: number;
    total_a_pagar: number;
    monto_unitario: number;
    fecha_pago: string;
    referencia: string;
  };
  niveles: Array<{
    nivel_id: number;
    nombre_nivel: string;
    area: string;
  }>;
}

export interface RegistrationCardState {
  showVisualModal: boolean;
  paymentData: (PaymentData | PaymentDataGroup) | null;
  modalTipo: 'individual' | 'grupal' | null;
  showModalUpload: boolean;
}
