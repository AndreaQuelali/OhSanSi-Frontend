import { Button, Dropdown, InputText } from '../../../components';
import AddIcon from '../icons/add';

export default function FormLevels() {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col items-center justify-center flex-grow">
        <form className="max-w-9/12 mx-auto w-full">
          <h1 className="text-center text-primary mb-10 headline-lg">
            Registro de Niveles/Categorías de Olimpiada
          </h1>
          <div className="px-10 md:px-3 lg:px-0 flex flex-col md:flex-row mb-12 justify-center items-center gap-3">
            <Dropdown
              name="area"
              label="Área"
              placeholder="Seleccionar área"
              className="w-[340px]"
              options={[{ id: 1, name: 'Option 1' }]}
              value={1}
              onChange={() => {}}
              displayKey={'1,2,3'}
              valueKey={'r,t,y'}
            />
            <InputText
              label="Nivel/Categoría"
              className="w-[340px]"
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
