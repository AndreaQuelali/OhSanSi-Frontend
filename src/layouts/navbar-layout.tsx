import { Link, Outlet, useLocation } from 'react-router';
import { useState, useEffect, useRef } from 'react';
import IconUser from '@/components/icons/icon-user';
import FooterDesign from '@/components/ui/footer-design';
import IconDown from '@/components/icons/icon-down';

export default function NavbarLayout() {
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const adminMenuRef = useRef<HTMLLIElement>(null);
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        adminMenuRef.current &&
        !adminMenuRef.current.contains(event.target as Node)
      ) {
        setIsAdminMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <nav className="relative sm:sticky sm:top-0 bg-surface h-[80px] flex items-center px-6 z-50">
        <div className="flex justify-between items-center w-full h-full">
          <Link to="/" className="flex items-center">
            <img
              src="/assets/images/ohsansi.jpg"
              alt="Logo"
              className="w-16 h-16"
            />
          </Link>
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
              onClick={() => setIsAdminMenuOpen((prev) => !prev)}
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
                      location.pathname === '/'
                        ? 'text-red-500'
                        : 'text-primary'
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
        </div>
      </nav>
      <main className="flex-grow">
        <Outlet />
      </main>
      <FooterDesign />
    </div>
  );
}
