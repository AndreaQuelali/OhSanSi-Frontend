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
  showGenerateButton?: boolean; // opcional, por defecto false
  showUploadButton?: boolean;
  title?: string;
};
