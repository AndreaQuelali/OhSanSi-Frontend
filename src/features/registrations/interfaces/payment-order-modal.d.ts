export interface PaymentData {
  ci: string;
  nombres: string;
  apellidos: string;
  total: number;
  fecha: string;
  hora: string;
  nroOrden: string;
  unitario: number;
  niveles: { nivel_id: number; nombre_nivel: string; area: string }[];
}

export interface PaymentDataGroup {
  ci: string;
  nombres: string;
  apellidos: string;
  cantidadOlimpistas: number;
  unitario: number;
  total: number;
  totalLiteral: string;
  fecha: string;
  hora: string;
  nroOrden: string;
}

export interface PaymentOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: PaymentData;
}

export interface PaymentOrderGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: PaymentDataGroup;
}

export interface PDFGenerationOptions {
  margin: number;
  filename: string;
  image: {
    type: string;
    quality: number;
  };
  html2canvas: {
    scale: number;
  };
  jsPDF: {
    unit: string;
    format: string;
    orientation: string;
  };
}
