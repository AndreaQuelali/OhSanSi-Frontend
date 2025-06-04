import { Link, Outlet } from 'react-router';
import { useState, useEffect, useRef } from 'react';
import FooterDesign from '@/components/ui/footer-design';
import IconHambur from '@/components/icons/icon-hambur';
import IconClose from '@/components/icons/icon-close';
import DesktopMenu from '@/components/ui/menu-desktop';

export default function NavbarLayout() {
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const adminMenuRef = useRef<HTMLLIElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole'));

  useEffect(() => {
    const interval = setInterval(() => {
      const currentRole = localStorage.getItem('userRole');
      if (currentRole !== userRole) {
        setUserRole(currentRole);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [userRole]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        adminMenuRef.current &&
        !adminMenuRef.current.contains(event.target as Node)
      ) {
        setIsAdminMenuOpen(false);
      }

      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <nav className="sticky top-0 bg-white h-[80px] flex items-center px-6 z-50">
        <div className="flex justify-between items-center w-full h-full">
          <Link
            to={userRole === 'user' ? '/presentation' : '/'}
            className="flex items-center"
          >
            <img
              src="/assets/images/logoOhSanSi.png"
              alt="Logo"
              className="h-16 lg:h-20"
            />
          </Link>
          <DesktopMenu
            isAdminMenuOpen={isAdminMenuOpen}
            setIsAdminMenuOpen={setIsAdminMenuOpen}
            adminMenuRef={adminMenuRef}
          />
          <div className="lg:hidden" ref={mobileMenuRef}>
            <button
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <IconClose className="w-8 h-8 cursor-pointer" />
              ) : (
                <IconHambur className="w-8 h-8 cursor-pointer transition" />
              )}
            </button>
            {isMobileMenuOpen && (
              <div
                className="absolute top-full left-0 w-full bg-white shadow-lg rounded-md z-50"
                onClick={(e) => e.stopPropagation()}
              >
                <ul>
                  {userRole === 'admin' && (
                    <>
                      <li>
                        <Link
                          to="/register-info"
                          className="px-4 py-2 text-sm text-primary hover:text-secondary"
                        >
                          Registro General
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/register-areas"
                          className="px-4 py-2 text-sm text-primary hover:text-secondary"
                        >
                          Registro de Áreas
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/register-levels"
                          className="px-4 py-2 text-sm text-primary hover:text-secondary"
                        >
                          Registro de Niveles
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/register-levels-grades"
                          className="px-4 py-2 text-sm text-primary hover:text-secondary"
                        >
                          Asociar Niveles con Grados
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/register-levels-area"
                          className="px-4 py-2 text-sm text-primary hover:text-secondary"
                        >
                          Registro de Niveles en Área
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/report-registered-olimpist"
                          className="px-4 py-2 text-sm text-primary hover:text-secondary"
                        >
                          Reportes
                        </Link>
                      </li>
                    </>
                  )}

                  {userRole === 'olympist' && (
                    <>
                      <li>
                        <Link
                          to="/register-olimpists"
                          className="px-4 py-2 text-sm text-primary hover:text-secondary"
                        >
                          Registro Olimpista
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/register-tutor"
                          className="px-4 py-2 text-sm text-primary hover:text-secondary"
                        >
                          Registro Tutor
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/register-selected-areas"
                          className="px-4 py-2 text-sm text-primary hover:text-secondary"
                        >
                          Registro de Áreas
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/register-data-excel"
                          className="px-4 py-2 text-sm text-primary hover:text-secondary"
                        >
                          Registro por Excel
                        </Link>
                      </li>

                      <li>
                        <Link
                          to="/generate-order-payment"
                          className="px-4 py-2 text-sm text-primary hover:text-secondary"
                        >
                          Orden de Pago
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/upload-payment"
                          className="px-4 py-2 text-sm text-primary hover:text-secondary"
                        >
                          Comprobante de Pago
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/registrations"
                          className="px-4 py-2 text-sm text-primary hover:text-secondary"
                        >
                          Inscripciones
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </nav>
      <main className="flex-grow">
        <Outlet />
      </main>
      <FooterDesign />
    </div>
  );
}
