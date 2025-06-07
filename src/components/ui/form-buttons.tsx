import { Button } from '@/components';

interface FormButtonsProps {
  formIsValid: boolean;
  onCancel?: () => void;
}

export default function FormButtons({
  formIsValid,
  onCancel,
}: FormButtonsProps) {
  return (
    <div className="flex flex-col-reverse md:flex-row md:justify-end md:space-x-5 mb-28">
      <Button
        label="Cancelar"
        variantColor="variant2"
        className="mt-5 md:mt-0"
        onClick={onCancel || (() => (window.location.href = '/olympian'))}
      />
      <Button
        type="submit"
        label="Registrar"
        disabled={!formIsValid}
        variantColor={!formIsValid ? 'variantDesactivate' : 'variant1'}
      />
    </div>
  );
}
