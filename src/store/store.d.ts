import { OlympiadInfo } from "@/interfaces/olympiad";

export interface OlimpiadaStore {
  olimpiadas: OlympiadInfo[];
  loading: boolean;
  error: string | null;
  fetchOlimpiadas: () => Promise<void>;
  isInscripcionActive: () => boolean;
}
