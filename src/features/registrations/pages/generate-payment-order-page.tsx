import { useForm, FormProvider } from 'react-hook-form';
import RegistrationsList from '../components/registrations-list';

export default function RegistrationsPage() {
  const methods = useForm();

  return (
    <FormProvider {...methods}>
      <RegistrationsList showGenerateButton title='Generar boleta de orden de pago'/>
    </FormProvider>
  );
}