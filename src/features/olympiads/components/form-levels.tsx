import { Button, Dropdown, InputText } from '../../../components';
import AddIcon from '../icons/add';

export default function FormLevels() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-col items-center justify-center flex-grow">
        <form className="max-w-9/12 mx-auto w-full">
          <h1 className="text-center text-primary mb-20 headline-lg">
            Registro de Niveles/Categorías de Olimpiada
          </h1>
          <div className="px-10 md:px-3 lg:px-0 flex flex-col md:flex-row justify-between mb-12">
            <Dropdown
              name="area"
              label="Área"
              placeholder="Seleccionar área"
              options={[{ id: 1, name: 'Option 1' }]}
              value={1}
              onChange={() => {}}
              displayKey={'1,2,3'}
              valueKey={'r,t,y'}
            />
            <InputText
              label="Nivel/Categoría"
              name="level"
              placeholder="Ingresar nivel/categoria"
              type="text"
            />
            <Dropdown
              name="gmin"
              label="Grado Min."
              placeholder="Seleccionar grado min"
              options={[{ id: 1, name: 'Option 1' }]}
              value={1}
              onChange={() => {}}
              displayKey={'1,2,3'}
              valueKey={'r,t,y'}
            />
            <Dropdown
              name="gmax"
              label="Grado Max."
              placeholder="Seleccionar grado max"
              options={[{ id: 1, name: 'Option 1' }]}
              value={1}
              onChange={() => {}}
              displayKey={'1,2,3'}
              valueKey={'r,t,y'}
            />
          </div>
          <Button label="Agregar" className="w-full " icon={AddIcon} />
        </form>
      </div>
    </div>
  );
}
