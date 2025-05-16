import { useForm, FormProvider } from 'react-hook-form';
import RegistrationsList from '../components/registrations-list';

export default function UploadPaymentPage() {
  const methods = useForm();

  return (
    <FormProvider {...methods}>
      <RegistrationsList showUploadButton title="Subir comprobante de pago" />
    </FormProvider>
  );
}
