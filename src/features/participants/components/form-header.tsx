import { InputText } from '@/components';
import { FieldErrors, UseFormRegister, useWatch } from 'react-hook-form';
import { useEffect } from 'react';

interface ParticipantFormHeaderProps {
  register: UseFormRegister<any>;
  errors: FieldErrors;
  tutorError: string | null;
  clearTutorError?: () => void;
  control?: any;
}

export default function ParticipantFormHeader({
  register,
  errors,
  tutorError,
  clearTutorError,
  control,
}: ParticipantFormHeaderProps) {
  const tutorCi = control
    ? useWatch({
        control,
        name: 'tutor.ci',
        defaultValue: '',
      })
    : '';

  useEffect(() => {
    if (clearTutorError && (!tutorCi || tutorCi === '')) {
      clearTutorError();
    }
  }, [tutorCi, clearTutorError]);

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
        {tutorError && tutorCi && (
          <p
            className={`text-error subtitle-sm text-wrap ${errors.tutor?.ci ? 'mt-1' : 'mt-[-20px]'}`}
          >
            {tutorError}
          </p>
        )}
      </div>
    </section>
  );
}
