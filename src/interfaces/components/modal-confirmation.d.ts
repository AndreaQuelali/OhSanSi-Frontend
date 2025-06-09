interface ConfirmationModalProps {
  onClose: () => void;
  status: 'success' | 'error' | 'alert';
  message: string;
  nextStepText?: string;
  onNextStep?: () => void;
}
