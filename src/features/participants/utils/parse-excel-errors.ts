export const parseExcelErrors = (resultado: any, message?: string, errorMsg?: string) => {
  let mensaje = message ? `${message}\n` : '';

  const erroresPorEntidad = [
    { key: 'olimpistas_errores', label: 'Errores en olimpistas' },
    { key: 'profesores_errores', label: 'Errores en profesores' },
    { key: 'tutores_errores', label: 'Errores en tutores' },
    { key: 'inscripciones_errores', label: 'Errores en inscripciones' },
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

  return mensaje || errorMsg || 'Error desconocido';
};
