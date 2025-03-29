import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import DeleteIcon from '../icons/delete';
import { ButtonIcon } from '../../../components/buttons/button-icon';
import { Button } from '../../../components';

interface Table {
  id: number;
  area: string;
  level: string;
  grade: string;
}

interface Column {
  name: string;
  selector?: (row: Table) => string;
  sortable?: boolean;
  cell?: (row: Table) => React.ReactNode;
}

export const Table: React.FC = () => {
  const [rows, setRows] = useState<Table[]>([
    {
      id: 1,
      area: 'Matemática',
      level: 'Guacamayo',
      grade: '5to de secundaria a 6to de secundaria',
    },
    {
      id: 2,
      area: 'Matemática',
      level: '2S',
      grade: '3ro de primaria a 6to de primaria',
    },
  ]);

  const deleteRow = (id: number) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const columns: Column[] = [
    {
      name: 'Área',
      selector: (row: Table) => row.area,
      sortable: true,
      cell: (row) => <span className="text-onBack body-lg">{row.area}</span>,
    },
    {
      name: 'Nivel/Categoría',
      selector: (row: Table) => row.level,
      sortable: true,
      cell: (row) => <span className="text-onBack body-lg">{row.level}</span>,
    },
    {
      name: 'Grados',
      selector: (row: Table) => row.grade,
      sortable: true,
      cell: (row) => <span className="text-onBack body-lg">{row.grade}</span>,
    },
    {
      name: '',
      cell: (row: Table) => (
        <ButtonIcon
          icon={DeleteIcon}
          onClick={() => deleteRow(row.id)}
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
    <div className="w-full flex items-center justify-center my-6">
      <div className=" w-9/12">
        <div className="flex justify-between">
          <h2 className="text-primary subtitle-md">
            Niveles/Categorías agregadas
          </h2>
          <Button label="Ver todo" variantColor="variant2" />
        </div>

        <DataTable
          title=""
          columns={columns}
          data={rows}
          responsive
          highlightOnHover
          customStyles={customStyles}
          className='rounded-lg text-center'
        />
      </div>
    </div>
  );
};
