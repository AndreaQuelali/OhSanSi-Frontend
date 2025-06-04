interface ModalProps {
  text?: string;
  onConfirm?: () => void;
  onClose: () => void;
  children?: React.ReactNode; // Aceptar children como propiedad
}