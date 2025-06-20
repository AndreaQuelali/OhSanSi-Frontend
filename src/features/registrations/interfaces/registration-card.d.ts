import { PaymentData, PaymentDataGroup } from './payment-order-modal';
import { ListItem } from './registrations-list';

export interface RegistrationCardProps {
  list: ListItem;
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
  exists: boolean;
  message: string;
}

export interface EnrollmentResponse {
  lists: Array<{
    list_id: number;
    detail: {
      kind: 'individual' | 'grupal';
    };
  }>;
}

export interface GroupReceiptResponse {
  responsible: {
    ci: string;
    names: string;
    surnames: string;
  };
  payment: {
    id: number;
    reference: string;
    unit_amount: number;
    total_registrations: number;
    total_to_pay: number;
    status: string | null;
    payment_date: string;
  };
  group_detail: {
    unique_participants: number;
  };
}

export interface IndividualReceiptResponse {
  responsible: {
    ci: string;
    names: string;
    surnames: string;
  };
  payment: {
    id: number;
    reference: string;
    unit_amount: number;
    total_registrations?: number;
    total_to_pay: number;
    status: string | null;
    payment_date: string;
  };
  olympist: {
    ci: number;
    names: string;
    surnames: string;
  };
  levels: Array<{
    level_id: number;
    level_name: string;
    area: string;
  }>;
}

export interface RegistrationCardState {
  showVisualModal: boolean;
  paymentData: (PaymentData | PaymentDataGroup) | null;
  modalType: 'individual' | 'grupal' | null;
  showModalUpload: boolean;
}
