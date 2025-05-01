import { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { API_URL } from '@/config/api-config';
import { useFetchDataWithBody } from '@/hooks/use-fetch-with-body';
import { formattedDate } from '@/utils/date';
import { useFormValidity, useOlimpistaData, useTutorValidation } from '../hooks';
import ParticipantFormHeader from './form-header';
import AreasGridSection from './selection-grid-areas';
import AreaSelectionModal from './selection-areas-modal';
import FormButtons from '@/components/ui/form-buttons';


export default function FormAreaPart() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid: formFieldsValid },
    watch,
  } = useForm({
    mode: 'all',
    defaultValues: {
      'olimpista.ci': '',
      'tutor.ci': '',
    },
  });

  const ciTutor = watch('tutor.ci');
  const ciOlimpista = watch('olimpista.ci');

  const { areasDisponibles, nivelesSeleccionados, setNivelesSeleccionados, olimpistaError, loading } = 
    useOlimpistaData(ciOlimpista);
  const { tutorError } = useTutorValidation(ciTutor);
  const { formIsValid } = useFormValidity({
    formFieldsValid,
    nivelesSeleccionados,
    areasDisponibles,
    olimpistaError,
    tutorError,
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [nivelesSeleccionadosTemp, setNivelesSeleccionadosTemp] = useState<
    { id_nivel: number; nombre_nivel: string; registrado?: boolean }[]
  >([]);

  const { data: maxCategoriasData } = useFetchDataWithBody<{
    success: boolean;
    fecha: string;
    id_olimpiada: number;
    max_categorias_olimpista: number;
  }>(`${API_URL}/olimpiada/max-categorias?fecha=${formattedDate}`, {
    method: 'GET',
  });
  const maxCategorias = maxCategoriasData?.max_categorias_olimpista || 0;
  const limiteAlcanzado = Object.keys(nivelesSeleccionados).length >= maxCategorias;

  const handleNivelToggle = (nivel: {
    id_nivel: number;
    nombre_nivel: string;
    registrado?: boolean;
  }) => {
    if (nivel.registrado) {
      alert('No puedes deseleccionar un nivel ya registrado.');
      return;
    }

    setNivelesSeleccionadosTemp((prev) => {
      const nivelYaSeleccionado = prev.some((n) => n.id_nivel === nivel.id_nivel);
      if (nivelYaSeleccionado) {
        return prev.filter((n) => n.id_nivel !== nivel.id_nivel);
      } else {
        return [...prev, nivel];
      }
    });
  };

  const handleModalAceptar = () => {
    if (selectedArea) {
      const nivelesRegistrados = nivelesSeleccionadosTemp.filter(
        (nivel) => nivel.registrado
      );

      if (
        nivelesRegistrados.length > 0 &&
        nivelesRegistrados.length === nivelesSeleccionadosTemp.length
      ) {
        alert('No puedes deseleccionar un área completamente registrada.');
        setModalVisible(false);
        return;
      }

      setNivelesSeleccionados((prev) => {
        if (nivelesSeleccionadosTemp.length === 0) {
          const nivelesRegistrados = prev[selectedArea]?.filter(
            (n) => n.registrado
          );
          if (nivelesRegistrados?.length > 0) {
            return {
              ...prev,
              [selectedArea]: nivelesRegistrados,
            };
          } else {
            const { [selectedArea]: _, ...rest } = prev;
            return rest;
          }
        } else {
          return {
            ...prev,
            [selectedArea]: nivelesSeleccionadosTemp,
          };
        }
      });
    }
    setModalVisible(false);
  };

  const handleModalCancelar = () => {
    setModalVisible(false);
    setNivelesSeleccionadosTemp([]);
  };

  const handleAreaClick = (area: string) => {
    const seleccionados = nivelesSeleccionados[area] || [];

    if (seleccionados.length === 0 && limiteAlcanzado) {
      alert('Ya has alcanzado el límite de áreas permitidas.');
      return;
    }

    setSelectedArea(area);
    setNivelesSeleccionadosTemp([...seleccionados]);
    setModalVisible(true);
  };

  const handleRegistrar = async () => {
    if (!ciOlimpista) {
      alert('Por favor, ingrese la cédula del olimpista.');
      return;
    }

    const nivelesNuevos = Object.values(nivelesSeleccionados)
      .flat()
      .filter((nivel) => !nivel.registrado)
      .map((nivel) => nivel.id_nivel);

    if (nivelesNuevos.length === 0) {
      alert('No hay nuevos niveles para registrar.');
      return;
    }

    const payload = {
      ci: ciOlimpista,
      niveles: nivelesNuevos,
      ci_tutor: ciTutor || null,
    };

    try {
      const response = await axios.post(
        `${API_URL}/inscripciones-con-tutor`,
        payload
      );

      alert('Registro exitoso');
      console.log('Response:', response.data);
      window.location.href = '/register-selected-areas';
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <div className="my-6">
      <form
        onSubmit={handleSubmit(handleRegistrar)}
        className="max-w-9/12 mx-auto w-full px-0 sm:px-6 md:px-0"
      >
        <h2 className="text-primary text-lg sm:text-xl md:text-2xl font-semibold mb-6 md:text-center sm:text-left headline-lg">
          Registro de Olimpista en una o varias áreas de competencia
        </h2>
        
        <ParticipantFormHeader 
          register={register} 
          errors={errors} 
          tutorError={tutorError} 
        />
        
        <AreasGridSection
          loading={loading}
          olimpistaError={olimpistaError}
          areasDisponibles={areasDisponibles}
          nivelesSeleccionados={nivelesSeleccionados}
          onAreaClick={handleAreaClick}
        />

        {modalVisible && selectedArea && (
          <AreaSelectionModal
            selectedArea={selectedArea}
            areasDisponibles={areasDisponibles}
            nivelesSeleccionadosTemp={nivelesSeleccionadosTemp}
            onToggleNivel={handleNivelToggle}
            onAccept={handleModalAceptar}
            onCancel={handleModalCancelar}
          />
        )}
        
        <FormButtons formIsValid={formIsValid} />
      </form>
    </div>
  );
}