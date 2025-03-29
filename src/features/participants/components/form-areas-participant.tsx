import { CardArea } from './card-area';

const areas = [
  { id: 1, name: 'Matemáticas', image: '/images/matematicas.jpg' },
  { id: 2, name: 'Ciencias', image: '/images/ciencias.jpg' },
  { id: 3, name: 'Historia', image: '/images/historia.jpg' },
  { id: 4, name: 'Arte', image: '/images/arte.jpg' },
];

export default function FormAreaPart() {
  return (
    <div className="flex flex-col my-6">
      <div className="max-w-9/12 mx-auto w-full">
        <h2 className="text-primary headline-md mb-6">Selección de Áreas</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {areas.map((area) => (
            <CardArea label={area.name} imageUrl={area.image} />
          ))}
        </div>
      </div>
    </div>
  );
}
