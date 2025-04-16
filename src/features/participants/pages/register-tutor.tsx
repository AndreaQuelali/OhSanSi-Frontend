import { useForm, FormProvider } from 'react-hook-form';
import FormTutor from '../components/form-tutor';

export default function RegisterTutorPage() {
  const methods = useForm();

  return (
    <FormProvider {...methods}>
      <FormTutor viewTB={true} />
    </FormProvider>
  );
}
