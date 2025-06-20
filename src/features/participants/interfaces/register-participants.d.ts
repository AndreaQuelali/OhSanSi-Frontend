export type Area = {
  id_area: number;
  nombre: string;
  grades: string;
};

export type FormAreaPartProps = {
  setStep: (step: number) => void;
  currentStep: number;
};

export type Grado = {
  grade_id: number;
  grade_name: string;
};

export type Departamento = {
  department_id: number;
  department_name: string;
};

export type Provincia = {
  province_id: number;
  province_name: string;
  department_id: number;
};

export type UnidadEducativa = {
  school_id: number;
  school_name: string;
  province_id: number;
};

export type FormValues = {
  olimpista: {
    ci: string;
    citutor: string;
    name: string;
    lastname: string;
    email: string;
    birthday: string;
    phone: string;
    depa: string;
    prov: string;
    colegio: string;
    grade: string;
    existing: boolean;
  };
};
