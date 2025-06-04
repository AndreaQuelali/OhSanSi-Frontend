import { ButtonIcon } from '@/components';
import CloseIcon from '@/components/icons/close';

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export const SearchInput = ({
  value,
  onChange,
  placeholder = 'Buscar...',
}: Props) => {
  return (
    <div className="relative w-full mb-4">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2  body-lg placeholder-neutral border border-neutral rounded p-2 focus:outline-none focus:ring-1 focus:ring-primary pr-10"
      />
      {value && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          <ButtonIcon
            icon={CloseIcon}
            onClick={() => onChange('')}
            variantColor="variant3"
          />
        </div>
      )}
    </div>
  );
};
