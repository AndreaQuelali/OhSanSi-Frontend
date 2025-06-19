export interface RegistrationsListProps {
  showGenerateButton?: boolean;
  title?: string;
  showUploadButton?: boolean;
}

export interface FormData {
  ci: string;
}

export interface Registration {
  nombre: string;
  ci: string;
  area: string;
  categoria: string;
}

export interface RegistrationList {
  cantidad: number;
  cantidadOlimpistas: number;
  responsable: string;
  ci: string;
  estado: string;
  id_lista: string | number;
  tipo: 'individual' | 'grupal';
}

export interface RegistrationData {
  list: RegistrationList;
  registrations: Registration[];
}

export interface RegistrationsListState {
  data: RegistrationData[];
  loading: boolean;
  errorMessage: string;
}

export interface PaymentResponse {
  existe: boolean;
  mensaje: string;
}

export interface EnrollmentApiResponse {
  responsable: {
    nombres?: string;
    apellidos?: string;
    ci?: string;
  };
  listas: Array<{
    id_lista: string | number;
    estado?: string;
    detalle: {
      tipo: 'individual' | 'grupal';
      olimpista?: {
        nombres?: string;
        apellidos?: string;
        ci?: string;
      };
      niveles?: Array<{
        area?: string;
        nombre?: string;
      }>;
      cantidad_inscripciones?: number;
      cantidad_estudiantes?: number;
    };
  }>;
}
