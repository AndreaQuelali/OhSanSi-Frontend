import React, { useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { Button } from '@/components';

interface TableRow {
  id: number;
  area: string;
  level: string;
  grade: string;
}

type TableProps = {
  data: TableRow[];
};

export const Table: React.FC<TableProps> = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

  const columns: TableColumn<TableRow>[] = [
    {
      name: 'Área',
      selector: (row) => row.area,
      sortable: true,
      cell: (row) => <span className="text-onBack body-lg">{row.area}</span>,
    },
    {
      name: 'Nivel/Categoría',
      selector: (row) => row.level,
      sortable: true,
      cell: (row) => <span className="text-onBack body-lg">{row.level}</span>,
    },
    {
      name: 'Grados',
      selector: (row) => row.grade,
      sortable: true,
      cell: (row) => <span className="text-onBack body-lg">{row.grade}</span>,
    },
  ];

  const customStyles = {
    headCells: {
      style: {
        fontFamily: 'Lato, sans-serif',
        fontSize: '16px',
        fontWeight: '500',
        color: '#0e1217',
      },
    },
  };

  return (
    <div className="w-full flex flex-col items-center justify-center my-6">
      {data.length === 0 ? (
        <span className="text-neutral2 body-lg">
          No hay niveles o categorías registradas en áreas
        </span>
      ) : (
        <>
          <div className="w-full">
            <DataTable
              title=""
              columns={columns}
              data={paginatedData}
              responsive
              highlightOnHover
              customStyles={customStyles}
              noHeader
            />
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-10 flex-wrap gap-2">
              <Button
                label="Anterior"
                onClick={() => setCurrentPage((prev) => prev - 1)}
                disabled={currentPage === 1}
                variantColor={
                  currentPage === 1 ? 'variantDesactivate' : 'variant2'
                }
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
                variantColor={
                  currentPage === totalPages ? 'variantDesactivate' : 'variant2'
                }
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};
