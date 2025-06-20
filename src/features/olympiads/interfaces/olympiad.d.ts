export interface OlympiadData {
  olympiad_id: number;
  year: number;
  start_date: string;
  end_date: string;
  olympiad_name: string;
  cost: number;
  max_categories_per_olympist: number;
  created_in: string;
}

export interface CreateOlympiadPayload {
  year: number;
  cost: number;
  start_date: string;
  end_date: string;
  max_categories_per_olympist: number;
  olympiad_name: string;
  //created_in: string;
}

export interface AreaData {
  id: number;
  area: string;
}
