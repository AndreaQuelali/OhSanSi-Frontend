import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Dropdown, InputText, Modal } from '../../../components';
import { useApiForm } from '@/hooks/use-api-form';
import { FormData } from '../interfaces/form-info';
import { useNavigate } from 'react-router-dom';

export default function FormInfo() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<FormData | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isValid },
    getValues,
  } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      year: '',
    },
  });
  const { submitForm } = useApiForm('olympiad-registration');

  const onSubmit = async (data: FormData) => {
    setFormData(data);
    setShowModal(true);
  };

  const onConfirm = async () => {
    if (!formData) return;

    const payload = {
      gestion: Number(formData.year),
      costo: parseFloat(formData.cost.toString()),
      fecha_inicio: formData.dateIni,
      fecha_fin: formData.dateEnd,
      max_categorias_olimpista: Number(formData.limitAreas),
    };


    try {
      const response = await submitForm(payload);
      if (response) {
        console.log('Registro exitoso:', response);
        alert('Registro exitoso');
        localStorage.setItem('gestion', formData.year);
        reset(); 
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
                { id: '2024', name: '2024' },
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
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-9 mb-6">
            <InputText
              label="Fecha de Inicio"
              name="dateIni"
              placeholder="DD/MM/YY"
              type="date"
              className="w-full lg:w-[480px]"
              register={register}
              validationRules={{
                required: 'Debe ingresar una fecha de inicio',
                validate: (value: string) => {
                  const today = new Date();
                  const [day, month, year] = value.split('/');
                  const inputDate = new Date(`${year}-${month}-${day}`);
                  today.setHours(0, 0, 0, 0);
                  inputDate.setHours(0, 0, 0, 0);
                  if (inputDate < today) {
                    return 'La fecha de inicio debe ser igual o posterior a la fecha actual';
                  }
                  return true;
                },
              }}
              errors={errors}
            />
            <InputText
              label="Fecha de Cierre"
              name="dateEnd"
              placeholder="DD/MM/YY"
              type="date"
              className="w-full  lg:w-[480px]"
              register={register}
              validationRules={{
                required: 'Debe ingresar una fecha de cierre',
                validate: (value: string) => {
                  const [dayEnd, monthEnd, yearEnd] = value.split('/');
                  const dateEnd = new Date(`${yearEnd}-${monthEnd}-${dayEnd}`);
                  const dateIniValue = getValues('dateIni');
                  if (!dateIniValue)
                    return 'Debe ingresar la fecha de inicio primero';

                  const [dayIni, monthIni, yearIni] = dateIniValue.split('/');
                  const dateIni = new Date(`${yearIni}-${monthIni}-${dayIni}`);

                  if (dateEnd <= dateIni) {
                    return 'La fecha de cierre debe ser posterior a la fecha de inicio';
                  }
                  return true;
                },
              }}
              errors={errors}
            />
          </div>
          <div className="grid grid-cols-1 gap-9 mb-6">
            <InputText
              label="Límite de Áreas por Estudiante"
              name="limitAreas"
              placeholder="0"
              type="number"
              className="w-full lg:w-[480px]"
              register={register}
              validationRules={{
                pattern: {
                  value: /^\d+$/,
                  message: 'El límite debe ser un número entero positivo',
                },
                required: 'Se debe ingresar un valor mayor a 0',
                min: {
                  value: 1,
                  message: 'Se debe ingresar un valor mayor o igual a 1',
                },
              }}
              errors={errors}
            />
          </div>

          <div className="flex flex-col-reverse md:flex-row md:justify-end md:space-x-5">
            <Button
              label="Cancelar"
              variantColor="variant2"
              className="mt-5 md:mt-0"
              onClick={() => navigate('/')}
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
