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
  EMAIL:
    /^[a-zA-Z0-9](?!.*[._-]{2})(\.?[a-zA-Z0-9_-])*@[a-zA-Z0-9](-?[a-zA-Z0-9])*\.[a-zA-Z]{2,}$/,
  CI_RESPONSIBLE: /^(?! )[0-9]+(?<! )$/,
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

  CONFIRMATION_TEXT_TUTOR: '¿Estás seguro de registrar los datos del tutor?',
  SUCCESS_REGISTRATION_TUTOR:
    'Registro exitoso del tutor. Si desea registrar a un olimpista, puede continuar con el siguiente paso.',
  ERROR_REGISTRATION_TUTOR:
    'Error al registrar el tutor. Por favor, intente nuevamente.',
  NEXT_STEP_TEXT_TUTOR: 'Ir a formulario de registro de olimpista',

  REQUIRED_BIRTHDATE: 'La fecha de nacimiento es obligatoria',
  INVALID_BIRTHDATE: 'Debe tener entre 6 y 18 años',

  DEPARTMENT_REQUIRED: 'El departamento es obligatorio',
  PROVINCE_REQUIRED: 'La provincia es obligatoria',
  SCHOOL_REQUIRED: 'La unidad educativa es obligatoria',
  GRADE_REQUIRED: 'El grado es obligatorio',

  CONFIRMATION_TEXT_OLYMPIAN:
    '¿Estás seguro de que deseas registrar esta información?',
  NEXT_STEP_TEXT_OLYMPIAN: 'Ir a registro de olimpista en áreas de competencia',

  TUTOR_CI_UNREGISTERED: 'Este CI de tutor no está registrado.',

  PROVINCE_LOADING_ERROR: 'Error al cargar las provincias:',
  DEPARTMENT_LOADING_ERROR: 'Error al cargar las unidades educativas:',

  SUCCESS_REGISTRATION_OLYMPIAN:
    'Registro exitoso del olimpista. Si desea inscribir al olimpista en áreas de competencia, puede continuar con el siguiente paso.',
  ERROR_REGISTRATION_OLYMPIAN: 'Error al registrar al olimpista',

  NEXT_STEP_TEXT_EXCEL: 'Ir a generar boleta de orden de pago.',
  MODAL_ERROR_TITLE: 'Error en el archivo Excel',
  CONFIRMATION_TEXT_EXCEL: '¿Estás seguro de que deseas registrar los datos?',
  CI_RESPONSIBLE_REQUIRED: 'Debe ingresar la cédula del responsable.',
  CI_RESPONSIBLE_INVALID: 'Solo se permiten números y no puede haber espacios.',
  ERROR_REGISTER_EXCEL:
    'Hubo un error al registrar los datos. Verifique el formato del Excel.',
  ERROR_REGISTER_DATA_EXCEL: 'Error al registrar los datos:',
  SUCCESS_REGISTRATION_EXCEL:
    'Datos registrados exitosamente. Si desea generar la boleta de orden de pago, puede continuar con el siguiente paso.',
  CI_RESPONSIBLE_WARNING: 'Debe ingresar el CI del responsable.',
  REGISTER_NO_DATA: 'No hay datos para registrar.',
  INCORRECT_FORMAT:
    'No se pudo procesar el archivo. Asegúrate de que el formato es correcto.',

  NEXT_STEP_AREAS: 'Ir a generar boleta de orden de pago.',
  ERROR_REGISTRATION_AREAS:
    'Error al realizar el registro. Por favor intente nuevamente.',
  SUCCESS_REGISTRATION_AREAS:
    'Registro exitoso. Si desea generar la boleta de orden de pago, puede continuar con el siguiente paso.',
  REGISTER_NO_LEVELS: 'No hay nuevos niveles para registrar.',
  REGISTER_NO_LEVELS_AREA: 'No hay nuevos niveles para registrar en esta área.',
  ADD_OLYMPIAN_CI: 'Por favor, ingrese la cédula del olimpista.',
  LEVELS_ALREADY_REGISTERED: 'No puedes deseleccionar niveles ya registrados.',
  UNREGISTER_LEVEL: 'No puedes deseleccionar un nivel ya registrado.',
} as const;

export const CONFIRMATION_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error',
  ALERT: 'alert',
} as const;

export const ROUTES = {
  HOME: '/',
  REGISTER_TUTOR: '/olympian/register-tutor',
  REGISTER_OLYMPIAN: '/olympian/register-olympians',
  OLYMPIAN_MENU: '/olympian',
  REGISTER_SELECTED_AREAS: '/olympian/register-selected-areas',
  DOWNLOAD_EXCEL_TEMPLATE: '/templates/template-excel.xlsx',
  GENERATE_ORDER_PAYMENT: '/olympian/generate-order-payment',
} as const;

export const MESSAGES = {
  FORM_OLYMPIAN_CI_REGISTERED:
    'Este número de cédula ya está registrado. Si desea inscribir al olimpista en áreas de competencia, puede continuar con el siguiente paso.',
  FORM_TUTOR_CI_REGISTERED:
    'Este número de cédula ya está registrado. Si desea registrar a un olimpista, puedes continuar con el siguiente paso.',
} as const;
