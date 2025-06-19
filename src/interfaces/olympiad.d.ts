export interface OlympiadInfo {
  olympiad_id: number;
  year: number;
  cost: string;
  start_date: string;
  end_date: string;
  created_in: string;
  max_categories_per_olympist: number;
  olympiad_name: string;
}

export interface OlympiadStatistics {
  total_areas: number;
  total_niveles: number;
  total_inscritos: number;
}
