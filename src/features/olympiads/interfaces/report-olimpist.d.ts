export type FormData = {
  olympiad: string;
  area: string;
  level: string;
  grade: string;
  depa: string;
  prov: string;
  colegio: string;
};

export interface Participant {
  Apellido: string;
  Nombre: string;
  Departamento: string;
  Provincia: string;
  UnidadEducativa: string;
  Grado: string;
  Area: string;
  NivelCategoria: string;
}

export type FilterState = {
  selectedAreas: string[];
  selectedLevels: string[];
  selectedGrades: string[];
  selectedDepartamentos: string[];
  selectedProvincias: string[];
  selectedColegios: string[];
}; 