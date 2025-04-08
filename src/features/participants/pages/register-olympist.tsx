import { useForm, FormProvider } from 'react-hook-form';
import FormDataPart from '../components/form-data-participant';

export default function RegisterOlympistPage() {
  const methods = useForm();

  return (
    <FormProvider {...methods}>
      <FormDataPart />
    </FormProvider>
  );
}
