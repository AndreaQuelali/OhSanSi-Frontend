import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useFetchData } from '@/hooks/use-fetch-data';
import { useNavigate } from 'react-router';
import { ConfirmationModal } from '@/components/ui/modal-confirmation';
import { Button, Dropdown, Modal } from '@/components';
import { Table } from '../tables/table';
import { useLevelsGrades } from '../../hooks/use-levels-grades';
import { LEVELS_GRADES_ERROR_MESSAGES } from '../../constants/levels-grades-constants';
import type { FormData } from '../../interfaces/form-levels-grades';

export default function FormLevelsGrades() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    trigger,
    setValue,
    clearErrors,
    reset,
    getValues,
  } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      level: '',
      gmin: '',
      gmax: '',
      olympiad: '',
    },
  });

  const navigate = useNavigate();
  const minGrade = watch('gmin');
  const selectedOlympiad = watch('olympiad');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationStatus, setConfirmationStatus] = useState<'success' | 'error' | null>(null);
  const [confirmationMessage, setConfirmationMessage] = useState<string>('');

  const {
    tableData,
    fetchTableData,
    levels,
    fetchLevels,
    registerAssociation,
    error,
    setError: setLevelsGradesError,
    setTableData,
    setLevels
  } = useLevelsGrades();

  const { data: olympiads } = useFetchData<{
    id_olimpiada: number;
    gestion: number;
    nombre_olimpiada: string;
  }[]>(`/api/olympiads/now`);

  const { data: grades } = useFetchData<{
    id_grado: number;
    nombre_grado: string;
  }[]>(`/api/grades`);

  useEffect(() => {
    if (minGrade) {
      trigger('gmax');
    }
  }, [minGrade, trigger]);

  useEffect(() => {
    if (minGrade === '12') {
      setValue('gmax', '');
    }
  }, [minGrade]);

  useEffect(() => {
    if (selectedOlympiad) {
      fetchTableData(Number(selectedOlympiad));
      fetchLevels(Number(selectedOlympiad));
    }
  }, [selectedOlympiad, fetchLevels, fetchTableData]);

  const onSubmit = () => {
    setIsModalOpen(true);
  };

  const handleRegister = async (data: FormData) => {
    setIsSubmitting(true);
    const result = await registerAssociation(data, levels);
    setIsModalOpen(false);
    if (result.success) {
      setConfirmationStatus('success');
      setConfirmationMessage(LEVELS_GRADES_ERROR_MESSAGES.REGISTER_SUCCESS);
      setShowConfirmationModal(true);
      reset();
      if (selectedOlympiad) fetchTableData(Number(selectedOlympiad));
    } else {
      setConfirmationStatus('error');
      setConfirmationMessage(result.message || LEVELS_GRADES_ERROR_MESSAGES.REGISTER_ERROR);
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
              Asociación de Niveles/Categorías con Grados
            </h1>

            <div className="grid lg:grid-cols-4 lg:gap-9 mb-6">
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
                  required: LEVELS_GRADES_ERROR_MESSAGES.REQUIRED_OLYMPIAD,
                }}
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
                  required: LEVELS_GRADES_ERROR_MESSAGES.REQUIRED_LEVEL,
                }}
                errors={errors}
              />
              <Dropdown
                name="gmin"
                label="Grado Min."
                placeholder="Seleccionar grado min"
                options={
                  grades
                    ? grades.map((grade) => ({
                        id: grade.id_grado.toString(),
                        name: grade.nombre_grado,
                      }))
                    : []
                }
                displayKey="name"
                valueKey="id"
                register={register}
                validationRules={{
                  required: LEVELS_GRADES_ERROR_MESSAGES.REQUIRED_GMIN,
                }}
                errors={errors}
              />
              <div>
                <Dropdown
                  name="gmax"
                  label="Grado Max."
                  placeholder="Seleccionar grado max"
                  options={
                    grades
                      ? grades.slice(1).map((grade) => ({
                          id: grade.id_grado.toString(),
                          name: grade.nombre_grado,
                        }))
                      : []
                  }
                  displayKey="name"
                  valueKey="id"
                  register={register}
                  validationRules={{
                    validate: (value: string) => {
                      if (value === '') return true;

                      const minOrder = grades?.find(
                        (grade) => grade.id_grado.toString() === minGrade,
                      )?.id_grado;
                      const maxOrder = grades?.find(
                        (grade) => grade.id_grado.toString() === value,
                      )?.id_grado;

                      if (!minOrder) {
                        return 'Debe seleccionar primero el grado mínimo';
                      }

                      if (maxOrder && Number(maxOrder) <= Number(minOrder)) {
                        if (minGrade === '12') {
                          return 'El grado mínimo es el más alto';
                        }
                        return LEVELS_GRADES_ERROR_MESSAGES.INVALID_GMAX;
                      }

                      return true;
                    },
                  }}
                  errors={errors}
                  isRequired={false}
                  disablePlaceholder={false}
                  disabled={minGrade === '12'}
                />
              </div>
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
              Niveles/Categorías asociadas con grados
            </h2>
            <div className="mt-2 md:w-11/12 mx-auto">
              {tableData.length > 0 ? (
                <Table data={tableData} />
              ) : selectedOlympiad ? (
                <p className="text-center py-4 text-neutral">
                  No hay asociacion de niveles con grados para esta olimpiada
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
            text="¿Está seguro de registrar los niveles?"
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
