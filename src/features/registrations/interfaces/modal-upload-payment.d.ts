export interface ModalUploadPaymentProps {
  onClose: () => void;
  id_lista?: string | number;
}

export interface VerificationResult {
  payment_verification: {
    verified: boolean;
    message: string;
    waiting_list_id?: number;
    received_list_id?: string;
    detalle_errores?: string[];
  } | null;
}

export interface ImageValidationResult {
  valid: boolean;
  url: string;
}

export interface UploadPaymentState {
  dragActive: boolean;
  fileName: string | null;
  imagePreview: string | null;
  enhancedPreview: string | null;
  isSubmitting: boolean;
  verificationResult: VerificationResult | null;
  showSuccess: boolean;
  showError: boolean;
  abortController: AbortController | null;
}
