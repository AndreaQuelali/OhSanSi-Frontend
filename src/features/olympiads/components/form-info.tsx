import { useForm } from 'react-hook-form';
import { Button, Dropdown, InputText } from '../../../components';

type FormData = {
  year: string;
  cost: number;
  dateIni: string;
  dateEnd: string;
};

export default function FormInfo() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    getValues,
  } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      year: '',
    },
  });

  const onSubmit = (data: FormData) => {
    console.log('Formulario enviado con éxito:', data);
  };

  return (
    <div className="flex flex-col h-[87vh]">
      <div className="flex flex-col items-center justify-center flex-grow">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-9/12 mx-auto w-full mb-20"
        >
          <h1 className="text-center text-primary mb-10 headline-lg">
            Registro de Información General de la Olimpiada
          </h1>

          <div className="px-10 md:px-3 lg:px-0 flex flex-col md:flex-row justify-between mb-5">
            <Dropdown
              name="year"
              label="Año/Gestión"
              placeholder="Seleccionar año o gestión"
              className="w-[480px] h-[50px]"
              options={[
                { id: '2024', name: '2024' },
                { id: '2025', name: '2025' },
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
              className="w-[480px]"
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

          <div className="px-10 md:px-3 lg:px-0 flex flex-col md:flex-row justify-between">
            <InputText
              label="Fecha de Inicio"
              name="dateIni"
              placeholder="DD/MM/YY"
              type="date"
              className="w-[480px]"
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
              className="w-[480px]"
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
            <div className="px-10 md:px-3 lg:px-0 flex flex-col md:flex-row justify-between mb-5">
            <InputText
              label="Límite de Áreas por Estudiante"
              name="limitAreas"
              placeholder="0"
              type="number"
              className="w-[480px]"
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

          <div className="flex flex-row mt-10 justify-end gap-4">
            <Button label="Cancelar" variantColor="variant2" />
            <Button
              type="submit"
              label="Registrar"
              disabled={!isValid}
              variantColor={!isValid ? 'variantDesactivate' : 'variant1'}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
