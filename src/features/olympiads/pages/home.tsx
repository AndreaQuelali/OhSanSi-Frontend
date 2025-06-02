import { Button } from '@/components';
import { useNavigate } from 'react-router';

export const Home = () => {
  const navigate = useNavigate();
  return (
    <main className="w-full flex flex-col items-center justify-center px-4 md:px-16 py-10 text-onBack">
      <section className="text-center w-9/12 flex items-center space-x-10">
        <div>
          <h1 className="headline-lg text-primary mb-4">
            OLIMPIADA CIENTÍFICA NACIONAL
            <br /> SAN SIMÓN 2025
          </h1>
          <p className="mb-6 text-lg text-left">
            El Comité de la Olimpiadas Científica Nacional San Simón O! SANSI, a
            través de la Facultad de Ciencias y Tecnología de la Universidad
            Mayor de San Simón, convoca a los estudiantes del Sistema de
            Educación Regular a participar en las Olimpiadas O! SANSI.
          </p>
          <div className="w-full flex justify-center">
            <Button
              label="Inscribirme"
              onClick={() => navigate('/register-olimpists')}
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

      <section className="text-center mb-10 w-9/12">
        <h1 className="headline-lg text-primary mb-4">Pasos</h1>
        <div className="space-y-6 text-left">
          {[
            {
              label: 'Registrar Tutor',
              description:
                '¿Eres padre/madre o profesor de un participante? Regístrate aquí para que puedas ser asignado a uno o más estudiantes en sus inscripciones. Solo necesitas hacerlo una vez',
            },
            {
              label: 'Registrar olimpista',
              description:
                'Registra los datos básicos de un participante (nombre, colegio, tutor legal). Luego, podrás inscribirlo en las áreas que desee competir',
            },
            {
              label: 'Inscripción individual',
              description:
                'Inscribe a un estudiante ya registrado con su tutor académico(profesor) en uno o más áreas de competencia.',
            },
            {
              label: 'Inscripción grupal',
              description:
                'Inscribe a varios estudiantes a la vez. Elige si todos participarán en la misma área (ej: Matemáticas) o si cada uno tiene competencias diferentes.',
            },
          ].map((step, index) => (
            <div key={index} className="flex items-start gap-4">
              <button className="bg-primary text-white px-4 py-2 rounded-full text-sm font-medium min-w-max">
                {step.label}
              </button>
              <p className="text-left text-base">{step.description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};
