import { useForm, FormProvider } from 'react-hook-form';
import RegistrationsList from '../components/lists/registrations-list';

export default function RegistrationsPage() {
  const methods = useForm();

  return (
    <FormProvider {...methods}>
      <RegistrationsList title="Registros de Inscripciones" />
    </FormProvider>
  );
}
