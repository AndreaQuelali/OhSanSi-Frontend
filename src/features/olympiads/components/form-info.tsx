import { Button, Dropdown, InputText } from '@/components';

export default function FormInfo() {
  return (
    <div className="flex items-center justify-center w-full h-[85vh]">
      <div className="flex flex-col items-center justify-center flex-grow w-full max-w-6xl px-4 py-10 gap-8">
        <form className="w-full">
          <h1 className="text-center text-primary mb-20 headline-lg">
            Registro de Información General de la Olimpiada
          </h1>
          <div className="px-10 md:px-3 lg:px-0 flex flex-col md:flex-row justify-between mb-12">
            <Dropdown
              name="year"
              label="Año/Gestión"
              placeholder="Seleccionar año o gestión"
              className="w-[500px]"
              options={[{ id: 1, name: 'Option 1' }]}
              value={1}
              onChange={() => {}}
              displayKey={'1,2,3'}
              valueKey={'r,t,y'}
            />
            <InputText
              label="Costo de Inscripción"
              name="cost"
              placeholder="0.00"
              type="number"
              className="w-[500px]"
            />
          </div>

          <div className="px-10 md:px-3 lg:px-0 flex flex-col md:flex-row justify-between">
            <InputText
              label="Fecha de Inicio"
              name="dateIni"
              placeholder="DD/MM/YY"
              type="date"
              className="w-[500px]"
            />
            <InputText
              label="Fecha de Cierre"
              name="dateEnd"
              placeholder="DD/MM/YY"
              type="date"
              className="w-[500px]"
            />
          </div>
        </form>
        <div className="flex w-full justify-center mt-10">
          <div className="flex w-full justify-end gap-4">
            <Button label="Cancelar" variantColor="variant2" />
            <Button label="Registrar" />
          </div>
        </div>
      </div>
    </div>
  );
}
