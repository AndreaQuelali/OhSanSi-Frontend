export const VALIDATION_LIMITS = {
  CI_MIN_LENGTH: 4,
  CI_MAX_LENGTH: 8,
  PHONE_MIN_LENGTH: 8,
  PHONE_MAX_LENGTH: 15,
} as const;

export const VALIDATION_PATTERNS = {
  CI: /^[0-9]+$/,
  NAME: /^[A-ZÑÁÉÍÓÚ]+(?: [A-ZÑÁÉÍÓÚ]+)*$/,
  LASTNAME: /^[A-ZÑÁÉÍÓÚ]+(?: [A-ZÑÁÉÍÓÚ]+)*$/,
  PHONE: /^[0-9]{8,}$/,
  EMAIL: /^[a-zA-Z0-9](?!.*[._-]{2})(\.?[a-zA-Z0-9_-])*@[a-zA-Z0-9](-?[a-zA-Z0-9])*\.[a-zA-Z]{2,}$/,
} as const;

export const ERROR_MESSAGES = {
  REQUIRED_CI: 'El número de cédula es obligatorio',
  INVALID_CI: 'Solo se permiten números',
  CI_MIN_LENGTH: 'Debe tener al menos 4 dígitos',
  CI_MAX_LENGTH: 'No puede tener más de 8 dígitos',

  REQUIRED_NAME: 'El nombre es obligatorio',
  INVALID_NAME: 'Solo se permiten letras mayúsculas y un solo espacio entre palabras',

  REQUIRED_LASTNAME: 'El apellido es obligatorio',
  INVALID_LASTNAME: 'Solo se permiten letras mayúsculas y un solo espacio entre palabras',

  REQUIRED_PHONE: 'El número de celular es obligatorio',
  INVALID_PHONE: 'Debe contener solo números y al menos 8 dígitos',
  PHONE_MAX_LENGTH: 'Debe contener como máximo 15 dígitos',

  REQUIRED_EMAIL: 'El correo electrónico es obligatorio',
  INVALID_EMAIL: 'Correo electrónico no válido',

  DUPLICATE_CI: 'Este número de cédula ya está registrado',

  CONFIRMATION_TEXT_TUTOR: '¿Está seguro de registrar los datos del tutor?',
  SUCCESS_REGISTRATION_TUTOR: 'Registro exitoso del tutor. Si desea registrar a un olimpista, puede continuar con el siguiente paso.',
  ERROR_REGISTRATION_TUTOR: 'Error al registrar el tutor. Por favor, intente nuevamente.',
  NEXT_STEP_TEXT_TUTOR: 'Ir a formulario de registro de olimpista',
} as const;

export const CONFIRMATION_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error',
} as const;

export const ROUTES = {
  HOME: '/',
  REGISTER_TUTOR: '/olympian/register-tutor',
  REGISTER_OLYMPIAN: '/olympian/register-olympians',
  OLYMPIAN_MENU: '/olympian',
} as const;
