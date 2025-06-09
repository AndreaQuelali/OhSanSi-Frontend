export interface OlympiadInfo {
  id_olimpiada: number;
  gestion: number;
  costo: string;
  fecha_inicio: string;
  fecha_fin: string;
  creado_en: string;
  max_categorias_olimpista: number;
  nombre_olimpiada: string;
}

export interface OlympiadStatistics {
  total_areas: number;
  total_niveles: number;
  total_inscritos: number;
}
