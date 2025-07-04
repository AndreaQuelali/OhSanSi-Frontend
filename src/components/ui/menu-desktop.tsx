import { Link, useLocation, useNavigate } from 'react-router';
import DropdownMenu from './dropdown-menu';
import { useEffect, useState } from 'react';
import { ButtonIcon } from './button-icon';
import LogOutIcon from '../icons/icon-log-out';

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

  const navigate = useNavigate();
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
            className={`${location.pathname === '/' ? 'text-red-500 border-b-[1px] border-b-red-500' : 'text-primary'}`}
          >
            <Link to="/" className="p-1 subtitle-sm hover:text-secondary">
              Inicio
            </Link>
          </li>
          <p className="text-neutral2 cursor-default p-1 subtitle-sm">
            Noticias
          </p>
          <p className="text-neutral2 cursor-default p-1 subtitle-sm">Comité</p>{' '}
          <p className="text-neutral2 cursor-default p-1 subtitle-sm">
            Calendario
          </p>
        </>
      )}

      {userRole === 'olympian' && (
        <>
          <li
            className={`${location.pathname === '/olympian' ? 'text-secondary border-b-[1px] border-b-secondary' : 'text-primary'}`}
            ref={adminMenuRef}
          >
            <Link
              to="/olympian"
              className="p-1 subtitle-sm hover:text-secondary"
            >
              Guía de Registro
            </Link>
          </li>
          <li
            className={`${location.pathname === '/olympian/register-data-excel' ? 'text-secondary border-b-[1px] border-b-secondary' : 'text-primary'}`}
            ref={adminMenuRef}
          >
            <Link
              to="/olympian/register-data-excel"
              className="p-1 subtitle-sm hover:text-secondary"
            >
              Registro Excel
            </Link>
          </li>

          <DropdownMenu
            label="Registro Manual"
            options={[
              { label: 'Registro Tutor', path: '/olympian/register-tutor' },
              {
                label: 'Registro Olimpista',
                path: '/olympian/register-olympians',
              },
              {
                label: 'Registro de Áreas',
                path: '/olympian/register-selected-areas',
              },
            ]}
          />
          <DropdownMenu
            label="Orden y Comprobante"
            options={[
              {
                label: 'Generar Orden',
                path: '/olympian/generate-order-payment',
              },
              { label: 'Subir Comprobante', path: '/olympian/upload-payment' },
            ]}
          />

          <li
            className={`${location.pathname === '/olympian/registrations' ? 'text-secondary border-b-[1px] border-b-secondary' : 'text-primary'}`}
            ref={adminMenuRef}
          >
            <Link
              to="/olympian/registrations"
              className="p-1 subtitle-sm hover:text-secondary"
            >
              Inscripciones
            </Link>
          </li>
          <ButtonIcon
            icon={LogOutIcon}
            onClick={() => {
              navigate('/');
            }}
            variantColor="variant4"
          />
        </>
      )}

      {userRole === 'admin' && (
        <>
          <li
            className={`${location.pathname === '/administrator' ? 'text-secondary border-b-[1px] border-b-secondary' : 'text-primary'}`}
            ref={adminMenuRef}
          >
            <Link
              to="/administrator"
              className="p-1 subtitle-sm hover:text-secondary"
            >
              Inicio
            </Link>
          </li>
          <li
            className={`${location.pathname === '/administrator/register-info' ? 'text-secondary border-b-[1px] border-b-secondary' : 'text-primary'}`}
            ref={adminMenuRef}
          >
            <Link
              to="/administrator/register-info"
              className="p-1 subtitle-sm hover:text-secondary"
            >
              Registro General
            </Link>
          </li>
          <DropdownMenu
            label="Áreas y Niveles"
            options={[
              {
                label: 'Registro de Áreas',
                path: '/administrator/register-areas',
              },
              {
                label: 'Registro de Niveles',
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
            ]}
          />
          <li
            className={`${location.pathname === '/administrator/report-registered-olimpist' ? 'text-secondary border-b-[1px] border-b-secondary' : 'text-primary'}`}
            ref={adminMenuRef}
          >
            <Link
              to="/administrator/report-registered-olimpist"
              className="p-1 subtitle-sm hover:text-secondary"
            >
              Reportes
            </Link>
          </li>
          <ButtonIcon
            icon={LogOutIcon}
            onClick={() => {
              navigate('/');
            }}
            variantColor="variant4"
          />
        </>
      )}
    </ul>
  );
}
