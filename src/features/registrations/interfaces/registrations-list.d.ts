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
  exists: boolean;
  message: string;
}

export interface EnrollmentApiResponse {
  responsible: {
    names?: string;
    surnames?: string;
    ci?: number;
  };
  lists: Array<{
    list_id: string | number;
    status?: string;
    detail: {
      kind: 'individual' | 'grupal';
      registration_quantity?: number;
      olympist?: {
        olympist_ci?: number;
        names?: string;
        surnames?: string;
      };
      levels?: Array<{
        level_id?: number;
        name_level?: string;
        name_area?: string;
      }>;
      // Para registros grupales
      number_of_students?: number;
      number_of_enrollments?: number;
    };
  }>;
}
