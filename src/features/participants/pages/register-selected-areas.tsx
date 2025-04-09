import { useForm, FormProvider } from 'react-hook-form';
import FormAreaPart from '../components/form-areas-participant';

export default function RegisterSelectedAreasPage() {
  const methods = useForm();

  return (
    <FormProvider {...methods}>
      <FormAreaPart />
    </FormProvider>
  );
}
