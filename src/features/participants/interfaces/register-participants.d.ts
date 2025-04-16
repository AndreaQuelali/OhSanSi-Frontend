export type Area = {
  id_area: number;
  nombre: string;
  grades: string
};

export type FormAreaPartProps = {
  setStep: (step: number) => void;
  currentStep: number;
};

export type Grado = {
  id_grado: number;
  nombre_grado: string;
};

export type Departamento = {
  id_departamento: number;
  nombre_departamento: string;
};

export type Provincia = {
  id_provincia: number;
  nombre_provincia: string;
  id_departamento: number;
};

export type UnidadEducativa = {
  id_colegio: number;
  nombre_colegio: string;
  id_provincia: number;
};
