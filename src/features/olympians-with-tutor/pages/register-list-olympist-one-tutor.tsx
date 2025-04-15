import TableOlympians from '@/features/olympians-with-tutor/components/table-olympist';
import FormOneTutor from '../components/form-one-tutor';

export default function RegisterListOlympistOneTutor() {
  return (
    <div className="p-4 flex flex-col justify-center gap-4 w-full h-screen mb-16">
      <h1 className="text-center text-lg headline-md sm:text-xl md:text-2xl font-bold text-primary mb-6">
        Registro de Lista de Olimpistas con Tutor
      </h1>
      <FormOneTutor />
      <TableOlympians />
    </div>
  );
}
