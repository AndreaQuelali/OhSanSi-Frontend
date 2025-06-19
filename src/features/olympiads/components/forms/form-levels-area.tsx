import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ConfirmationModal } from '@/components/ui/modal-confirmation';
import { Button, Dropdown, Modal } from '@/components';
import { TableLevesArea } from '../tables/table-levels-area';
import { useLevelsArea } from '../../hooks/use-levels-area';
import { LEVELS_AREA_ERROR_MESSAGES } from '../../constants/levels-area-constants';
import type { FormData } from '../../interfaces/form-levels-area';
import { useFetchData } from '@/hooks/use-fetch-data';

export default function FormLevelsArea() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    reset,
    getValues,
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
  const [confirmationStatus, setConfirmationStatus] = useState<'success' | 'error' | null>(null);
  const [confirmationMessage, setConfirmationMessage] = useState<string>('');

  const {
    tableData,
    fetchTableLA,
    levels,
    fetchLevels,
    registerAssociation,
    error,
    setError: setLevelsAreaError,
    setTableData,
    setLevels,
  } = useLevelsArea();

  // Hooks reales de datos para olimpiadas y áreas
  const { data: olympiads } = useFetchData<{ id_olimpiada: number; gestion: number; nombre_olimpiada: string }[]>(`/olympiads/now`);
  const { data: areas } = useFetchData<{ id_area: number; nombre: string }[]>(`/areas`);

  useEffect(() => {
    if (selectedOlympiad) {
      fetchTableLA(Number(selectedOlympiad));
      fetchLevels(Number(selectedOlympiad));
    }
  }, [selectedOlympiad, fetchLevels, fetchTableLA]);

  const onSubmit = () => {
    setIsModalOpen(true);
  };

  const handleRegister = async (data: FormData) => {
    setIsSubmitting(true);
    const result = await registerAssociation(data, areas || [], levels);
    setIsModalOpen(false);
    if (result.success) {
      setConfirmationStatus('success');
      setConfirmationMessage(LEVELS_AREA_ERROR_MESSAGES.REGISTER_SUCCESS);
      setShowConfirmationModal(true);
      reset();
      if (selectedOlympiad) fetchTableLA(Number(selectedOlympiad));
    } else {
      setConfirmationStatus('error');
      setConfirmationMessage(result.message || LEVELS_AREA_ERROR_MESSAGES.REGISTER_ERROR);
      setShowConfirmationModal(true);
    }
    setIsSubmitting(false);
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
          onSubmit={handleSubmit(onSubmit)}
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
                  required: LEVELS_AREA_ERROR_MESSAGES.REQUIRED_OLYMPIAD,
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
                  required: LEVELS_AREA_ERROR_MESSAGES.REQUIRED_AREA,
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
                  required: LEVELS_AREA_ERROR_MESSAGES.REQUIRED_LEVEL,
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
