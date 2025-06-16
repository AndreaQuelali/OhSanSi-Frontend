export interface OlympiadData {
  id_olimpiada: number;
  gestion: number;
  fecha_inicio: string;
  fecha_fin: string;
  nombre_olimpiada: string;
  costo: number;
  max_categorias_olimpista: number;
  creado_en: string;
}

export interface CreateOlympiadPayload {
  gestion: number;
  costo: number;
  fecha_inicio: string;
  fecha_fin: string;
  max_categorias_olimpista: number;
  nombre_olimpiada: string;
  creado_en: string;
}

export interface AreaData {
  id: number;
  area: string;
}
