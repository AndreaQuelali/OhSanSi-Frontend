import Logo from './assets/images/ohsansi.jpg';
export default function Navbar() {
  return (
    <nav className="relative sm:sticky sm:top-0 bg-surface h-20 flex items-center px-6 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <a href="/app" className="w-full h-full pt-2">
          <img src={Logo} alt="Logo" className="w-16 h-16" />
        </a>
        <ul className="hidden lg:flex items-center justify-end w-screen space-x-16 mr-16">
          <li>
            <a
              href="/postulante"
              className={`subtitle-sm p-1 ${
                location.pathname === '/postulante'
                  ? 'text-secondary border-b-[1px] border-b-secondary'
                  : 'text-primary hover:text-secondary'
              }`}
            >
              Postulante
            </a>
          </li>
          <li>
            <a
              href="/admi"
              className={`subtitle-sm p-1 ${
                location.pathname === '/admi'
                  ? 'text-secondary border-b-[1px] border-b-secondary'
                  : 'text-primary hover:text-secondary'
              }`}
            >
              Administrador
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
