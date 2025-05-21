import { Link, useLocation } from 'react-router';
import IconUser from '@/components/icons/icon-user';
import DropdownMenu from './dropdown-menu';
import IconDown from '../icons/icon-down';
import { useEffect } from 'react';

type DesktopMenuProps = {
  isAdminMenuOpen: boolean;
  setIsAdminMenuOpen: (value: boolean) => void;
  adminMenuRef: React.RefObject<HTMLLIElement | null>;
};

export default function DesktopMenu({
  isAdminMenuOpen,
  setIsAdminMenuOpen,
  adminMenuRef,
}: DesktopMenuProps) {
  const location = useLocation();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        adminMenuRef.current &&
        !adminMenuRef.current.contains(event.target as Node)
      ) {
        setIsAdminMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [adminMenuRef, setIsAdminMenuOpen]);

  return (
    <ul className="hidden lg:flex items-center justify-end w-screen space-x-16 mr-5">
      <li
        className={`${location.pathname === '/registrations' ? 'text-red-500' : 'text-primary'}`}
        ref={adminMenuRef}
      >
        <Link to="/registrations" className="hover:text-secondary subtitle-sm">
          Inscripciones
        </Link>
      </li>
      <DropdownMenu
        label="Postulante"
        options={[
          { label: 'Registro Olimpista', path: '/register-olimpists' },
          { label: 'Registro Tutor', path: '/register-tutor' },
          { label: 'Registro de Áreas', path: '/register-selected-areas' },
          { label: 'Registro Excel', path: '/register-data-excel' },
          { label: 'Orden de Pago', path: '/generate-order-payment' },
          { label: 'Comprobante de Pago', path: '/upload-payment' },
        ]}
      />
      <li
        ref={adminMenuRef}
        className="relative"
        onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)}
      >
        <span
          className={`subtitle-sm p-1 cursor-pointer ${
            location.pathname.startsWith('/register-info') ||
            location.pathname.startsWith('/register-areas') ||
            location.pathname.startsWith('/register-levels') ||
            location.pathname.startsWith('/register-levels-grades') ||
            location.pathname.startsWith('/register-levels-area')
              ? 'text-red-500 border-b-[1px] border-b-red-500'
              : 'text-primary hover:text-secondary'
          }`}
        >
          Administrador
          <IconDown
            className={`w-4 h-4 inline-block ml-1 transition-transform duration-200 ${
              isAdminMenuOpen ? 'rotate-180' : 'rotate-0'
            }`}
          />
        </span>
        {isAdminMenuOpen && (
          <ul className="absolute top-full left-0 bg-white shadow-lg rounded-md mt-2 w-48">
            <li
              className={`hover:bg-gray-100 ${
                location.pathname === '/register-info'
                  ? 'text-red-500'
                  : 'text-primary'
              }`}
            >
              <Link
                to="/register-info"
                className="block px-4 py-2 text-sm hover:text-secondary"
              >
                Registro General
              </Link>
            </li>
            <li
              className={`hover:bg-gray-100 ${
                location.pathname === '/register-areas'
                  ? 'text-red-500'
                  : 'text-primary'
              }`}
            >
              <Link
                to="/register-areas"
                className="block px-4 py-2 text-sm hover:text-secondary"
              >
                Registro de Áreas
              </Link>
            </li>
            <li
              className={`hover:bg-gray-100 ${
                location.pathname === '/register-levels'
                  ? 'text-red-500'
                  : 'text-primary'
              }`}
            >
              <Link
                to="/register-levels"
                className="block px-4 py-2 text-sm hover:text-secondary"
              >
                Registro de Niveles
              </Link>
            </li>

            <li
              className={`hover:bg-gray-100 ${
                location.pathname === '/register-levels-grades'
                  ? 'text-red-500'
                  : 'text-primary'
              }`}
            >
              <Link
                to="/register-levels-grades"
                className="block px-4 py-2 text-sm hover:text-secondary"
              >
                Asociación Niveles con Grados
              </Link>
            </li>
            <li
              className={`hover:bg-gray-100 ${
                location.pathname === '/register-levels-area'
                  ? 'text-red-500'
                  : 'text-primary'
              }`}
            >
              <Link
                to="/register-levels-area"
                className="block px-4 py-2 text-sm hover:text-secondary"
              >
                Registro Niveles en Área
              </Link>
            </li>
          </ul>
        )}
      </li>
      <li>
        <IconUser className="w-8 h-8 opacity-40 text-white" />
      </li>
    </ul>
  );
}
