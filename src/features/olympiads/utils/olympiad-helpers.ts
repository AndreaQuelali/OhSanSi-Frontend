
export const normalizeAreaName = (str: string): string =>
  removeAccents(str.toUpperCase())
    .replace(/ ?- ?/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();


export const removeAccents = (str: string): string =>
  str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');


export const validateDateOverlap = (
  dateIni: string,
  dateEnd: string,
  year: number,
  existingOlympiads: Array<{
    gestion: number;
    fecha_inicio: string;
    fecha_fin: string;
  }>,
): string | true => {
  const overlaps = existingOlympiads.some((olimpiada) => {
    if (olimpiada.gestion !== year) return false;

    const oIni = new Date(olimpiada.fecha_inicio);
    const oEnd = new Date(olimpiada.fecha_fin);
    const startDate = new Date(dateIni);
    const endDate = new Date(dateEnd);

    return (
      (startDate >= oIni && startDate <= oEnd) ||
      (endDate >= oIni && endDate <= oEnd) ||
      (oIni >= startDate && oIni <= endDate) ||
      (oEnd >= startDate && oEnd <= endDate)
    );
  });

  if (overlaps) {
    return 'Las fechas se solapan con otra olimpiada existente';
  }

  return true;
};

export const validateDateInYear = (
  date: string,
  year: string,
): string | true => {
  const inputYear = date.split('-')[0];
  if (inputYear !== year) {
    return `La fecha debe estar dentro del año ${year}`;
  }
  return true;
};


export const validateFutureDate = (date: string): string | true => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const selectedDate = new Date(date);
  selectedDate.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    return 'La fecha debe ser igual o posterior a la fecha actual';
  }
  return true;
};

export const validateEndDateAfterStart = (
  startDate: string,
  endDate: string,
): string | true => {
  const dateIni = new Date(startDate);
  const dateEnd = new Date(endDate);

  if (dateEnd <= dateIni) {
    return 'La fecha de cierre debe ser posterior a la fecha de inicio';
  }
  return true;
};

export const createOlympiadPayload = (formData: {
  year: string;
  cost: string;
  dateIni: string;
  dateEnd: string;
  limitAreas: string;
  inputNameOlimpiada: string;
}) => {
  const now = new Date();
  const boliviaTime = new Date(now.getTime() - 4 * 60 * 60 * 1000);

  return {
    gestion: Number(formData.year),
    costo: parseFloat(formData.cost.toString()),
    fecha_inicio: formData.dateIni,
    fecha_fin: formData.dateEnd,
    max_categorias_olimpista: Number(formData.limitAreas),
    nombre_olimpiada: formData.inputNameOlimpiada,
    creado_en: boliviaTime.toISOString().slice(0, 19).replace('T', ' '),
  };
};

export const formatApiError = (error: unknown): string => {
  const apiError = error as {
    data?: {
      errors?: Record<string, string[]>;
      message?: string;
    };
  };

  if (apiError.data?.errors) {
    return Object.values(apiError.data.errors).flat().join('\n');
  }
  return (
    apiError.data?.message || 'Error inesperado. Por favor, intente nuevamente.'
  );
};
