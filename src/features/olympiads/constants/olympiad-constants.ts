
export const YEAR_OPTIONS = [
  { id: '2025', name: '2025' },
  { id: '2026', name: '2026' },
  { id: '2027', name: '2027' },
  { id: '2028', name: '2028' },
];


export const VALIDATION_LIMITS = {
  MAX_OLYMPIAD_NAME_LENGTH: 50,
  MIN_COST: 0.01,
  MIN_LIMIT_AREAS: 1,
  MAX_LIMIT_AREAS: 15,
  PAGINATION_PER_PAGE: 3,
} as const;


export const VALIDATION_PATTERNS = {
  OLYMPIAD_NAME: /^[A-ZÑÁÉÍÓÚ]+(?:(?: |-| - | -|- | - )[A-ZÑÁÉÍÓÚ]+)*$/,
  COST: /^\d+(\.\d{1,2})?$/,
  POSITIVE_INTEGER: /^[0-9]+$/,
} as const;

export const ERROR_MESSAGES = {
  REQUIRED_YEAR: 'Debe seleccionar un año/gestión',
  REQUIRED_OLYMPIAD_NAME: 'El nombre de la olimpiada es obligatorio',
  INVALID_OLYMPIAD_NAME:
    'Solo se permiten letras mayúsculas, guion en medio y un solo espacio entre palabras',
  MAX_LENGTH_OLYMPIAD_NAME: 'El nombre no puede exceder los 50 caracteres',
  OLYMPIAD_NAME_EXISTS:
    'El nombre de la Olimpiada ya está registrada en la gestión actual',
  SELECT_YEAR_FIRST: 'Seleccione un año primero',
  INVALID_COST: 'El costo debe ser un número positivo con hasta dos decimales',
  REQUIRED_COST: 'Se debe ingresar un valor mayor a 0.00',
  MIN_COST: 'Se debe ingresar un valor mayor a 0.00',
  INVALID_LIMIT_AREAS:
    'El límite debe ser un número entero positivo sin comas ni puntos',
  REQUIRED_LIMIT_AREAS: 'Se debe ingresar un valor mayor a 0',
  MIN_LIMIT_AREAS: 'Se debe ingresar un valor mayor a 0',
  MAX_LIMIT_AREAS: 'Se debe ingresar un valor menor o igual a 15',
  REQUIRED_START_DATE: 'Debe ingresar una fecha de inicio',
  REQUIRED_END_DATE: 'Debe ingresar una fecha de cierre',
  SELECT_START_DATE_FIRST: 'Debe ingresar la fecha de inicio primero',
  CONFIRM_REGISTRATION:
    '¿Estás seguro de que deseas registrar esta información?',
  SUCCESS_REGISTRATION: 'Registro exitoso de la olimpiada',
  ERROR_REGISTRATION:
    'Error al registrar la olimpiada. Por favor, intente nuevamente.',
} as const;


export const CONFIRMATION_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error',
} as const;


export const ROUTES = {
  ADMINISTRATOR: '/administrator',
  REGISTER_AREAS: '/register-areas',
  REGISTER_LEVELS: '/register-levels',
} as const;
