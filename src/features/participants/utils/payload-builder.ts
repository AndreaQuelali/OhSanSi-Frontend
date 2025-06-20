export function buildOlimpistaPayload(data: any) {
  return {
    olympist_ci: data.olimpista.ci,
    names: data.olimpista.name,
    surnames: data.olimpista.lastname,
    birthdate: data.olimpista.birthday,
    email: data.olimpista.email,
    tutor_ci: data.olimpista.citutor,
    phone: data.olimpista.phone,
    school: data.olimpista.colegio,
    grade_id: data.olimpista.grade,
  };
}

interface LevelPayload {
  level_id: number;
  academic_tutor_ci?: string;
}

export function buildEnrollmentPayload({
  ciOlimpista,
  nivelesSeleccionados,
  tutoresPorArea,
  responsibleCi,
}: {
  ciOlimpista: string;
  nivelesSeleccionados: Record<string, { id_nivel: number; registrado?: boolean }[]>;
  tutoresPorArea: Record<string, string>;
  responsibleCi: string;
}) {
  const levels: LevelPayload[] = Object.entries(nivelesSeleccionados).flatMap(
    ([area, niveles]) =>
      niveles
        .filter((nivel) => !nivel.registrado)
        .map((nivel) => ({
          level_id: nivel.id_nivel,
          ...(tutoresPorArea[area]
            ? { academic_tutor_ci: tutoresPorArea[area] }
            : {}),
        })),
  );

  return {
    ci: ciOlimpista,
    levels,
    responsible_ci: responsibleCi,
  };
}
