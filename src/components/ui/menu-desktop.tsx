import { Link, useLocation } from 'react-router';
import DropdownMenu from './dropdown-menu';
import { useEffect, useState } from 'react';

type DesktopMenuProps = {
  isAdminMenuOpen: boolean;
  setIsAdminMenuOpen: (value: boolean) => void;
  adminMenuRef: React.RefObject<HTMLLIElement | null>;
};

export default function DesktopMenu({
  setIsAdminMenuOpen,
  adminMenuRef,
}: DesktopMenuProps) {
  const location = useLocation();
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
      {userRole === 'user' && (
        <>
          {' '}
          <li
            className={`${location.pathname === '/presentation' ? 'text-red-500 border-b-[1px] border-b-red-500' : 'text-primary'}`}
          >
            <Link
              to="/presentation"
              className="block px-1 pb-[2px] text-sm hover:text-secondary"
            >
              Inicio
            </Link>
          </li>
          <p className="text-neutral2 cursor-default text-sm block px-1 pb-[2px]">
            Noticias
          </p>
          <p className="text-neutral2 cursor-default text-sm block px-1 pb-[2px]">
            Comité
          </p>{' '}
          <p className="text-neutral2 cursor-default text-sm block px-1 pb-[2px]">
            Calendario
          </p>
        </>
      )}

      {userRole === 'olympist' && (
        <>
          <li
            className={`${location.pathname === '/' ? 'text-red-500 border-b-[1px] border-b-red-500' : 'text-primary'}`}
            ref={adminMenuRef}
          >
            <Link
              to="/"
              className="block px-1 pb-[2px] text-sm hover:text-secondary"
            >
              Guía de Registro
            </Link>
          </li>
          <li
            className={`${location.pathname === '/register-data-excel' ? 'text-red-500 border-b-[1px] border-b-red-500' : 'text-primary'}`}
            ref={adminMenuRef}
          >
            <Link
              to="/register-data-excel"
              className="block px-1 pb-[2px] text-sm hover:text-secondary"
            >
              Registro Excel
            </Link>
          </li>

          <DropdownMenu
            label="Registro Manual"
            options={[
              { label: 'Registro Tutor', path: '/register-tutor' },
              { label: 'Registro Olimpista', path: '/register-olimpists' },
              { label: 'Registro de Áreas', path: '/register-selected-areas' },
            ]}
          />
          <DropdownMenu
            label="Orden y Comprobante"
            options={[
              { label: 'Generar Orden', path: '/generate-order-payment' },
              { label: 'Subir Comprobante', path: '/upload-payment' },
            ]}
          />

          <li
            className={`${location.pathname === '/registrations' ? 'text-red-500 border-b-[1px] border-b-red-500' : 'text-primary'}`}
            ref={adminMenuRef}
          >
            <Link
              to="/registrations"
              className="block px-1 pb-[2px] text-sm hover:text-secondary"
            >
              Inscripciones
            </Link>
          </li>
        </>
      )}

      {userRole === 'admin' && (
        <>
          <li
            className={`${location.pathname === '/' ? 'text-red-500 border-b-[1px] border-b-red-500' : 'text-primary'}`}
            ref={adminMenuRef}
          >
            <Link
              to="/"
              className="block px-1 pb-[2px] text-sm hover:text-secondary"
            >
              Inicio
            </Link>
          </li>
          <li
            className={`${location.pathname === '/register-info' ? 'text-red-500 border-b-[1px] border-b-red-500' : 'text-primary'}`}
            ref={adminMenuRef}
          >
            <Link
              to="/register-info"
              className="block px-1 pb-[2px] text-sm hover:text-secondary"
            >
              Registro General
            </Link>
          </li>
          <DropdownMenu
            label="Áreas y Niveles"
            options={[
              { label: 'Registro de Áreas', path: '/register-areas' },
              { label: 'Registro de Niveles', path: '/register-levels' },
              {
                label: 'Asociación Niveles con Grados',
                path: '/register-levels-grades',
              },
              {
                label: 'Registro Niveles en Área',
                path: '/register-levels-area',
              },
            ]}
          />
          <li
            className={`${location.pathname === '/report-registered-olimpist' ? 'text-red-500 border-b-[1px] border-b-red-500' : 'text-primary'}`}
            ref={adminMenuRef}
          >
            <Link
              to="/report-registered-olimpist"
              className="block px-1 pb-[2px] text-sm hover:text-secondary"
            >
              Reportes
            </Link>
          </li>
        </>
      )}
    </ul>
  );
}
