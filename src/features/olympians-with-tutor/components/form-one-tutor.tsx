import { InputText } from '@/components/ui/input';
import { useForm } from 'react-hook-form';

export default function FormOneTutor() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = () => {
    alert('Formulario enviado correctamente');
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-center justify-center gap-2 p-4 w-full"
    >
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 min-w-full place-items-center">
        <InputText
          label="Cédula de identidad"
          name="cedula"
          className="w-[380px]"
          type="text"
          placeholder="Ingresar cédula de identidad"
          register={register}
          errors={errors}
          validationRules={{ required: 'Este campo es obligatorio' }}
        />
        <InputText
          label="Nombre(s)"
          name="nombres"
          className="w-[380px]"
          type="text"
          placeholder="Ingresar nombres"
          register={register}
          errors={errors}
          validationRules={{ required: 'Este campo es obligatorio' }}
        />
        <InputText
          label="Apellido(s)"
          name="apellidos"
          className="w-[380px]"
          type="text"
          placeholder="Ingresar apellidos"
          register={register}
          errors={errors}
          validationRules={{ required: 'Este campo es obligatorio' }}
        />
      </section>
      <section
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 
      min-w-full place-items-center"
      >
        <InputText
          label="Número de celular"
          name="celular"
          placeholder="Ingresar número de celular"
          type="text"
          className="w-[380px]"
          register={register}
          errors={errors}
          validationRules={{
            required: 'Este campo es obligatorio',
            pattern: {
              value: /^[0-9]+$/,
              message: 'Solo se permiten números',
            },
          }}
        />
        <InputText
          label="Correo electrónico"
          name="correo"
          placeholder="Ingresar correo electrónico"
          className="w-[380px]"
          type="email"
          register={register}
          errors={errors}
          validationRules={{
            required: 'Este campo es obligatorio',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Correo electrónico no válido',
            },
          }}
        />
        <div className="flex flex-col justify-center items-start w-[380px]">
          <label className="text-primary subtitle-md py-1">
            Tutor académico <span className="text-error">*</span>
          </label>
          <div className="flex items-center gap-12">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="No"
                {...register('tutorAcademico', {
                  required: 'Este campo es obligatorio',
                })}
              />
              No
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="Si"
                {...register('tutorAcademico', {
                  required: 'Este campo es obligatorio',
                })}
              />
              Sí
            </label>
          </div>
        </div>
      </section>
    </form>
  );
}
