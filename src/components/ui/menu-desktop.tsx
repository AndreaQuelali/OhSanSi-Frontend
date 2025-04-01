import { Link, useLocation } from 'react-router';
import IconUser from '@/components/icons/icon-user';
import IconDown from '@/components/icons/icon-down';

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

  return (
    <ul className="hidden lg:flex items-center justify-end w-screen space-x-16 mr-5">
      <li>
        <Link
          to="/register-applicants"
          className={`subtitle-sm p-1 ${
            location.pathname === '/register-applicants'
              ? 'text-red-500 border-b-[1px] border-b-red-500'
              : 'text-primary hover:text-secondary'
          }`}
        >
          Postulante
        </Link>
      </li>
      <li
        ref={adminMenuRef}
        className="relative"
        onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)}
      >
        <span
          className={`subtitle-sm p-1 cursor-pointer ${
            location.pathname.startsWith('/') ||
            location.pathname.startsWith('/register-areas') ||
            location.pathname.startsWith('/register-levels')
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
                location.pathname === '/' ? 'text-red-500' : 'text-primary'
              }`}
            >
              <Link
                to="/"
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
          </ul>
        )}
      </li>
      <li>
        <IconUser className="w-8 h-8 cursor-pointer" />
      </li>
    </ul>
  );
}
