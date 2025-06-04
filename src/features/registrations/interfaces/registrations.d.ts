export type Registration = {
  nombre: string;
  ci: string;
  area: string;
  categoria: string;
};

export type List = {
  cantidad: number;
  cantidadOlimpistas: number;
  responsable: string;
  ci: string;
  estado: string;
  id_lista?: number;
  tipo: 'individual' | 'grupal';
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

export type Registration = {
  nombre: string;
  ci: string;
  area: string;
  categoria: string;
};

export type List = {
  cantidad: number;
  cantidadOlimpistas: number;
  responsable: string;
  ci: string;
  estado: string;
  id_lista?: number;
  tipo: 'individual' | 'grupal';
};

export type PaymentData = {
  ci: string;
  nombres: string;
  apellidos: string;
  cantidadOlimpistas: number;
  total: number;
  unitario: number;
  niveles: { nivel_id: number; nombre_nivel: string; area: string }[];
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
