export const parseExcelErrors = (resultado: any, message?: string, errorMsg?: string) => {
  let mensaje = message ? `${message}\n` : '';

  const erroresPorEntidad = [
    { key: 'olympists_errors', label: 'Errores en olimpistas' },
    { key: 'teachers_errors', label: 'Errores en profesores' },
    { key: 'tutors_errors', label: 'Errores en tutores' },
    { key: 'enrollments_errors', label: 'Errores en inscripciones' },
    { key: 'Colegio_errores', label: 'Errores en unidad educativa' },
    { key: 'Departamento_errores', label: 'Errores en departamento' },
    { key: 'Provincia_errores', label: 'Errores en provincia' },
    { key: 'Nivel_errores', label: 'Errores en nivel' },
    { key: 'Grado_errores', label: 'Errores en grado' },
  ];

  for (const { key, label } of erroresPorEntidad) {
    const errores = resultado[key];
    if (Array.isArray(errores) && errores.length > 0) {
      mensaje += `\n${label}:\n`;
      errores.forEach((item: any) => {
        const fila = item.fila !== undefined ? `Fila ${item.fila}` : '';
        const ci = item.ci ? ` (CI: ${item.ci})` : '';
        mensaje += `• ${fila}${ci}:\n`;

        if (Array.isArray(item.message)) {
          item.message.forEach((e: string) => {
            mensaje += `    - ${e}\n`;
          });
        } else {
          mensaje += `    - ${item.message ?? 'Error desconocido'}\n`;
        }
      });
    }
  }
  console.log("mensajito:",mensaje)

  return mensaje || errorMsg || 'Error desconocido';
};
