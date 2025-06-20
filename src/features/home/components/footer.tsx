import { ButtonIcon } from '@/components/ui/button-icon';
import {
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaEnvelope,
  FaMapMarkerAlt,
} from 'react-icons/fa';

export const Footer = () => {
  return (
    <footer className="w-full bg-white border-t border-slate-200 py-5 text-onBack">
      <div className="max-w-screen-xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <div className="flex items-center gap-2 mb-2">
            <img
              src="/assets/images/ohsansi2.png"
              alt="Logo ohSansi"
              className="h-10 w-auto"
            />
            <p className="text-lg font-semibold text-primary">ohSansi</p>
          </div>
          <p className="text-sm text-neutral2">
            © {new Date().getFullYear()} Todos los derechos reservados
          </p>
        </div>

        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2 text-sm">
          <div className="flex items-center gap-2 text-neutral2">
            <FaEnvelope className="text-primary" />
            <span>ohsansi@umss.edu</span>
          </div>
          <div className="flex items-center gap-2 text-neutral2">
            <FaMapMarkerAlt className="text-primary" />
            <span>UMSS - Facultad de Ciencias y Tecnología</span>
          </div>
          <div className="flex items-center gap-2 text-neutral2">
            <svg
              className="w-4 h-4 text-primary"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.21 11.72 11.72 0 003.7.59 1 1 0 011 1v3.41a1 1 0 01-1 1A17.91 17.91 0 013 6a1 1 0 011-1h3.41a1 1 0 011 1 11.72 11.72 0 00.59 3.7 1 1 0 01-.21 1.09l-2.17 2.2z" />
            </svg>
            <span>+591 70707070</span>
          </div>
        </div>

        <div className="flex flex-col items-center md:items-end gap-2">
          <p className="subtitle-md text-primary mb-1 text-left">
            Síguenos en:
          </p>
          <div className="flex gap-3">
            <ButtonIcon
              icon={() => <FaTiktok size={20} />}
              variantColor="variant2"
              onClick={() =>
                window.open('https://www.tiktok.com/@ohsansi', '_blank')
              }
            />
            <ButtonIcon
              icon={() => <FaFacebook size={20} />}
              variantColor="variant2"
              onClick={() =>
                window.open(
                  'https://www.facebook.com/people/Ohsansi/61560666333554/',
                  '_blank',
                )
              }
            />
            <ButtonIcon
              icon={() => <FaInstagram size={20} />}
              variantColor="variant2"
              onClick={() =>
                window.open('https://www.instagram.com/ohsansi/', '_blank')
              }
            />
          </div>
        </div>
      </div>
    </footer>
  );
};
