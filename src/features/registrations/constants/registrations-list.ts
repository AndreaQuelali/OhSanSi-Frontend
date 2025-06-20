export const REGISTRATION_VALIDATION_RULES = {
  ci: {
    required: 'El CI es obligatorio',
    minLength: { value: 4, message: 'Debe tener al menos 4 dígitos' },
  },
} as const;

export const FORM_CONFIG = {
  mode: 'onChange' as const,
  minimumCILength: 4,
};

export const API_ENDPOINTS = {
  payment: (ci: string) => `/payment/${ci}`,
  enrollmentsPending: (ci: string) => `/enrollments/${ci}/PENDIENTE`,
  enrollmentsPendingUpload: (ci: string) => `/enrollments/pending/${ci}`,
  enrollmentsAll: (ci: string) => `/enrollments/${ci}/TODOS`,
} as const;

export const ERROR_MESSAGES = {
  paymentConsultError: 'Error al consultar el estado del pago.',
  enrollmentConsultError: 'Error al consultar las inscripciones.',
  noEnrollmentsFound: 'No se encontraron inscripciones asociadas.',
  invalidListsFormat: "El campo 'lists' no es un arreglo.",
} as const;

export const DEFAULT_VALUES = {
  noCI: 'Sin CI',
  noArea: 'Sin área',
  noCategory: 'Sin categoría',
  pendingStatus: 'Pendiente',
} as const;
