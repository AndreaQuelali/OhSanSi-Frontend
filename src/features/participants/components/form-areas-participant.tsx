import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { CardArea } from './card-area';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { useFetchData } from '@/hooks/use-fetch-data';
import axios from 'axios';
import { Area, FormAreaPartProps } from '../interfaces/register-participants';


export default function FormAreaPart({
  setStep,
  currentStep,
}: FormAreaPartProps) {
  const { setValue, watch, trigger } = useFormContext();
  const selectedAreas = watch('areas.selectedAreas', []);

  const [modalOpen, setModalOpen] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false); // Modal de
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    data: areas,
    loading,
    error,
  } = useFetchData<Area[]>('http://localhost:8000/api/areas');

  const closeModal = () => {
    setModalOpen(false);
    if (selectedArea) {
      setValue(
        'areas.selectedAreas',
        selectedAreas.filter((name: string) => name !== selectedArea),
        { shouldValidate: true },
      );
    }
    setSelectedArea(null);
  };

  const confirmSelection = () => {
    setModalOpen(false);
  };

  const toggleArea = (areaId: number) => {
    if (selectedAreas.includes(areaId)) {
      setValue(
        'areas.selectedAreas',
        selectedAreas.filter((id: number) => id !== areaId),
        { shouldValidate: true },
      );
    } else {
      setValue('areas.selectedAreas', [...selectedAreas, areaId], {
        shouldValidate: true,
      });
    }
    trigger('areas.selectedAreas');
  };

  useEffect(() => {
    const savedData = localStorage.getItem('participantData');
    const formData = savedData ? JSON.parse(savedData) : {};
    formData.areas = { selectedAreas };
    localStorage.setItem('participantData', JSON.stringify(formData));
  }, [selectedAreas]);

  const handleRegister = async () => {
    setIsSubmitting(true);

    try {
      const savedData = localStorage.getItem('participantData');
      if (!savedData) {
        alert('No hay datos guardados para registrar.');
        return;
      }

      const formData = JSON.parse(savedData);

      const transformedTutor = {
        nombres: formData.tutor.name,
        apellidos: formData.tutor.lastname,
        ci: formData.tutor.ci,
        celular: formData.tutor.phone,
        correo_electronico: formData.tutor.email,
        rol_parentesco: formData.tutor.rol.toLowerCase(),
      };

      console.log('Datos del tutor:', transformedTutor);

      const tutorResponse = await axios.post(
        'http://localhost:8000/api/tutores',
        transformedTutor,
      );
      const tutorId = tutorResponse.data.tutor.id_tutor;
      console.log('ID del tutor:', tutorId);

      const transformedOlimpista = {
        nombres: formData.olimpista.name,
        apellidos: formData.olimpista.lastname,
        cedula_identidad: formData.olimpista.ci,
        numero_celular: formData.olimpista.phone,
        correo_electronico: formData.olimpista.email,
        fecha_nacimiento: formData.olimpista.birthday,
        unidad_educativa: formData.olimpista.school,
        id_grado: formData.olimpista.grade,
        id_provincia: formData.olimpista.prov,
        id_tutor: tutorId,
      };

      console.log('Datos del olimpista:', transformedOlimpista);

      const olimpistaResponse = await axios.post(
        'http://localhost:8000/api/student-registration',
        transformedOlimpista,
      );
      const olimpistaId = olimpistaResponse.data.olimpista.id_olimpista;
      console.log('ID del olimpista:', olimpistaId);

      const transformedAreas = {
        id_olimpista: olimpistaId,
        id_olimpiada: 1, 
        id_pago: 1, 
        estado: 'pendiente', 
        niveles: selectedAreas, 
      };

      console.log('Áreas transformadas:', transformedAreas);

      await axios.post(
        'http://localhost:8000/api/inscripciones',
        transformedAreas,
      );

      alert('Datos registrados correctamente.');
      localStorage.removeItem('participantData');
      // deselecionar areas
      setValue('areas.selectedAreas', []);
      window.location.href = '/register-applicants';

    } catch (error) {
      console.error('Error al registrar los datos:', error);
      alert('Ocurrió un error al registrar los datos.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col my-6">
      <div className="max-w-9/12 mx-auto w-full px-0 sm:px-6 md:px-0">
        <h2 className="text-primary text-lg sm:text-xl md:text-2xl font-semibold mb-6 text-center sm:text-left">
          Selección de Áreas
        </h2>
        {loading ? (
          <p>Cargando áreas...</p>
        ) : error ? (
          <p>Error al cargar las áreas.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {areas?.map((area) => (
              <CardArea
                key={area.id_area}
                label={area.nombre}
                imageUrl={`http://127.0.0.1:8000/storage/${area.imagen}`}
                selected={selectedAreas.includes(area.id_area)}
                onClick={() => toggleArea(area.id_area)}
              />
            ))}
          </div>
        )}
      </div>

      {modalOpen && selectedArea && (
        <Modal
          text={`Has seleccionado el área de ${selectedArea}. Confirmar niveles`}
          onClose={closeModal}
          onConfirm={confirmSelection}
        />
      )}
      {confirmationModalOpen && (
        <Modal
          text="¿Estás seguro de que deseas registrar los datos?"
          onClose={() => setConfirmationModalOpen(false)}
          onConfirm={() => {
            setConfirmationModalOpen(false);
            handleRegister();
          }}
        />
      )}
      <div className="flex justify-between items-center mt-6">
        <Button
          label="Anterior"
          onClick={() => setStep(Math.max(0, currentStep - 1))}
          variantColor="variant2"
        />
        <Button
          label="Registrar"
          onClick={() => setConfirmationModalOpen(true)} 
          disabled={isSubmitting || selectedAreas.length === 0}
          variantColor={
            isSubmitting || selectedAreas.length === 0
              ? 'variantDesactivate'
              : 'variant1'
          }
        />
      </div>
    </div>
  );
}
