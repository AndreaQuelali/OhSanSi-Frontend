import { useForm, FormProvider } from 'react-hook-form';
import RegistrationsList from '../components/lists/registrations-list';

export default function GenerateOrderPaymentPage() {
  const methods = useForm();

  return (
    <FormProvider {...methods}>
      <RegistrationsList
        showGenerateButton
        title="Generar boleta de orden de pago"
      />
    </FormProvider>
  );
}
