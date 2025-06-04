import { Link, useLocation } from 'react-router';
import { useState, useRef, useEffect } from 'react';
import IconDown from '../icons/icon-down';

type DropdownMenuProps = {
  label: string;
  options: { label: string; path: string }[];
};

export default function DropdownMenu({ label, options }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const menuRef = useRef<HTMLLIElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <li ref={menuRef} className="relative" onClick={() => setIsOpen(!isOpen)}>
      <span
        className={`subtitle-sm p-1 cursor-pointer ${
          options.some((option) => location.pathname.startsWith(option.path))
            ? 'text-red-500 border-b-[1px] border-b-red-500'
            : 'text-primary hover:text-secondary'
        }`}
      >
        {label}
        <IconDown
          className={`w-4 h-4 inline-block ml-1 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
        />
      </span>
      {isOpen && (
        <ul className="absolute top-full left-0 bg-white shadow-lg rounded-md mt-2 w-40">
          {options.map((option, index) => (
            <li
              key={index}
              className={`hover:bg-gray-100 ${
                location.pathname === option.path
                  ? 'text-red-500'
                  : 'text-primary'
              }`}
            >
              <Link
                to={option.path}
                className="block px-4 py-2 text-sm hover:text-secondary"
              >
                {option.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
