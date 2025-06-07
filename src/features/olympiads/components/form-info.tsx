import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Dropdown, InputText, Modal } from '../../../components';
import { useApiForm } from '@/hooks/use-api-form';
import { FormData } from '../interfaces/form-info';
import { useNavigate } from 'react-router';
import { API_URL } from '@/config/api-config';
import axios from 'axios';

export default function FormInfo() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<FormData | null>(null);
  const [olimpiadasExistentes, setOlimpiadasExistentes] = useState<
    Array<{
      id_olimpiada: number;
      gestion: number; // Cambiado de 'year' (string) a 'gestion' (number)
      fecha_inicio: string;
      fecha_fin: string;
    }>
  >([]);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
    getValues,
    watch,
    trigger,
  } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      year: '',
    },
  });
  const { submitForm } = useApiForm('olympiad-registration');
  const [justReset, setJustReset] = useState(false);

  const selectedYear = watch('year');

  const onSubmit = async (data: FormData) => {
    setFormData(data);
    setShowModal(true);
  };

  const fetchOlimpiadas = async () => {
    try {
      const response = await axios.get(`${API_URL}/olimpiadas`);
      setOlimpiadasExistentes(response.data);
    } catch (error) {
      console.error('Error al obtener olimpiadas:', error);
    }
  };

  const onConfirm = async () => {
    if (!formData) return;
    const now = new Date();
    const boliviaTime = new Date(now.getTime() - 4 * 60 * 60 * 1000);

    const payload = {
      gestion: Number(formData.year),
      costo: parseFloat(formData.cost.toString()),
      fecha_inicio: formData.dateIni,
      fecha_fin: formData.dateEnd,
      max_categorias_olimpista: Number(formData.limitAreas),
      nombre_olimpiada: formData.inputNameOlimpiada,
      creado_en: boliviaTime.toISOString().slice(0, 19).replace('T', ' '),
    };
    console.log(payload);

    try {
      const response = await submitForm(payload);
      if (response) {
        alert('Registro exitoso');
        await fetchOlimpiadas();
        localStorage.setItem('gestion', formData.year);
        window.location.reload();
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.data?.errors) {
        const messages = Object.values(error.data.errors).flat().join('\n');
        setError('year', { message: messages });
        alert(messages);
      } else {
        alert(
          error.data?.message || 'Error en el registro. Intente nuevamente.',
        );
      }
    }

    setShowModal(false);
  };

  const onCloseModal = () => {
    setShowModal(false);
  };

  const validateDates = async (
    dateIni: string,
    dateEnd: string,
    year: string,
  ) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Convertir el año del formulario a número para comparar
    const yearNumber = Number(year);

    // Validación de solapamiento
    const overlaps = olimpiadasExistentes.some((olimpiada) => {
      // Solo comparar con olimpiadas del mismo año
      if (olimpiada.gestion !== yearNumber) return false;

      const oIni = new Date(olimpiada.fecha_inicio);
      const oEnd = new Date(olimpiada.fecha_fin);
      const startDate = new Date(dateIni);
      const endDate = new Date(dateEnd);

      return (
        (startDate >= oIni && startDate <= oEnd) ||
        (endDate >= oIni && endDate <= oEnd) ||
        (oIni >= startDate && oIni <= endDate) ||
        (oEnd >= startDate && oEnd <= endDate)
      );
    });

    if (overlaps) {
      return 'Las fechas se solapan con otra olimpiada existente';
    }

    return true;
  };

  useEffect(() => {
    if (justReset) {
      setJustReset(false);
    }

    const dateIni = getValues('dateIni');
    const dateEnd = getValues('dateEnd');

    if (dateIni) {
      trigger('dateIni');
    }

    if (dateEnd) {
      trigger('dateEnd');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedYear]);

  useEffect(() => {
    const subscription = watch((_value, { name }) => {
      if (name === 'dateIni') {
        trigger('dateEnd');
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, trigger]);
  useEffect(() => {
    fetchOlimpiadas();
  }, []);
  return (
    <div className="flex flex-col items-center mx-10 md:mx-5 lg:mx-0  ">
      <form onSubmit={handleSubmit(onSubmit)} className="mt-10 mb-32">
        <div className="flex flex-col">
          <h1 className="text-center text-primary mb-8 headline-lg">
            Registro de Información General de la Olimpiada
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-9 mb-6">
            <Dropdown
              name="year"
              label="Año/Gestión"
              placeholder="Seleccionar año o gestión"
              className="w-full  lg:w-[480px]"
              options={[
                { id: '2025', name: '2025' },
                { id: '2026', name: '2026' },
                { id: '2027', name: '2027' },
                { id: '2028', name: '2028' },
              ]}
              displayKey="name"
              valueKey="id"
              register={register}
              errors={errors}
              validationRules={{
                required: 'Debe seleccionar un año/gestión',
              }}
            />
            <InputText
              label="Nombre de la Olimpiada"
              name="inputNameOlimpiada"
              placeholder="Ingresar nombre de la Olimpiada"
              type="text"
              className="w-full lg:w-[480px]"
              register={register}
              errors={errors}
              validationRules={{
                required: 'El nombre de la olimpiada es obligatorio',
                pattern: {
                  value: /^[A-ZÑÁÉÍÓÚ]+(?:(?: |-| - | -|- | - )[A-ZÑÁÉÍÓÚ]+)*$/,
                  message:
                    'Solo se permiten letras mayúsculas, guion en medio y un solo espacio entre palabras',
                },
                maxLength: {
                  value: 50,
                  message: 'El nombre no puede exceder los 50 caracteres',
                },
              }}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-9 mb-6">
            <InputText
              label="Costo de Inscripción"
              name="cost"
              placeholder="0.00"
              type="text"
              className="w-full lg:w-[480px]"
              register={register}
              validationRules={{
                pattern: {
                  value: /^\d+(\.\d{1,2})?$/,
                  message:
                    'El costo debe ser un número positivo con hasta dos decimales',
                },
                required: 'Se debe ingresar un valor mayor a 0.00',
                min: {
                  value: 0.01,
                  message: 'Se debe ingresar un valor mayor a 0.00',
                },
              }}
              errors={errors}
            />

            <InputText
              label="Límite de Áreas por Estudiante"
              name="limitAreas"
              placeholder="0"
              type="text"
              className="w-full lg:w-[480px]"
              register={register}
              validationRules={{
                pattern: {
                  value: /^[0-9]+$/,
                  message:
                    'El límite debe ser un número entero positivo sin comas ni puntos',
                },
                required: 'Se debe ingresar un valor mayor o igual a 0',
                min: {
                  value: 0,
                  message: 'Se debe ingresar un valor mayor o igual a 0',
                },
                max: {
                  value: 100,
                  message: 'Se debe ingresar un valor menor a 100',
                },
              }}
              errors={errors}
              onInput={(e) => {
                const input = e.target as HTMLInputElement;
                input.value = input.value.replace(/[^0-9]/g, '');
              }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-9 mb-6">
            <InputText
              label="Fecha de Inicio"
              name="dateIni"
              placeholder="DD/MM/YYYY"
              type="date"
              className="w-full lg:w-[480px]"
              register={register}
              validationRules={{
                required: 'Debe ingresar una fecha de inicio',
                validate: async (value: string) => {
                  const year = getValues('year');
                  const selectedYear = getValues('year');

                  if (!selectedYear) {
                    return 'Debe seleccionar un año/gestión primero';
                  }

                  const inputYear = value.split('-')[0];

                  if (inputYear !== selectedYear) {
                    return `La fecha de inicio debe estar dentro del año ${selectedYear}`;
                  }
                  if (!year) return 'Seleccione un año primero';

                  // Validación completa
                  return await validateDates(
                    value,
                    getValues('dateEnd') || value,
                    year,
                  );
                },
              }}
              errors={errors}
            />

            <InputText
              label="Fecha de Cierre"
              name="dateEnd"
              placeholder="DD/MM/YYYY"
              type="date"
              className="w-full lg:w-[480px]"
              register={register}
              validationRules={{
                required: 'Debe ingresar una fecha de cierre',
                validate: async (value: string) => {
                  const selectedYear = getValues('year');
                  const dateIniValue = getValues('dateIni');

                  if (!dateIniValue) {
                    return 'Debe ingresar la fecha de inicio primero';
                  }

                  const dateIni = new Date(dateIniValue);
                  const dateEnd = new Date(value);
                  const year = getValues('year');
                  const dateInii = getValues('dateIni');

                  if (dateEnd <= dateIni) {
                    return 'La fecha de cierre debe ser posterior a la fecha de inicio';
                  }

                  if (!selectedYear) {
                    return 'Debe seleccionar un año/gestión primero';
                  }

                  const inputYear = value.split('-')[0];
                  if (inputYear !== selectedYear) {
                    return `La fecha de cierre debe estar dentro del año ${selectedYear}`;
                  }
                  // Validación completa
                  return await validateDates(dateInii, value, year);
                },
              }}
              errors={errors}
            />
          </div>

          <div className="grid grid-cols-1 gap-9 mb-6"></div>

          <div className="flex flex-col-reverse md:flex-row md:justify-end md:space-x-5">
            <Button
              label="Cancelar"
              variantColor="variant2"
              className="mt-5 md:mt-0"
              onClick={() => navigate('/administrator')}
            />
            <Button
              type="submit"
              label="Registrar"
              disabled={!isValid}
              variantColor={!isValid ? 'variantDesactivate' : 'variant1'}
            />
          </div>
        </div>
      </form>
      {showModal && (
        <Modal
          onClose={onCloseModal}
          text="¿Estás seguro de que deseas registrar esta información?"
          onConfirm={onConfirm}
        />
      )}
    </div>
  );
}
