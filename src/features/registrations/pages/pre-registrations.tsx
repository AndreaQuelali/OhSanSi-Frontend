import { useForm, FormProvider } from 'react-hook-form';
import RegistrationsList from '../components/registrations-list';

export default function PreRegistrationsPage() {
  const methods = useForm();

  return (
    <FormProvider {...methods}>
      <RegistrationsList title="Preinscripciones" />
    </FormProvider>
  );
}
