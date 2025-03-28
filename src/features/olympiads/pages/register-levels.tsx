import FormLevels from '../components/form-levels';
import TableLevels from '../components/table-levels';

export const RegisterLevels = () => {
  return (
    <div className=" min-h-screen flex flex-col">
      <main className="flex-grow flex flex-col items-center justify-center">
        <FormLevels />
        <TableLevels />
      </main>
    </div>
  );
};
