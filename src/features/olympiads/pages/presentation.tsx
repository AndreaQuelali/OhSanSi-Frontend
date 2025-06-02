import { Button } from '@/components';
import { useNavigate } from 'react-router';

export const Presentation = () => {
  const navigate = useNavigate();
  return (
    <main className="w-full h-screen flex flex-col items-center justify-center px-4 md:px-16 py-10 text-onBack">
      <section className="text-center max-w-4xl">
        <h1 className="headline-lg text-primary mb-4">
          OLIMPIADA CIENTÍFICA NACIONAL
          <br /> SAN SIMÓN
        </h1>
        <p className="mb-6 text-lg">
          El Comité de la Olimpiadas Científica Nacional San Simón O! SANSI, a
          través de la Facultad de Ciencias y Tecnología de la Universidad Mayor
          de San Simón, convoca a los estudiantes del Sistema de Educación
          Regular a participar en las Olimpiadas O! SANSI.
        </p>
        <div className="flex space-x-10 justify-center">
          <Button label="Administrador" onClick={() => navigate('/')} />
          <Button label="Postulante" onClick={() => navigate('/')} />
        </div>
      </section>
    </main>
  );
};
