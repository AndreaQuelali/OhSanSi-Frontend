import { Button, Dropdown, InputText } from '@/components';

export default function FormInfo() {
  return (
    <div className="flex items-center justify-center w-full py-10">
      <div className="flex flex-col items-center justify-center w-full max-w-6xl px-10 gap-8">
        <form className="w-full">
          <h1 className="text-center text-primary mb-20 headline-lg">
            Registro de Información General de la Olimpiada
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 md:px-0 mb-12">
            <Dropdown
              name="year"
              label="Año/Gestión"
              placeholder="Seleccionar año o gestión"
              className="w-full"
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
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 md:px-0">
            <InputText
              label="Fecha de Inicio"
              name="dateIni"
              placeholder="DD/MM/YY"
              type="date"
              className="w-full"
            />
            <InputText
              label="Fecha de Cierre"
              name="dateEnd"
              placeholder="DD/MM/YY"
              type="date"
              className="w-full"
            />
          </div>
        </form>
        <div className="flex w-full justify-center mt-10">
          <div className="flex w-full flex-col sm:flex-row flex-wrap justify-center sm:justify-center md:justify-end gap-4">
            <Button label="Registrar" variantColor="variant1" className="w-full sm:w-auto" />
            <Button label="Cancelar" variantColor="variant2" className="w-full sm:w-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}
