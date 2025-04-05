import React, { useState } from 'react';
import { Button } from '@/components'; // Asegurate de que esta ruta sea correcta

interface TableRow {
  id: number;
  area: string;
}

type TableProps = {
  data: TableRow[];
};

export const TableAreas: React.FC<TableProps> = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // 3 columnas x 2 filas
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="w-full">
      {data.length === 0 ? (
        <div className="text-center text-neutral2 body-lg p-4">
          Aún no hay áreas registradas.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 border-y border-neutral overflow-hidden rounded-lg">
            {paginatedData.map((row) => (
              <div
                key={row.id}
                className="bg-white border-neutral p-4 text-onBack body-lg text-center"
              >
                {row.area}
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-10 flex-wrap gap-2">
              <Button
                label="Anterior"
                onClick={() => setCurrentPage((prev) => prev - 1)}
                disabled={currentPage === 1}
                variantColor={currentPage === 1 ? 'variantDesactivate' : 'variant2'}
              />

              {[...Array(totalPages)].map((_, i) => (
                <Button
                  key={i + 1}
                  label={`${i + 1}`}
                  onClick={() => setCurrentPage(i + 1)}
                  variantColor={currentPage === i + 1 ? 'variant1' : 'variant2'}
                />
              ))}

              <Button
                label="Siguiente"
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={currentPage === totalPages}
                variantColor={currentPage === totalPages ? 'variantDesactivate' : 'variant2'}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};
