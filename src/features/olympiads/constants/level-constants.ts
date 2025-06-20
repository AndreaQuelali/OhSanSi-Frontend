export const LEVEL_ERROR_MESSAGES = {
  REQUIRED: 'El nombre del nivel es obligatorio',
  PATTERN:
    'Solo se permiten letras, números, guiones en medio y un solo espacio entre palabras',
  MAX_LENGTH: 'El nombre no puede exceder los 30 caracteres',
  DUPLICATE: 'Este nivel ya se encuentra registrado.',
  REGISTER_SUCCESS: 'Registro exitoso del nivel.',
  REGISTER_ERROR: 'Error al registrar el nivel. Por favor, intente nuevamente.',
  VERIFY_ERROR:
    'No se pudo verificar si el nivel ya existe. Intente nuevamente.',
};

export const LEVEL_VALIDATION_PATTERNS = {
  NAME: /^[A-Za-zÑñÁÉÍÓÚáéíóú0-9]+(?:(?: |-| - | -|- | - )[A-Za-zÑñÁÉÍÓÚáéíóú0-9]+)*$/,
};

export const LEVEL_VALIDATION_LIMITS = {
  MAX_LENGTH: 30,
};
