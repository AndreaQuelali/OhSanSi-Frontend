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
              <div
                key={index}
                className="flex items-start gap-4 w-full space-x-12"
              >
                <Button
                  className="w-1/3"
                  onClick={() => navigate(step.ruta)}
                  label={step.label}
                />
                <div className="w-full">
                  <p className="text-left body-lg">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
      {userRole === 'admin' && (
        <section className="w-full max-w-6xl mb-14">
          <h1 className="headline-lg text-primary mb-4">Hola, Admi</h1>
          <p className="body-lg text-neutral mb-6">
            Bienvenido al sistema de administración de olimpiadas
          </p>
          {/**  <h2 className="subtitle-lg text-primary mb-6">
            Estado de la olimpiada actual:
          </h2>
          <div className="mb-10">
            <span className="bg-primary text-white py-1 px-4 rounded-full font-semibold">
              Abierta
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            {[
              { label: 'Total Participantes', value: 255 },
              { label: 'Total Áreas', value: 255 },
              { label: 'Total Pagos', value: 255 },
            ].map((item, idx) => (
              <div
                key={idx}
                className="border-2 border-primary rounded-xl text-center py-4"
              >
                <p className="body-md text-primary mb-1">{item.label}</p>
                <p className="headline-md">{item.value}</p>
              </div>
            ))}
          </div>
 */}
          <h3 className="headline-sm text-primary mb-6">Accesos rápidos</h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            {[
              { label: 'Registrar nueva Olimpiada', path: '/register-info' },
              { label: 'Registrar Áreas', path: '/register-areas' },
              { label: 'Registrar Niveles', path: '/register-levels' },
              {
                label: 'Asociación Niveles con Grados',
                path: '/register-levels-grades',
              },
              {
                label: 'Registro Niveles en Área',
                path: '/register-levels-area',
              },
              {
                label: 'Reporte de Olimpistas',
                path: '/report-registered-olimpist',
              },
            ].map((item) => (
              <Button onClick={() => navigate(item.path)} label={item.label} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
};
