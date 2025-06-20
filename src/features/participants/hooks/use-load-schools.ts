import { useEffect, useState } from 'react';
import { Provincia, UnidadEducativa } from '../interfaces/register-participants';
import { ERROR_MESSAGES } from '../constants/participant-constants';
import { ParticipantApiService } from '../services/participant-api';

export function useLoadSchools(selectedDepartment: string, selectedProv: string) {
  const [provincias, setProvincias] = useState<Provincia[]>([]);
  const [colegios, setColegios] = useState<UnidadEducativa[]>([]);
  const [loadingProvincias, setLoadingProvincias] = useState(false);
  const [loadingColegios, setLoadingColegios] = useState(false);

  useEffect(() => {
    if (selectedDepartment) {
      const fetchProvincias = async () => {
        setLoadingProvincias(true);
        try {
          const response = await ParticipantApiService.getProvincesByDepartment(selectedDepartment);
          setProvincias(response.data);
        } catch (error) {
          console.error(ERROR_MESSAGES.PROVINCE_LOADING_ERROR, error);
          setProvincias([]);
        } finally {
          setLoadingProvincias(false);
        }
      };
      fetchProvincias();
    } else {
      setProvincias([]);
    }
  }, [selectedDepartment]);

  useEffect(() => {
    if (selectedProv) {
      const fetchColegios = async () => {
        setLoadingColegios(true);
        try {
          const response = await ParticipantApiService.getSchoolsByProvince(selectedProv);
          setColegios(response.data);
        } catch (error) {
          console.error(ERROR_MESSAGES.DEPARTMENT_LOADING_ERROR, error);
          setColegios([]);
        } finally {
          setLoadingColegios(false);
        }
      };
      fetchColegios();
    } else {
      setColegios([]);
    }
  }, [selectedProv]);

  return {
    provincias,
    colegios,
    loadingProvincias,
    loadingColegios,
  };
}
