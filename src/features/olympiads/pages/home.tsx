import { Button } from '@/components';
import { useNavigate } from 'react-router';

export const Home = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');
  return (
    <main className="w-full flex flex-col items-center justify-center px-4 md:px-16 py-10 text-onBack">
      {userRole === 'olympist' && (
        <section className="text-center mb-10 w-9/12">
          <h1 className="headline-lg text-primary mb-4">Guía de Registro</h1>
          <div className="space-y-6 text-left">
            {[
              {
                label: 'Registrar Tutor',
                ruta: '/register-tutor',
                description:
                  '¿Eres padre/madre o profesor de un participante? Regístrate aquí para que puedas ser asignado a uno o más estudiantes en sus inscripciones. Solo necesitas hacerlo una vez',
              },
              {
                label: 'Registrar olimpista',
                ruta: '/register-olimpists',
                description:
                  'Registra los datos básicos de un participante (nombre, colegio, tutor legal). Luego, podrás inscribirlo en las áreas que desee competir',
              },
              {
                label: 'Inscripción individual',
                ruta: '/register-selected-areas',
                description:
                  'Inscribe a un estudiante ya registrado con su tutor académico(profesor) en uno o más áreas de competencia.',
              },
              {
                label: 'Inscripción grupal',
                ruta: '/register-data-excel',
                description:
                  'Inscribe a varios estudiantes a la vez. Elige si todos participarán en la misma área (ej: Matemáticas) o si cada uno tiene competencias diferentes.',
              },
            ].map((step, index) => (
              <div key={index} className="flex items-start gap-4">
                <Button
                  onClick={() => navigate(step.ruta)}
                  label={step.label}
                />
                <p className="text-left body-lg">{step.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
};
