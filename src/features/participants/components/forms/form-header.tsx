import { InputText } from '@/components';
import { FieldErrors, UseFormRegister } from 'react-hook-form';

interface ParticipantFormHeaderProps {
  register: UseFormRegister<any>;
  errors: FieldErrors;
}

export default function ParticipantFormHeader({
  register,
  errors,
}: ParticipantFormHeaderProps) {
  return (
    <section className="grid grid-cols-1 items-start gap-4 mb-6 mt-10">
      <div className="flex flex-col">
        <InputText
          label="Cédula de identidad del olimpista"
          name="olimpista.ci"
          placeholder="Ingresar ci del olimpista"
          className="w-full"
          register={register}
          validationRules={{
            required: 'Debe ingresar la cédula del olimpista.',
            pattern: {
              value: /^(?! )[0-9]+(?<! )$/,
              message: 'Solo se permiten números y no puede haber espacios.',
            },
          }}
          errors={errors}
        />
      </div>
    </section>
  );
}
