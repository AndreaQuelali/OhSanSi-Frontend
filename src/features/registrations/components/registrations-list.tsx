import React from 'react';
import RegistrationCard from './cards/registration-card';
import { Button, InputText } from '@/components';
import { RegistrationsListProps } from '../interfaces/registrations';
import { useRegistrationsList } from '../hooks/use-registrations-list';
import { REGISTRATION_VALIDATION_RULES } from '../constants/registrations-list';

const RegistrationsList: React.FC<RegistrationsListProps> = ({
  showGenerateButton = false,
  title = 'Inscripciones',
  showUploadButton = false,
}) => {
  const {
    register,
    handleSubmit,
    errors,
    data,
    loading,
    errorMessage,
    onSubmit,
  } = useRegistrationsList({
    showGenerateButton,
    title,
    showUploadButton,
  });

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mb-32 w-11/12 md:w-10/12 lg:w-full flex flex-col items-center justify-center"
      >
        <h1 className="text-center text-primary mb-8 headline-lg">{title}</h1>
        <div className="flex flex-col md:flex-row md:gap-5 lg:gap-16 w-full lg:w-10/12 items-center justify-center">
          <InputText
            label="Ingrese el CI del responsable para ver las inscripciones asociadas al mismo"
            name="ci"
            placeholder="Ingresar cédula de identidad"
            className="w-full"
            register={register}
            errors={errors}
            validationRules={REGISTRATION_VALIDATION_RULES.ci}
          />
          <div className="flex flex-col w-full md:w-auto">
            <Button
              type="submit"
              label="Consultar"
              variantColor={loading ? 'variantDesactivate' : 'variant1'}
              disabled={loading}
            />
          </div>
        </div>
        <div className="mt-10 min-w-11/12 md:min-w-10/12">
          {data.map((item, index) => (
            <RegistrationCard
              key={index}
              list={item.list}
              registrations={item.registrations}
              isAlternate={index % 2 === 0}
              showGenerateButton={showGenerateButton}
              showUploadButton={showUploadButton}
            />
          ))}
          {!loading && data.length === 0 && errorMessage && (
            <p className="text-center text-gray-500 mt-8">{errorMessage}</p>
          )}
        </div>
      </form>
    </div>
  );
};
export default RegistrationsList;
