import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { CardArea } from "./card-area";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

const areas = [
  { id: 1, name: "Matemáticas", image: "/images/matematicas.jpg", requiresCategory: true },
  { id: 2, name: "Ciencias", image: "/images/ciencias.jpg", requiresCategory: true },
  { id: 3, name: "Historia", image: "/images/historia.jpg", requiresCategory: false },
  { id: 4, name: "Arte", image: "/images/arte.jpg", requiresCategory: false },
];

export default function FormAreaPart() {
  const { setValue, watch, trigger } = useFormContext();
  const selectedAreas = watch("areas.selectedAreas", []);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);

  const openModal = (areaName: string) => {
    setSelectedArea(areaName);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    if (selectedArea) {
      // Si el área requiere categoría pero el usuario cancela, se deselecciona
      setValue(
        "areas.selectedAreas",
        selectedAreas.filter((name: string) => name !== selectedArea),
        { shouldValidate: true }
      );
    }
    setSelectedArea(null);
  };

  const confirmSelection = () => {
    setModalOpen(false);
  };

  const toggleArea = (areaName: string, requiresCategory: boolean) => {
    if (selectedAreas.includes(areaName)) {
      setValue(
        "areas.selectedAreas",
        selectedAreas.filter((name: string) => name !== areaName),
        { shouldValidate: true }
      );
    } else {
      setValue("areas.selectedAreas", [...selectedAreas, areaName], { shouldValidate: true });
      if (requiresCategory) openModal(areaName);
    }
    trigger("areas.selectedAreas");
  };

  return (
    <div className="flex flex-col my-6">
      <div className="max-w-9/12 mx-auto w-full">
        <h2 className="text-primary headline-md mb-6">Selección de Áreas</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {areas.map((area) => (
            <CardArea
              key={area.id}
              label={area.name}
              imageUrl={area.image}
              selected={selectedAreas.includes(area.name)}
              onClick={() => toggleArea(area.name, area.requiresCategory)}
            />
          ))}
        </div>
      </div>

      {modalOpen && selectedArea && (
        <Modal
          text={`Has seleccionado el área de ${selectedArea}. Confirmar niveles`}
          onClose={closeModal}
          onConfirm={confirmSelection}
        />
      )}
    </div>
  );
}
