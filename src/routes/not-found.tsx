import FooterDesign from '@/components/ui/footer-design';
import React from 'react';
const NotFound: React.FC = () => {
  return (
    <div className="w-full min-h-screen flex flex-col font-roboto items-center justify-center bg-white text-primary text-center">
      <div className="flex items-center justify-center min-h-screen gap-10">
        <img
          src="/public/assets/images/not-found.jpg"
          alt="People search"
          className="w-96"
        />

        <div>
          <div className="text-8xl font-bold mb-4 tracking-widest">404</div>
          <h1 className="headline-lg mb-2">Oops, esta página no existe</h1>
          <p className="text-sm max-w-md mb-6 text-neutral">
            El enlace al que intentaste acceder parece estar roto o no existe.
            Puedes volver a la página principal o verificar la URL.
          </p>
          <p className="mt-4">
            <a href="/" className="text-primary hover:underline">
              Volver al inicio
            </a>
          </p>
        </div>
      </div>
      <FooterDesign />
    </div>
  );
};

export default NotFound;
