// Legacy interfaces - These are deprecated and should use the interfaces from registrations-list.d.ts instead
// This file will be removed in future cleanup

export type Registration = {
  nombre: string;
  ci: string;
  area: string;
  categoria: string;
};

export type List = {
  cantidad: number;
  cantidadOlimpistas: number;
  responsible: string; // Updated to match new API
  ci: string;
  estado: string;
  id_lista?: number;
  kind: 'individual' | 'grupal'; // Updated to match new API
};

export type RegistrationData = {
  list: List;
  registrations: Registration[];
};

export type FormData = {
  ci: string;
};

export type RegistrationsListProps = {
  showGenerateButton?: boolean;
  showUploadButton?: boolean;
  title?: string;
};

// Duplicate definitions below should be removed and replaced with imports from registrations-list.d.ts

export type Registration = {
  nombre: string;
  ci: string;
  area: string;
  categoria: string;
};

export type List = {
  cantidad: number;
  cantidadOlimpistas: number;
  responsible: string; // Updated to match new API
  ci: string;
  estado: string;
  id_lista?: number;
  kind: 'individual' | 'grupal'; // Updated to match new API
};

export type PaymentData = {
  ci: string;
  nombres: string;
  apellidos: string;
  cantidadOlimpistas: number;
  total: number;
  unitario: number;
  levels: { nivel_id: number; nombre_nivel: string; area: string }[]; // Updated to match new API
  totalLiteral: string;
  fecha: string;
  hora: string;
  nroOrden: string;
};

export type Props = {
  list: List;
  registrations: Registration[];
  isAlternate?: boolean;
  showGenerateButton?: boolean;
  showUploadButton?: boolean;
};
