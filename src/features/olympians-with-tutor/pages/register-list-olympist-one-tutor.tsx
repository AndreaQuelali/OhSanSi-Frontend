import FormOneTutor from '../components/form-one-tutor';

export default function RegisterListOlympistOneTutor() {
  return (
    <div className="p-4 flex flex-col items-center justify-center">
      <h1 className="text-center text-lg headline-subtitle-md sm:text-xl md:text-2xl font-bold text-primary mb-6">
        Registro de Lista de Olimpistas con Tutor
      </h1>
      <FormOneTutor />
    </div>
  );
}
