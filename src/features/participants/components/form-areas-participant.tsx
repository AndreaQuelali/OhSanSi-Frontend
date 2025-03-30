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
      <div className="max-w-9/12 mx-auto w-full px-0 sm:px-6 md:px-0">
        <h2 className="text-primary text-lg sm:text-xl md:text-2xl font-semibold mb-6 text-center sm:text-left">
          Selección de Áreas
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {areas.map((area) => (
            <CardArea 
              key={area.id}
              label={area.name} 
              imageUrl={area.image} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}