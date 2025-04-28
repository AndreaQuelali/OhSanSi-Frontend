import TableOlympians from '@/features/olympians-with-tutor/components/table-olympist';
import FormOneTutor from '../components/form-one-tutor';
import FormTutor from '@/features/participants/components/form-tutor';

export default function RegisterListPartTutors() {
  return (
    <div className="p-4 flex flex-col justify-center gap-4 w-full mb-16">
      <h1 className="text-center text-lg headline-md sm:text-xl md:text-2xl font-bold text-primary mb-6">
        Registro de Lista de Olimpistas con varios Tutores
      </h1>
      <FormTutor viewTB={false} />
      <TableOlympians tutor={true} />
    </div>
  );
}
