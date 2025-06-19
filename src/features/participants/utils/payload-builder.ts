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
