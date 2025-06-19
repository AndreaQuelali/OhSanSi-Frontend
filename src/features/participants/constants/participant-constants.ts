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
  INVALID_NAME: 'Solo se permiten letras y un solo espacio entre palabras',

  REQUIRED_LASTNAME: 'El apellido es obligatorio',
  INVALID_LASTNAME: 'Solo se permiten letras y un solo espacio entre palabras',

  REQUIRED_PHONE: 'El número de celular es obligatorio',
  INVALID_PHONE: 'Debe contener solo números y al menos 8 dígitos',
  PHONE_MAX_LENGTH: 'Debe contener como máximo 15 dígitos',

  REQUIRED_EMAIL: 'El correo electrónico es obligatorio',
  INVALID_EMAIL: 'Correo electrónico no válido',

  DUPLICATE_CI: 'Este número de cédula ya está registrado',

  CONFIRMATION_TEXT_TUTOR: '¿EstáS seguro de registrar los datos del tutor?',
  SUCCESS_REGISTRATION_TUTOR: 'Registro exitoso del tutor. Si desea registrar a un olimpista, puede continuar con el siguiente paso.',
  ERROR_REGISTRATION_TUTOR: 'Error al registrar el tutor. Por favor, intente nuevamente.',
  NEXT_STEP_TEXT_TUTOR: 'Ir a formulario de registro de olimpista',

  REQUIRED_BIRTHDATE: 'La fecha de nacimiento es obligatoria',
  INVALID_BIRTHDATE: 'Debe tener entre 6 y 18 años',

  DEPARTMENT_REQUIRED: 'El departamento es obligatorio',
  PROVINCE_REQUIRED: 'La provincia es obligatoria',
  SCHOOL_REQUIRED: 'La unidad educativa es obligatoria',
  GRADE_REQUIRED: 'El grado es obligatorio',

  CONFIRMATION_TEXT_OLYMPIAN: '¿Estás seguro de que deseas registrar esta información?',
  NEXT_STEP_TEXT_OLYMPIAN: 'Ir a registro de olimpista en áreas de competencia',

  TUTOR_CI_UNREGISTERED: 'Este CI de tutor no está registrado.',

  PROVINCE_LOADING_ERROR: 'Error al cargar las provincias:',
  DEPARTMENT_LOADING_ERROR: 'Error al cargar las unidades educativas:',

  SUCCESS_REGISTRATION_OLYMPIAN: 'Registro exitoso del olimpista. Si desea inscribir al olimpista en áreas de competencia, puede continuar con el siguiente paso.',
  ERROR_REGISTRATION_OLYMPPIAN: 'Error al registrar al olimpista',

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
  REGISTER_SELECTED_AREAS: '/olympian/register-selected-areas',
} as const;

export const MESSAGES = {
  FORM_OLYMPIAN_CI_REGISTERED: 'Este número de cédula ya está registrado. Si desea inscribir al olimpista en áreas de competencia, puede continuar con el siguiente paso.',
  FORM_TUTOR_CI_REGISTERED: 'Este número de cédula ya está registrado. Si desea registrar a un olimpista, puedes continuar con el siguiente paso.',
} as const;
