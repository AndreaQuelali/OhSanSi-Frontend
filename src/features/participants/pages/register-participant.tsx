import { useForm, FormProvider } from 'react-hook-form';
import FormDataPart from '../components/form-data-participant';

export default function RegisterParticipantPage() {
  const methods = useForm();

  return (
    <main className="w-full min-h-screen flex flex-col items-center justify-center">
      <FormDataPart />
    </main>
  );
}
