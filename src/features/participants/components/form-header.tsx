import { InputText } from '@/components';
import { FieldErrors, UseFormRegister } from 'react-hook-form';

interface ParticipantFormHeaderProps {
  register: UseFormRegister<any>;
  errors: FieldErrors;
  tutorError: string | null;
}

export default function ParticipantFormHeader({
  register,
  errors,
  tutorError,
}: ParticipantFormHeaderProps) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 items-start gap-4 mb-6 mt-10">
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
      <div className="flex flex-col">
        <InputText
          label="Cédula de identidad del tutor académico (Opcional)"
          name="tutor.ci"
          placeholder="Ingresar ci del tutor académico"
          className="w-full"
          register={register}
          isRequired={false}
          validationRules={{
            pattern: {
              value: /^(?! )[0-9]+(?<! )$/,
              message: 'Solo se permiten números y no puede haber espacios.',
            },
          }}
          errors={errors}
        />
        {tutorError && (
          <p className="text-error subtitle-sm text-wrap mt-[-22px]">
            {tutorError}
          </p>
        )}
      </div>
    </section>
  );
}
