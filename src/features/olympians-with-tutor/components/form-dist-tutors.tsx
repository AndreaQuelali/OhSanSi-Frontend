import { InputText } from '@/components/ui/input';
import FormTutor from '@/features/participants/components/form-tutor';
import { FormProvider, useForm } from 'react-hook-form';

export default function FormDistTutor() {
  const methods = useForm();

  return (
    <FormProvider {...methods}>
      <FormTutor />
    </FormProvider>
  );
}
