import { Button } from '@/components';
import { useNavigate } from 'react-router';
import CardTotal from '../components/card-total';

export const Home = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');
  return (
    <main className="w-full flex flex-col items-center justify-center px-4 md:px-16 py-10 text-onBack">
      {userRole === 'olympian' && (
        <section className="text-center mb-16 w-10/12">
          <h1 className="headline-lg text-primary mb-6">Guía de Registro</h1>
          <div className="space-y-6 text-left">
            {[
              {
                label: 'Registrar Tutor',
                ruta: '/olympian/register-tutor',
                description:
                  '¿Eres padre/madre o profesor de un participante? Regístrate aquí para que puedas ser asignado a uno o más estudiantes en sus inscripciones. Solo necesitas hacerlo una vez',
              },
              {
                label: 'Registrar olimpista',
                ruta: '/olympian/register-olympians',
                description:
                  'Registra los datos básicos de un participante (nombre, colegio, tutor legal). Luego, podrás inscribirlo en las áreas que desee competir',
              },
              {
                label: 'Inscripción individual',
                ruta: '/olympian/register-selected-areas',
                description:
                  'Inscribe a un estudiante ya registrado con su tutor académico(profesor) en uno o más áreas de competencia.',
              },
              {
                label: 'Inscripción grupal',
                ruta: '/olympian/register-data-excel',
                description:
                  'Inscribe a varios estudiantes a la vez. Elige si todos participarán en la misma área (ej: Matemáticas) o si cada uno tiene competencias diferentes.',
              },
            ].map((step, index) => (
              <div
                key={index}
                className="flex lg:items-start lg:flex-row flex-col-reverse gap-4 lg:space-x-12"
              >
                <Button
                  className="lg:w-1/3 w-full mb-6"
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
        <section className=" max-w-6xl mb-14 w-10/12">
          <h1 className="headline-lg text-primary mb-4">Hola, Admi</h1>
          <p className="body-lg text-neutral mb-6">
            Bienvenido al sistema de administración de olimpiadas
          </p>
          <div className="flex flex-col mb-6 md:flex-row items-center justify-between border-2 border-success rounded-xl p-4 bg-white shadow-sm">
            <div className="text-center md:text-left">
              <h3 className="text-lg font-semibold text-onBack">
                Estado de la Olimpiada
              </h3>
              <p className="text-sm text-neutral">
                Las inscripciones están activas
              </p>
            </div>
            <span className="mt-4 md:mt-0 px-5 py-1 rounded-full bg-success text-white font-semibold text-sm">
              ABIERTA
            </span>
          </div>

          <div className="flex flex-wrap justify-center gap-6 lg:gap-32 mb-6">
            <CardTotal
              title="Total Participantes"
              value={255}
              subtitle="Inscritos actualmente"
            />
            <CardTotal
              title="Total de Áreas"
              value={9}
              subtitle="Áreas disponibles"
            />
            <CardTotal
              title="Total de Niveles"
              value={10}
              subtitle="Niveles disponibles"
            />
          </div>

          <h3 className="headline-sm text-primary mb-6">Accesos rápidos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                label: 'Registrar nueva Olimpiada',
                path: '/administrator/register-info',
              },
              {
                label: 'Registrar Áreas',
                path: '/administrator/register-areas',
              },
              {
                label: 'Registrar Niveles',
                path: '/administrator/register-levels',
              },
              {
                label: 'Asociación Niveles con Grados',
                path: '/administrator/register-levels-grades',
              },
              {
                label: 'Registro Niveles en Área',
                path: '/administrator/register-levels-area',
              },
              {
                label: 'Reporte de Olimpistas',
                path: '/administrator/report-registered-olimpist',
              },
            ].map((item) => (
              <Button
                onClick={() => navigate(item.path)}
                label={item.label}
                className="w-full"
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
};
