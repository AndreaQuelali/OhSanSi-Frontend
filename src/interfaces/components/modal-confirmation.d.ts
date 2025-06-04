interface ConfirmationModalProps {
  onClose: () => void;
  status: 'success' | 'error';
  message: string;
  nextStepText?: string;
  onNextStep?: () => void;
};
