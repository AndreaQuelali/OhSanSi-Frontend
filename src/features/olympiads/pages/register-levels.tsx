import { Button } from '@/components';
import FormLevels from '../components/form-levels';
import { Table } from '../components/table';

export const RegisterLevelsPage = () => {
  return (
    <div className="w-full">
      <main className="flex flex-col items-center justify-center w-full h-[75vh]">
        <FormLevels />
        <Table />
        <div className="max-w-9/12 mx-auto w-full flex justify-end gap-4">
          <Button label="Cancelar" variantColor="variant2" />
          <Button label="Registrar" />
        </div>
      </main>
    </div>
  );
};
