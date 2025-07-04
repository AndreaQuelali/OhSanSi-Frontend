import { Button, Dropdown, Modal } from '../../../components';
import { useForm } from 'react-hook-form';
import { useState, useEffect, useCallback } from 'react';
import { useFetchData } from '@/hooks/use-fetch-data';
import axios from 'axios';
import { API_URL } from '@/config/api-config';
import { useNavigate } from 'react-router';
import { TableLevesArea } from './table-levels-area';
import { ConfirmationModal } from '@/components/ui/modal-confirmation';

interface FormData {
  olympiad: string;
  area: string;
  level: string;
}

export default function FormLevelsArea() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      olympiad: '',
      area: '',
      level: '',
    },
  });

  const navigate = useNavigate();
  const selectedOlympiad = watch('olympiad');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationStatus, setConfirmationStatus] = useState<
    'success' | 'error' | null
  >(null);
  const [confirmationMessage, setConfirmationMessage] = useState<string>('');
  const [tableData, setTableData] = useState<
    { id: number; olympiad: string; area: string; level: string }[]
  >([]);
  const { data: olympiads } = useFetchData<
    { id_olimpiada: number; gestion: number; nombre_olimpiada: string }[]
  >(`${API_URL}/olympiads/now`);

  const { data: areas } = useFetchData<{ id_area: number; nombre: string }[]>(
    `${API_URL}/areas`,
  );
  const [levels, setLevels] = useState<{ id_nivel: number; nombre: string }[]>(
    [],
  );

  const fetchLevels = useCallback(async (olympiadId: number) => {
    if (!olympiadId) return;
    try {
      const response = await axios.get(`${API_URL}/levels-areas/${olympiadId}`);
      setLevels(response.data.niveles);
    } catch (error) {
      console.error('Error al obtener los niveles:', error);
    }
  }, []);

  const fetchTableLA = useCallback(async (olympiadId: number) => {
    if (!olympiadId) {
      return;
    }

    try {
      const response = await axios.get(
        `${API_URL}/olympiads/${olympiadId}/levels-areas`,
      );

      if (response.data && response.data.data) {
        const { gestion, areas } = response.data.data;

        if (Array.isArray(areas)) {
          let idCounter = 1;
          const formattedData = areas.flatMap((area) =>
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            area.niveles.map((nivel: { nombre_nivel: any }) => ({
              id: idCounter++,
              olympiad: gestion,
              area: area.nombre_area,
              level: nivel.nombre_nivel,
            })),
          );

          setTableData(formattedData);
        } else {
          console.error("La propiedad 'areas' no es un array:", areas);
          setTableData([]);
        }
      } else {
        console.error('Estructura de datos inesperada:', response.data);
        setTableData([]);
      }
    } catch (error) {
      console.error('Error al cargar la estructura de la olimpiada:', error);
      setTableData([]);
    }
  }, []);

  useEffect(() => {
    if (selectedOlympiad) {
      fetchTableLA(Number(selectedOlympiad));
      fetchLevels(Number(selectedOlympiad));
    }
  }, [selectedOlympiad, fetchLevels, fetchTableLA]);

  const onSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(() => setIsModalOpen(true))();
  };

  const handleRegister = async (data: FormData) => {
    const areaId = Number(data.area);
    const levelId = Number(data.level);
    const olympiadId = Number(data.olympiad);

    if (!levelId || !areaId || !olympiadId) {
      alert('Datos inválidos');
      return;
    }

    try {
      const olimpResponse = await axios.get(`${API_URL}/olympiads`);
      const currentDate = new Date();

      const olimpiada = olimpResponse.data.find(
        (olimpiada: any) => olimpiada.id_olimpiada === olympiadId,
      );

      if (!selectedOlympiad) {
        alert('No se encontró la olimpiada seleccionada');
        return;
      }
      const fechaInicio = new Date(olimpiada.fecha_inicio);
      const fechaFin = new Date(olimpiada.fecha_fin);
      const creadoEn = new Date(olimpiada.creado_en);

      if (currentDate >= fechaInicio && currentDate <= fechaFin) {
        alert(
          'No se puede registrar, la olimpiada está en etapa de inscripción',
        );
        return;
      }

      if (!(currentDate >= creadoEn && currentDate < fechaInicio)) {
        alert(
          'No se puede registrar fuera del periodo de preparación de la olimpiada',
        );
        return;
      }
    } catch (error) {
      console.error('Error al verificar el estado de la olimpiada:', error);
      alert(
        'No se pudo verificar la etapa de la olimpiada. Intenta nuevamente.',
      );
      return;
    }

    const response = await axios.get(
      `${API_URL}/olympiads/${olympiadId}/levels-areas`,
    );

    const registros = response.data?.data?.areas ?? [];

    const alreadyRegistered = registros.some(
      (area: any) =>
        area.id_area === areaId &&
        area.niveles.some((nivel: any) => nivel.id_nivel === levelId),
    );

    if (alreadyRegistered) {
      alert('Este nivel y área ya se encuentra registrado en la olimpiada');
      return;
    }

    const payload = {
      id_olimpiada: olympiadId,
      id_area: areaId,
      id_categorias: [levelId],
      max_niveles: 1,
    };

    setIsSubmitting(true);

    try {
      await axios.post(`${API_URL}/areas/association`, payload);
      setConfirmationStatus('success');
      setConfirmationMessage(
        'Nivel y área registrados en la olimpiada exitosamente.',
      );
      setShowConfirmationModal(true);

      await fetchTableLA(olympiadId);
      setIsModalOpen(false);
    } catch (error: any) {
      setConfirmationStatus('error');
      setConfirmationMessage(
        error.data?.message ||
          'Error al registrar el nivel y área en la olimpiada.',
      );
      setShowConfirmationModal(true);
      console.error('Error al registrar:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseConfirmationModal = () => {
    setShowConfirmationModal(false);
    if (confirmationStatus === 'success') {
      window.location.reload();
    }
    setConfirmationStatus(null);
    setConfirmationMessage('');
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col items-center">
        <form
          onSubmit={onSubmitForm}
          className="mt-10 mb-32 mx-5 md:w-9/12 lg:w-9/12"
        >
          <div className="flex flex-col">
            <h1 className="text-center text-primary mb-8 headline-lg">
              Registro de Niveles/Categorías en Áreas de Olimpiada
            </h1>

            <div className="grid lg:grid-cols-3 lg:gap-9 mb-6">
              <Dropdown
                name="olympiad"
                label="Olimpiada"
                placeholder="Seleccionar olimpiada"
                className="w-full"
                options={
                  olympiads?.map((olimpiada) => ({
                    id: olimpiada.id_olimpiada.toString(),
                    name: `${olimpiada.gestion} - ${olimpiada.nombre_olimpiada}`,
                  })) || []
                }
                displayKey="name"
                valueKey="id"
                register={register}
                errors={errors}
                validationRules={{
                  required: 'Debe seleccionar un año/gestión',
                }}
              />
              <Dropdown
                name="area"
                label="Área"
                className="w-full"
                placeholder="Seleccionar área"
                options={
                  areas?.map((area) => ({
                    id: area.id_area.toString(),
                    name: area.nombre,
                  })) || []
                }
                displayKey="name"
                valueKey="id"
                register={register}
                validationRules={{
                  required: 'Debe seleccionar un área',
                }}
                errors={errors}
              />
              <Dropdown
                label="Nivel/Categoría"
                className="w-full"
                name="level"
                placeholder="Seleccionar nivel o categoría"
                options={
                  levels?.map((level) => ({
                    id: level.id_nivel.toString(),
                    name: level.nombre,
                  })) || []
                }
                displayKey="name"
                valueKey="id"
                register={register}
                validationRules={{
                  required: 'Debe seleccionar un nivel o categoría',
                }}
                errors={errors}
              />
            </div>
            <div className="flex flex-col-reverse md:flex-row md:justify-end md:space-x-5">
              <Button
                label="Cancelar"
                variantColor="variant2"
                className="mt-5 md:mt-0"
                onClick={() => navigate('/administrator')}
              />
              <Button
                label="Registrar"
                type="submit"
                disabled={!isValid || isSubmitting}
                variantColor={
                  !isValid || isSubmitting ? 'variantDesactivate' : 'variant1'
                }
              />
            </div>

            <h2 className="text-primary subtitle-md mt-7 md:mt-5">
              Niveles/Categorías registradas en Áreas
            </h2>
            <div className="mt-2 md:w-11/12 mx-auto">
              {tableData.length > 0 ? (
                <TableLevesArea data={tableData} />
              ) : selectedOlympiad ? (
                <p className="text-center py-4 text-neutral">
                  No hay Niveles/Categorías registrados con Areas para esta
                  olimpiada
                </p>
              ) : (
                <p className="text-center py-4 text-neutral">
                  Seleccione una olimpiada para ver datos
                </p>
              )}
            </div>
          </div>
        </form>
        {isModalOpen && (
          <Modal
            text="¿Está seguro de registrar el nivel en el área?"
            onClose={() => setIsModalOpen(false)}
            onConfirm={handleSubmit(handleRegister)}
          />
        )}
        {showConfirmationModal && (
          <ConfirmationModal
            onClose={handleCloseConfirmationModal}
            status={confirmationStatus || 'error'}
            message={confirmationMessage}
          />
        )}
      </div>
    </div>
  );
}
