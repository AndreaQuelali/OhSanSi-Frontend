import { useState } from 'react';
import { ERROR_MESSAGES } from '../constants/participant-constants';
import { UseFormSetValue } from 'react-hook-form';
import { FormData } from '../interfaces/form-areas-participant';

interface Nivel {
  id_nivel: number;
  nombre_nivel: string;
  registrado?: boolean;
}

interface AreaSelectionProps {
  nivelesSeleccionados: Record<string, Nivel[]>;
  setNivelesSeleccionados: React.Dispatch<React.SetStateAction<Record<string, Nivel[]>>>;
  areasDisponibles: Record<string, Nivel[]>;
  maxCategorias: number;
  setValue: UseFormSetValue<FormData>;
  ciTutor: string;
  openConfirmationModal?: (status: 'success' | 'error' | 'alert', message: string) => void;
}

export function useAreaSelection({
  nivelesSeleccionados,
  setNivelesSeleccionados,
  areasDisponibles,
  maxCategorias,
  setValue,
  ciTutor,
  openConfirmationModal,
}: AreaSelectionProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [nivelesSeleccionadosTemp, setNivelesSeleccionadosTemp] = useState<Nivel[]>([]);
  const [tutoresPorArea, setTutoresPorArea] = useState<Record<string, string>>({});
  const [confirmationStatus, setConfirmationStatus] = useState<'success' | 'error' | 'alert' | null>(null);
  const [confirmationMessage, setConfirmationMessage] = useState<string>('');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const handleNivelToggle = (nivel: Nivel) => {
    if (nivel.registrado) {
      alert(ERROR_MESSAGES.UNREGISTER_LEVEL);
      return;
    }
    const nivelesYaRegistrados = nivelesSeleccionadosTemp.filter((n) => n.registrado);
    if (nivelesSeleccionadosTemp.some((n) => n.id_nivel === nivel.id_nivel)) {
      setNivelesSeleccionadosTemp([...nivelesYaRegistrados]);
    } else {
      setNivelesSeleccionadosTemp([...nivelesYaRegistrados, nivel]);
    }
  };

  const handleModalAceptar = () => {
    if (selectedArea) {
      const hayNivelesNuevosSeleccionados = nivelesSeleccionadosTemp.some((nivel) => !nivel.registrado);
      if (hayNivelesNuevosSeleccionados) {
        setTutoresPorArea((prev) => ({ ...prev, [selectedArea]: ciTutor || '' }));
      } else {
        setTutoresPorArea((prev) => {
          const { [selectedArea]: _, ...rest } = prev;
          return rest;
        });
      }
      const nivelesRegistradosEnArea = areasDisponibles[selectedArea]?.filter((nivel) => nivel.registrado) || [];
      const todosLosNivelesRegistradosIncluidos = nivelesRegistradosEnArea.every((nivelReg) =>
        nivelesSeleccionadosTemp.some((nivel) => nivel.id_nivel === nivelReg.id_nivel),
      );
      if (nivelesRegistradosEnArea.length > 0 && !todosLosNivelesRegistradosIncluidos) {
        alert(ERROR_MESSAGES.LEVELS_ALREADY_REGISTERED);
        setModalVisible(false);
        return;
      }
      const nivelesDisponiblesSinRegistrar = areasDisponibles[selectedArea]?.filter((nivel) => !nivel.registrado) || [];
      if (nivelesDisponiblesSinRegistrar.length === 0) {
        alert(ERROR_MESSAGES.REGISTER_NO_LEVELS_AREA);
        setModalVisible(false);
        return;
      }
      setNivelesSeleccionados((prev) => {
        if (nivelesSeleccionadosTemp.length === 0) {
          const nivelesRegistrados = prev[selectedArea]?.filter((n) => n.registrado);
          if (nivelesRegistrados?.length > 0) {
            return { ...prev, [selectedArea]: nivelesRegistrados };
          } else {
            const { [selectedArea]: _, ...rest } = prev;
            return rest;
          }
        } else {
          return { ...prev, [selectedArea]: nivelesSeleccionadosTemp };
        }
      });
    }
    setValue('tutor.ci', '');
    setModalVisible(false);
  };

  const handleModalCancelar = () => {
    setModalVisible(false);
    setNivelesSeleccionadosTemp([]);
  };

  const handleAreaClick = (area: string) => {
    const seleccionados = nivelesSeleccionados[area] || [];
    const tutorCiForArea = tutoresPorArea[area] || '';
    setValue('tutor.ci', tutorCiForArea);
    if (seleccionados.length > 0) {
      setSelectedArea(area);
      setNivelesSeleccionadosTemp([...seleccionados]);
      setModalVisible(true);
      return;
    }
    if (maxCategorias <= 0) {
      setSelectedArea(area);
      setNivelesSeleccionadosTemp([]);
      setModalVisible(true);
      return;
    }
    const areasConSelecciones = Object.keys(nivelesSeleccionados).length;
    if (areasConSelecciones >= maxCategorias) {
      if (openConfirmationModal) {
        openConfirmationModal('alert', `Ya has alcanzado el límite de ${maxCategorias} áreas permitidas.`);
      }
      return;
    }
    setSelectedArea(area);
    setNivelesSeleccionadosTemp([]);
    setModalVisible(true);
  };

  return {
    modalVisible,
    setModalVisible,
    selectedArea,
    setSelectedArea,
    nivelesSeleccionadosTemp,
    setNivelesSeleccionadosTemp,
    tutoresPorArea,
    setTutoresPorArea,
    handleNivelToggle,
    handleModalAceptar,
    handleModalCancelar,
    handleAreaClick,
    confirmationStatus,
    setConfirmationStatus,
    confirmationMessage,
    setConfirmationMessage,
    showConfirmationModal,
    setShowConfirmationModal,
  };
} 