import { useForm, FormProvider } from 'react-hook-form';
import FormDataExcel from '../components/forms/form-data-excel';

export default function RegisterDataExcel() {
  const methods = useForm();

  return (
    <FormProvider {...methods}>
      <FormDataExcel />
    </FormProvider>
  );
}
