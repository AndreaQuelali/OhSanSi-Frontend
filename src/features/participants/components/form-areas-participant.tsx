import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { CardArea } from './card-area';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { Area, FormAreaPartProps } from '../interfaces/register-participants';

export default function FormAreaPart({
  setStep,
  currentStep,
}: FormAreaPartProps) {
  const { setValue, watch, trigger } = useFormContext();
  const selectedAreas = watch('areas.selectedAreas', []);

  const [modalOpen, setModalOpen] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [idOlimpiada, setIdOlimpiada] = useState<number | null>(null);
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [niveles, setNiveles] = useState<
    { id_nivel: number; nombre: string }[]
  >([]); // Niveles de un área
  const [selectedNiveles, setSelectedNiveles] = useState<number[]>([]);

  useEffect(() => {
    const fetchOlimpiadaAndAreas = async () => {
      const storedGestion = localStorage.getItem('gestion');
      if (!storedGestion) {
        setError('No se encontró una gestión en localStorage.');
        setLoading(false);
        return;
      }

      try {
        const olimpiadaResponse = await axios.get(
          `http://localhost:8000/api/olympiad/${storedGestion}`,
        );
        const idOlimpiada = olimpiadaResponse.data.id_olimpiada;
        setIdOlimpiada(idOlimpiada);

        // Obtener las áreas de la olimpiada
        const areasResponse = await axios.get(
          `http://localhost:8000/api/olimpiada/${idOlimpiada}/areas`,
        );
        setAreas(areasResponse.data.areas);
      } catch (error) {
        console.error('Error al obtener las áreas:', error);
        setError('No se pudieron cargar las áreas.');
      } finally {
        setLoading(false);
      }
    };

    fetchOlimpiadaAndAreas();
  }, []);

  const fetchNiveles = async (idArea: number) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/niveles/area/${idArea}`,
      );
      setNiveles(response.data.niveles);
      setModalOpen(true);
    } catch (error) {
      console.error('Error al obtener los niveles:', error);
      alert('No se pudieron cargar los niveles de esta área.');
    }
  };

  const toggleNivel = (idNivel: number) => {
    if (selectedNiveles.includes(idNivel)) {
      setSelectedNiveles(selectedNiveles.filter((nivel) => nivel !== idNivel));
    } else {
      setSelectedNiveles([...selectedNiveles, idNivel]);
    }
  };

  const confirmNiveles = () => {
    // Agregar los niveles seleccionados al estado
    setValue('areas.selectedAreas', [...selectedAreas, ...selectedNiveles], {
      shouldValidate: true,
    });

    // Marcar el área como seleccionada
    if (selectedArea && !selectedAreas.includes(selectedArea.id_area)) {
      setValue('areas.selectedAreas', [
        ...selectedAreas,
        selectedArea.id_area,
        ...selectedNiveles,
      ]);
    }

    setModalOpen(false);
    setSelectedNiveles([]);
  };

  const handleCardClick = (area: Area) => {
    setSelectedArea(area);
    fetchNiveles(area.id_area);
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

      let tutorId;

      try {
        // Intentar registrar el tutor
        const tutorResponse = await axios.post(
          'http://localhost:8000/api/tutores',
          transformedTutor,
        );
        // Si se registra correctamente, extraer el id_tutor
        tutorId = tutorResponse.data.tutor.id_tutor;
        console.log('Tutor registrado exitosamente. ID del tutor:', tutorId);
      } catch (error: any) {
        // Si el tutor ya existe, extraer el id_tutor del mensaje de error
        if (
          error.response &&
          error.response.data &&
          error.response.data.message.includes(
            'Ya existe un tutor con este CI.',
          )
        ) {
          tutorId = error.response.data.id_tutor;
          console.log('Tutor ya existente. ID del tutor:', tutorId);
        } else {
          // Si ocurre otro error, lanzar una alerta
          console.error('Error al registrar el tutor:', error);
          alert('Ocurrió un error al registrar el tutor.');
          return;
        }
      }

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

      if (!idOlimpiada) {
        alert('No se pudo obtener el id_olimpiada.');
        return;
      }

      const transformedAreas = {
        id_olimpista: olimpistaId,
        id_olimpiada: idOlimpiada, // Usar el id_olimpiada dinámico
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
      // Deseleccionar áreas
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
          <p>{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {areas.map((area) => (
              <CardArea
                key={area.id_area}
                label={area.nombre}
                imageUrl={`http://127.0.0.1:8000/storage/${area.imagen}`}
                selected={selectedAreas.includes(area.id_area)}
                onClick={() => handleCardClick(area)}
              />
            ))}
          </div>
        )}
      </div>

      {modalOpen && selectedArea && (
        <Modal
          text={`Niveles del área: ${selectedArea.nombre}`}
          onClose={() => setModalOpen(false)}
          onConfirm={confirmNiveles}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {niveles.map((nivel) => (
              <div
                key={nivel.id_nivel}
                className={`p-4 border rounded cursor-pointer ${
                  selectedNiveles.includes(nivel.id_nivel)
                    ? 'bg-primary text-white'
                    : 'bg-white text-black'
                }`}
                onClick={() => toggleNivel(nivel.id_nivel)}
              >
                {nivel.nombre}
              </div>
            ))}
          </div>
        </Modal>
      )}

      {confirmationModalOpen && (
        <Modal
          text="¿Estás seguro de que deseas registrar los datos?"
          onClose={() => setConfirmationModalOpen(false)}
          onConfirm={handleRegister}
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
