export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export const isInRegistrationPeriod = (startDate: string, endDate: string) => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  now.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);

  return now >= start && now <= end;
};

export const getRegistrationStatus = (startDate: string, endDate: string) => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  now.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);

  if (now < start) {
    return {
      status: 'not-started' as const,
      message: 'Las inscripciones aún no han comenzado',
    };
  } else if (now > end) {
    return {
      status: 'ended' as const,
      message: 'El período de inscripciones ha finalizado',
    };
  } else {
    return {
      status: 'active' as const,
      message: '¡Las inscripciones están abiertas!',
    };
  }
};

export const getCurrentYear = () => {
  return new Date().getFullYear();
};
