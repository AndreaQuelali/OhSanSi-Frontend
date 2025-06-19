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
    year: number;
    start_date: string;
    end_date: string;
  }>,
): string | true => {
  const overlaps = existingOlympiads.some((olimpiada) => {
    if (olimpiada.year !== year) return false;

    const oIni = new Date(olimpiada.start_date);
    const oEnd = new Date(olimpiada.end_date);
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
  //const now = new Date();
  //const boliviaTime = new Date(now.getTime() - 4 * 60 * 60 * 1000);

  return {
    year: Number(formData.year),
    cost: parseFloat(formData.cost.toString()),
    start_date: formData.dateIni,
    end_date: formData.dateEnd,
    max_categories_per_olympist: Number(formData.limitAreas),
    olympiad_name: formData.inputNameOlimpiada,
    // created_in: boliviaTime.toISOString().slice(0, 19).replace('T', ' '),
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
