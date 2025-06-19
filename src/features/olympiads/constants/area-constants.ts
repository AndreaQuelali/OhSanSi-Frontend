export const AREA_ERROR_MESSAGES = {
  REQUIRED: 'El nombre del área es obligatorio',
  PATTERN:
    'Solo se permiten letras mayúsculas, guión en medio y un solo espacio entre palabras',
  MAX_LENGTH: 'El nombre no puede exceder los 50 caracteres',
  DUPLICATE: 'Esta área ya se encuentra registrada.',
  REGISTER_SUCCESS: 'Registro exitoso del área.',
  REGISTER_ERROR: 'Error al registrar el área. Por favor, intente nuevamente.',
  VERIFY_ERROR:
    'No se pudo verificar si el área ya existe. Intente nuevamente.',
};

export const AREA_VALIDATION_PATTERNS = {
  NAME: /^[A-ZÑÁÉÍÓÚ]+(?:(?: |-| - | -|- | - )[A-ZÑÁÉÍÓÚ]+)*$/,
};

export const AREA_VALIDATION_LIMITS = {
  MAX_LENGTH: 50,
};
