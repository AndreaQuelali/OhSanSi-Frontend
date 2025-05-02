import { useState, useEffect } from 'react';

interface FormValidityProps {
  formFieldsValid: boolean;
  nivelesSeleccionados: Record<
    string,
    { id_nivel: number; nombre_nivel: string; registrado?: boolean }[]
  >;
  areasDisponibles: Record<
    string,
    { id_nivel: number; nombre_nivel: string; registrado?: boolean }[]
  >;
  olimpistaError: string | null;
  tutorError: string | null;
}

export function useFormValidity({
  formFieldsValid,
  nivelesSeleccionados,
  areasDisponibles,
  olimpistaError,
  tutorError,
}: FormValidityProps) {
  const [formIsValid, setFormIsValid] = useState(false);

  useEffect(() => {
    const checkFormValidity = () => {
      const hasNewSelections = Object.values(nivelesSeleccionados)
        .flat()
        .some((nivel) => !nivel.registrado);

      const hayAreasDisponibles = Object.keys(areasDisponibles).length > 0;

      return (
        formFieldsValid &&
        !olimpistaError &&
        !tutorError &&
        hasNewSelections &&
        hayAreasDisponibles
      );
    };

    setFormIsValid(checkFormValidity());
  }, [
    formFieldsValid,
    nivelesSeleccionados,
    areasDisponibles,
    olimpistaError,
    tutorError,
  ]);

  return { formIsValid };
}
