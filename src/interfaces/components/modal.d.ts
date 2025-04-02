interface ModalProps {
  text: string;
  onClose: () => void;
  onConfirm: () => void;
  children?: React.ReactNode; // Aceptar children como propiedad
}