export function buildOlimpistaPayload(data: any) {
  return {
    cedula_identidad: data.olimpista.ci,
    nombres: data.olimpista.name,
    apellidos: data.olimpista.lastname,
    fecha_nacimiento: data.olimpista.birthday,
    correo_electronico: data.olimpista.email,
    ci_tutor: data.olimpista.citutor,
    celular: data.olimpista.phone,
    unidad_educativa: data.olimpista.colegio,
    id_grado: data.olimpista.grade,
  };
}

interface NivelPayload {
  id_nivel: number;
  ci_tutor_academico?: number;
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
  const nivelesNuevosFlat: NivelPayload[] = Object.entries(nivelesSeleccionados).flatMap(
    ([area, niveles]) => {
      return niveles
        .filter((nivel) => !nivel.registrado)
        .map((nivel) => ({
          id_nivel: nivel.id_nivel,
          ...(tutoresPorArea[area]
            ? { ci_tutor_academico: parseInt(tutoresPorArea[area]) }
            : {}),
        }));
    },
  );

  return {
    ci: parseInt(ciOlimpista),
    niveles: nivelesNuevosFlat,
    ci_responsable: parseInt(responsibleCi),
  };
}
