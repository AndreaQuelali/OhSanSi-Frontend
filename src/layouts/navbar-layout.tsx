import { Link, Outlet } from 'react-router';
import IconUser from '@/components/icons/icon-user';
import FooterDesign from '@/components/ui/footer-design';

export default function NavbarLayout() {
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
                to="/postulante"
                className={`subtitle-sm p-1 ${
                  location.pathname === '/postulante'
                    ? 'text-secondary border-b-[1px] border-b-secondary'
                    : 'text-primary hover:text-secondary'
                }`}
              >
                Postulante
              </Link>
            </li>
            <li>
              <Link
                to="/admi"
                className={`subtitle-sm p-1 ${
                  location.pathname === '/admi'
                    ? 'text-secondary border-b-[1px] border-b-secondary'
                    : 'text-primary hover:text-secondary'
                }`}
              >
                Administrador
              </Link>
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
