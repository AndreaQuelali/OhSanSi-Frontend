import { Button } from '@/components';
import { useNavigate } from 'react-router';

export const Presentation = () => {
  const navigate = useNavigate();
  localStorage.setItem('userRole', 'user');
  return (
    <main className="w-full flex flex-col items-center justify-center px-4 md:px-16 py-10 text-onBack">
      <section className="text-center w-9/12 flex items-center space-x-10">
        <div>
          <h1 className="headline-lg text-primary mb-4">
            OLIMPIADA CIENTÍFICA NACIONAL
            <br /> SAN SIMÓN
          </h1>
          <p className="mb-6 text-lg">
            El Comité de la Olimpiadas Científica Nacional San Simón O! SANSI, a
            través de la Facultad de Ciencias y Tecnología de la Universidad
            Mayor de San Simón, convoca a los estudiantes del Sistema de
            Educación Regular a participar en las Olimpiadas O! SANSI.
          </p>
          <div className="flex space-x-10 justify-center">
            <Button
              label="Administrador"
              onClick={() => {
                localStorage.setItem('userRole', 'admin');
                navigate('/');
              }}
            />
            <Button
              label="Olimpista"
              onClick={() => {
                localStorage.setItem('userRole', 'olympist');
                navigate('/');
              }}
            />
          </div>
        </div>
        <img src="/assets/images/ohsansi2.png" className="mb-10 w-80" />
      </section>
      <section className="text-center mb-10 w-9/12">
        <h1 className="headline-lg text-primary mb-4">Inscripción</h1>
        <div className="flex flex-col items-start">
          <p className="text-base mb-1">
            La fecha de inscripción inicia el{' '}
            <span className="text-red-500 font-semibold">
              13 de Junio del 2025
            </span>
          </p>
          <p className="text-base mb-1">
            La fecha de finalización de inscripción será hasta el{' '}
            <span className="text-red-500 font-semibold">
              15 de Agosto del 2025
            </span>
          </p>
          <p className="text-base">
            El costo de inscripción será de los{' '}
            <span className="text-red-500 font-semibold">15 (Bs)</span> por área
          </p>
        </div>
      </section>

      <section className="text-center mb-10 w-9/12">
        <h1 className="headline-lg text-primary mb-4">Áreas disponibles</h1>
        <div className="overflow-x-auto">hola</div>
      </section>

      <section className="text-center mb-10 w-9/12">
        <h1 className="headline-lg text-primary mb-4">Prerrequisitos</h1>
        <div className="flex flex-col items-start">
          <p>
            1. Ser estudiante de nivel primaria o secundaria en el sistema de
            Educación Regular del Estado Plurinacional de Bolivia.
          </p>
          <p>2. Registrar un tutor o profesor.</p>
          <p>
            3. Registrarse en el formulario de inscripción para el(las) área(s)
            que se postula.
          </p>
          <p>
            4. Cumplir los requisitos específicos de la categoría de competencia
            en la que se inscribe.
          </p>
          <p>
            5. Tener su documento de identificación personal vigente (cédula de
            identidad) en el desarrollo de la competencia.
          </p>
          <p>6. Contar con correo electrónico personal o del tutor.</p>{' '}
        </div>
      </section>
    </main>
  );
};
