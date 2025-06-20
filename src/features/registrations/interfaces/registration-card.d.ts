import { PaymentData, PaymentDataGroup } from './payment-order-modal';
import { RegistrationList } from './registrations-list';

export interface RegistrationCardProps {
  list: RegistrationList;
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
    status: string;
    detail: {
      kind: 'individual' | 'grupal';
      number_of_students?: number;
      number_of_enrollments?: number;
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
