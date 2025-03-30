import { Dropdown, InputText } from '../../../components';
export default function FormDataPart() {
  return (
    <div className="flex flex-col my-6">
      <div className="flex flex-col flex-grow">
        <form className="max-w-9/12 mx-auto w-full px-0 sm:px-6 md:px-0 lg:px-0">
          <h2 className="text-primary text-lg sm:text-xl md:text-2xl font-semibold mb-6 text-center sm:text-left">
            Registro de Datos de Olimpista
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <InputText
              label="Nombre(s)"
              name="name"
              placeholder="Lucia Damaris"
              className="w-full"
            />
            <InputText
              label="Apellido(s)"
              name="lastname"
              placeholder="Quiroz Lopez"
              className="w-full"
            />
            <InputText
              label="Número de cédula"
              name="ci"
              placeholder="1234567"
              className="w-full"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <InputText
              label="Correo electrónico"
              name="email"
              placeholder="lucia@gmail.com"
              type="email"
              className="w-full"
            />
            <InputText
              label="Número de celular"
              name="phone"
              placeholder="77777777"
              className="w-full"
            />
            <InputText
              label="Fecha de nacimiento"
              name="birthdate"
              placeholder="DD/MM/AAAA"
              type="date"
              className="w-full"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
            <div className="sm:col-span-3">
              <Dropdown
                label="Unidad educativa"
                name="school"
                placeholder="Seleccionar unidad educativa"
                className="w-full"
              />
            </div>
            <div className="sm:col-span-1">
              <Dropdown
                label="Grado"
                name="grade"
                placeholder="Seleccionar grado"
                className="w-full"
              />
            </div>
          </div>
          
          {/* Cuarta fila - 2 campos (mitad y mitad) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Dropdown
              label="Departamento"
              name="depa"
              placeholder="Seleccionar departamento"
              className="w-full"
            />
            <Dropdown
              label="Provincia"
              name="prov"
              placeholder="Seleccionar provincia"
              className="w-full"
            />
          </div>
        </form>
      </div>
    </div>
  );
}