import { useState } from 'react';
import { InputText } from '@/components/ui/input';
import { Button, Dropdown } from '@/components';
import { useForm } from 'react-hook-form';
import IconClose from '@/components/icons/icon-close';

interface Nivel {
  id_nivel: number;
  nombre_nivel: string;
}

interface Area {
  id_area: number;
  nombre_area: string;
  niveles: Nivel[];
}

const areasSimuladas: Area[] = [
  {
    id_area: 1,
    nombre_area: 'Astronomía y Astrofísica',
    niveles: [
      { id_nivel: 1, nombre_nivel: 'tercero de primaria a 6to de secundaria' },
    ],
  },
  {
    id_area: 2,
    nombre_area: 'Informática',
    niveles: [
      { id_nivel: 2, nombre_nivel: 'Guacamayo' },
      { id_nivel: 3, nombre_nivel: 'Guacampe' },
    ],
  },
];

export default function ModalAddOlympist({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const {
    register,
    formState: { errors },
  } = useForm({ mode: 'onBlur' });
  const [selectedAreas, setSelectedAreas] = useState<number[]>([]);
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);
  const [selectedNiveles, setSelectedNiveles] = useState<Nivel[]>([]);

  const handleAreaClick = (area: Area) => {
    setSelectedArea(area);
  };

  const handleNivelToggle = (nivel: Nivel) => {
    setSelectedNiveles((prev) =>
      prev.some((n) => n.id_nivel === nivel.id_nivel)
        ? prev.filter((n) => n.id_nivel !== nivel.id_nivel)
        : [...prev, nivel],
    );
  };

  const handleConfirmNiveles = () => {
    if (selectedArea) {
      setSelectedAreas((prev) =>
        prev.includes(selectedArea.id_area)
          ? prev
          : [...prev, selectedArea.id_area],
      );
    }
    setSelectedArea(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-4xl p-6 relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-primary text-lg sm:text-xl md:text-2xl font-semibold">
            Agregar Olimpista
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition cursor-pointer"
          >
            <IconClose className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-col">
          <h3 className="text-primary text-lg font-semibold mb-2">
            Datos del Olimpista
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <InputText
              label="Número de cédula de identidad"
              name="olimpista.ci"
              placeholder="Ingresar número de cédula de identidad"
              className="w-full "
              register={register}
              validationRules={{
                required: 'El número de cédula es obligatorio',
                minLength: {
                  value: 4,
                  message: 'Debe tener al menos 4 dígitos',
                },
                maxLength: {
                  value: 8,
                  message: 'No puede tener más de 8 dígitos',
                },
                pattern: {
                  value: /^[0-9]+$/,
                  message: 'Solo se permiten números',
                },
              }}
              errors={errors}
            />
            <InputText
              label="Nombre(s)"
              name="olimpista.name"
              placeholder="Ingresar nombre(s)"
              className="w-full"
              register={register}
              validationRules={{
                required: 'El nombre es obligatorio',
                pattern: {
                  value:
                    /^(?! )[A-Za-zÑñÁÉÍÓÚáéíóú]+(?: [A-Za-zÑñÁÉÍÓÚáéíóú]+)*(?<! )$/,
                  message:
                    'Solo se permiten letras y un solo espacio entre palabras',
                },
              }}
              errors={errors}
            />
            <InputText
              label="Apellido(s)"
              name="olimpista.lastname"
              placeholder="Ingresa el apellido(s)"
              className="w-full"
              register={register}
              validationRules={{
                required: 'El apellido es obligatorio',
                pattern: {
                  value:
                    /^(?! )[A-Za-zÑñÁÉÍÓÚáéíóú]+(?: [A-Za-zÑñÁÉÍÓÚáéíóú]+)*(?<! )$/,
                  message:
                    'Solo se permiten letras y un solo espacio entre palabras',
                },
              }}
              errors={errors}
            />
            <InputText
              label="Correo electrónico"
              name="olimpista.email"
              placeholder="luciaquiroz@gmail.com"
              type="email"
              className="w-full"
              register={register}
              validationRules={{
                required: 'El correo electrónico es obligatorio',
                pattern: {
                  value:
                    /^(?!.*\.\.)(?!.*\.@)(?!^\.)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/,
                  message: 'Correo electrónico no válido',
                },
              }}
              errors={errors}
            />
            <InputText
              label="Fecha de nacimiento"
              name="olimpista.birthday"
              placeholder="DD/MM/AAAA"
              type="date"
              className="w-full"
              register={register}
              validationRules={{
                required: 'La fecha de nacimiento es obligatoria',
                validate: (value: string) => {
                  if (!value) return 'La fecha de nacimiento es obligatoria';
                  const today = new Date();
                  const birthDate = new Date(value);
                  const age = today.getFullYear() - birthDate.getFullYear();
                  const hasBirthdayPassed =
                    today.getMonth() > birthDate.getMonth() ||
                    (today.getMonth() === birthDate.getMonth() &&
                      today.getDate() >= birthDate.getDate());
                  const exactAge = hasBirthdayPassed ? age : age - 1;
                  return (
                    (exactAge >= 6 && exactAge <= 20) ||
                    'Debe tener entre 6 y 20 años'
                  );
                },
              }}
              errors={errors}
            />
          </div>
        </div>
        <h3 className="text-primary text-lg font-semibold">Datos Académicos</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Dropdown
            label="Departamento"
            name="olimpista.dep"
            placeholder="Seleccionar departamento"
            className="w-full"
            options={[]}
            displayKey="name"
            valueKey="id"
            register={register}
            errors={errors}
            validationRules={{
              required: 'El departamento es obligatorio',
            }}
          />
          <Dropdown
            label="Provincia"
            placeholder="Seleccionar provincia"
            className="w-full"
            options={[]}
            displayKey="name"
            valueKey="id"
            register={register}
            name="olimpista.prov"
            errors={errors}
            validationRules={{
              required: 'La provincia es obligatoria',
            }}
          />
          <Dropdown
            label="Unidad Educativa"
            placeholder="Seleccionar unidad educativa"
            className="w-full"
            name="olimpista.unidadEducativa"
            validationRules={{
              required: 'La unidad educativa es obligatoria',
            }}
            options={[]}
            displayKey="name"
            valueKey="id"
            register={register}
            errors={errors}
          />
          <Dropdown
            label="Grado"
            placeholder="Seleccionar grado"
            className="w-full"
            name="olimpista.grado"
            options={[]}
            displayKey="name"
            valueKey="id"
            register={register}
            errors={errors}
          />
        </div>
        {/* Áreas Disponibles */}
        <h3 className="text-primary text-lg font-semibold mb-2">
          Áreas Disponibles
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {areasSimuladas.map((area) => (
            <button
              key={area.id_area}
              onClick={() => handleAreaClick(area)}
              className={`p-4 border rounded-lg ${
                selectedAreas.includes(area.id_area)
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-primary'
              }`}
            >
              {area.nombre_area}
            </button>
          ))}
        </div>
        {selectedArea && (
          <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-md p-6 relative">
              <h3 className="text-primary text-lg font-semibold mb-4">
                Seleccionar Niveles - {selectedArea.nombre_area}
              </h3>
              <div className="flex flex-col gap-2 mb-4">
                {selectedArea.niveles.map((nivel) => (
                  <label
                    key={nivel.id_nivel}
                    className="flex items-center gap-2"
                  >
                    <input
                      type="checkbox"
                      checked={selectedNiveles.some(
                        (n) => n.id_nivel === nivel.id_nivel,
                      )}
                      onChange={() => handleNivelToggle(nivel)}
                    />
                    {nivel.nombre_nivel}
                  </label>
                ))}
              </div>
              <div className="flex justify-end gap-4">
                <Button
                  label="Cancelar"
                  onClick={() => setSelectedArea(null)}
                  variantColor="variant2"
                  className="py-2 px-4"
                />
                <Button
                  label="Confirmar"
                  onClick={handleConfirmNiveles}
                  variantColor="variant1"
                  className="py-2 px-4"
                />
              </div>
            </div>
          </div>
        )}
        <div className="flex justify-end gap-4">
          <Button
            label="Cancelar"
            onClick={onClose}
            variantColor="variant2"
            className="py-2 px-4"
          />
          <Button
            label="Agregar"
            onClick={() => alert('Olimpista agregado')}
            variantColor="variant1"
            className="py-2 px-4"
          />
        </div>
      </div>
    </div>
  );
}
