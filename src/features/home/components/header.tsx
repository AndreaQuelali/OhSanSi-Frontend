import { Button } from '@/components';
import { useNavigate } from 'react-router';
import { useEffect } from 'react';
import AnimatedText from '@/components/ui/animated-text';
import { motion } from 'framer-motion';

export const Header = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('userRole', 'user');
  }, []);

  return (
    <section className="relative w-full flex flex-col-reverse lg:flex-row items-center lg:space-x-10 mb-10 text-center bg-gradient-to-b md:bg-gradient-to-r from-primary via-primary/40 to-white p-6 pb-32 overflow-hidden">
      {/* SVG fondo decorativo */}
      <div className="absolute bottom-0 left-0 w-full h-40">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1000 100"
          preserveAspectRatio="xMidYMax slice"
          className="w-full h-full -scale-y-100 -scale-x-100"
        >
          <path
            className="fill-white opacity-45"
            d="M473,67.3c-203.9,88.3-263.1-34-320.3,0C66,119.1,0,59.7,0,59.7V0h1000v59.7 c0,0-62.1,26.1-94.9,29.3c-32.8,3.3-62.8-12.3-75.8-22.1C806,49.6,745.3,8.7,694.9,4.7S492.4,59,473,67.3z"
          ></path>
          <path
            className="fill-white opacity-45"
            d="M734,67.3c-45.5,0-77.2-23.2-129.1-39.1c-28.6-8.7-150.3-10.1-254,39.1 s-91.7-34.4-149.2,0C115.7,118.3,0,39.8,0,39.8V0h1000v36.5c0,0-28.2-18.5-92.1-18.5C810.2,18.1,775.7,67.3,734,67.3z"
          ></path>
          <path
            className="fill-white opacity-100"
            d="M766.1,28.9c-200-57.5-266,65.5-395.1,19.5C242,1.8,242,5.4,184.8,20.6C128,35.8,132.3,44.9,89.9,52.5C28.6,63.7,0,0,0,0 h1000c0,0-9.9,40.9-83.6,48.1S829.6,47,766.1,28.9z"
          ></path>
        </svg>
      </div>

      {/* Contenido */}
      <div className="flex flex-col md:flex-row pt-5 items-center justify-center lg:justify-start mb-6 lg:mb-0 md:mx-32 gap-10 z-10">
        <div className="flex flex-col items-start">
          <AnimatedText
            text="OLIMPIADA CIENTÍFICA NACIONAL"
            className="headline-lg text-white mb-4 text-left"
            delay={0.04}
          />
          <AnimatedText
            text="SAN SIMÓN"
            className="headline-lg text-white mb-4 text-left"
            delay={0.04}
          />
          <p className="mb-6 body-lg text-left text-white">
            El Comité de la Olimpiadas Científica Nacional San Simón O! SanSi, a
            través de la Facultad de Ciencias y Tecnología de la Universidad
            Mayor de San Simón, convoca a los estudiantes del Sistema de
            Educación Regular a participar en las Olimpiadas O! SanSi.
          </p>
          <div className="w-full flex flex-col sm:flex-row gap-4 lg:gap-6 justify-center lg:justify-start">
            <Button
              label="Administrador"
              className="lg:w-40"
              onClick={() => {
                navigate('/login');
              }}
            />
            <Button
              label="Olimpista"
              className="lg:w-40"
              onClick={() => {
                localStorage.setItem('userRole', 'olympian');
                navigate('/olympian');
              }}
            />
          </div>
        </div>
        <motion.img
          src="/assets/images/ohsansi2.png"
          className="mb-10 w-80"
          initial={{ scale: 1, rotate: 0 }}
          animate={{ scale: [1, 1.05, 1], rotate: [0, 5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    </section>
  );
};
