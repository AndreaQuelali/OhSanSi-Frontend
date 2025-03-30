import React from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import DeleteIcon from '../icons/delete';
import { ButtonIcon } from '../../../components';

interface TableAreas {
  id: number;
  area: string;
}

type TableRow = {
  id: number;
  area: string;
};

type TableProps = {
  data: TableRow[]; // Recibe los datos de la tabla desde FormLevels
  onDeleteRow: (id: number) => void; // Función para eliminar una fila
};

export const TableAreas: React.FC<TableProps> = ({ data, onDeleteRow }) => {
  const columns: TableColumn<TableRow>[] = [
    {
      name: 'Área',
      selector: (row: TableRow) => row.area,
      sortable: true,
      cell: (row) => <span className="text-onBack body-lg">{row.area}</span>,
    },
    {
      name: '',
      cell: (row: TableRow) => (
        <ButtonIcon
          icon={DeleteIcon}
          onClick={() => onDeleteRow(row.id)} // Llamamos la función para eliminar
          variantColor="variant2"
        />
      ),
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
    <div className="w-full flex items-center justify-center">
      <div className="w-full">
        <div className="flex justify-between">
          <h2 className="text-primary subtitle-md">
            Áreas agregadas
          </h2>
        </div>
        <div className="max-h-[110px] overflow-y-auto">
          <DataTable
            title=""
            columns={columns}
            data={data} // Ahora usa los datos pasados por prop
            responsive
            highlightOnHover
            customStyles={customStyles}
          />
        </div>
      </div>
    </div>
  );
};
