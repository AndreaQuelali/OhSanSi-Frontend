import React, { useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { CustomPagination } from '@/components/ui/custom-pagination';
import AddIcon from '@/components/icons/icon-add';
import IconDelete from '@/components/icons/icon-delete';
import { Button } from '@/components';
import ModalAddOlympist from './modal-add-olympist';

interface OlympianRow {
  id: number;
  ci: string;
  nombres: string;
  apellidos: string;
  departamento: string;
  provincia: string;
  unidadEducativa: string;
  area: string;
  categoria: string;
  ciTutor?: string;
}

const simulatedData: OlympianRow[] = [
  {
    id: 1,
    ci: '8392012',
    nombres: 'Andres Lucas',
    apellidos: 'Quiroz Mamani',
    departamento: 'Cochabamba',
    provincia: 'Cercado',
    unidadEducativa: 'San Agustín',
    ciTutor: '56234467',
    area: 'Matemáticas',
    categoria: '2S',
  },
  {
    id: 2,
    ci: '8392012',
    nombres: 'Andres Lucas',
    apellidos: 'Quiroz Mamani',
    departamento: 'Cochabamba',
    provincia: 'Cercado',
    unidadEducativa: 'San Agustín',
    ciTutor: '56234467',
    area: 'Matemáticas',
    categoria: 'Guacamayo',
  },
  {
    id: 3,
    ci: '8392012',
    nombres: 'Andres Lucas',
    apellidos: 'Quiroz Mamani',
    departamento: 'Cochabamba',
    provincia: 'Cercado',
    unidadEducativa: 'San Agustín',
    ciTutor: '56234467',
    area: 'Biología',
    categoria: 'Londra',
  },
  {
    id: 4,
    ci: '8392012',
    nombres: 'Andres Lucas',
    apellidos: 'Quiroz Mamani',
    departamento: 'Cochabamba',
    provincia: 'Cercado',
    unidadEducativa: 'San Agustín',
    ciTutor: '56234467',
    area: 'Matemáticas',
    categoria: 'Guacamayo',
  },
  {
    id: 5,
    ci: '8392012',
    nombres: 'Andres Lucas',
    apellidos: 'Quiroz Mamani',
    departamento: 'Cochabamba',
    provincia: 'Cercado',
    unidadEducativa: 'San Agustín',
    ciTutor: '56234467',
    area: 'Matemáticas',
    categoria: 'Guacamayo',
  },
];

const TableOlympians: React.FC<{ tutor: boolean }> = ({ tutor }) => {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 3;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAdd = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleRowSelect = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id],
    );
  };

  const handleDelete = () => {
    alert(`Eliminar filas con IDs: ${selectedRows.join(', ')}`);
  };

  const handleCancel = () => {
    alert('Acción cancelada');
  };

  const handleRegister = () => {
    alert('Formulario registrado');
  };

  const paginatedData = simulatedData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  const columns: TableColumn<OlympianRow>[] = [
    {
      name: '',
      cell: (row) => (
        <input
          type="checkbox"
          checked={selectedRows.includes(row.id)}
          onChange={() => handleRowSelect(row.id)}
        />
      ),
      width: '50px',
    },
    {
      name: 'CI Olimpista',
      selector: (row) => row.ci,
      sortable: true,
    },
    {
      name: 'Nombres',
      selector: (row) => row.nombres,
      sortable: true,
    },
    {
      name: 'Apellidos',
      selector: (row) => row.apellidos,
      sortable: true,
    },
    {
      name: 'Departamento',
      selector: (row) => row.departamento,
      sortable: true,
    },
    {
      name: 'Provincia',
      selector: (row) => row.provincia,
      sortable: true,
    },
    {
      name: 'U.E.',
      selector: (row) => row.unidadEducativa,
      sortable: true,
    },
    {
      name: 'CI Tutor',
      selector: (row) => row.ciTutor,
      sortable: true,
    },
    {
      name: 'Área',
      selector: (row) => row.area,
      sortable: true,
    },
    {
      name: 'Nivel/Categoría',
      selector: (row) => row.categoria,
      sortable: true,
    },
    ...(tutor
      ? [
          {
            name: 'CI Tutor',
            selector: (row: OlympianRow) => row.ciTutor || '',
            sortable: true,
          },
        ]
      : []),
  ];
  return (
    <div className="w-full flex flex-col items-center justify-center my-6">
      <DataTable
        columns={columns}
        data={paginatedData}
        customStyles={{
          headCells: {
            style: {
              fontFamily: 'Lato, sans-serif',
              fontSize: '16px',
              fontWeight: '500',
              color: '#0e1217',
            },
          },
        }}
        noHeader
        highlightOnHover
        responsive
      />
      <div className="flex justify-between items-center w-full mt-4">
        <div className="flex-1 flex justify-center">
          <CustomPagination
            currentPage={currentPage}
            onChangePage={setCurrentPage}
            rowsPerPage={rowsPerPage}
            rowCount={simulatedData.length}
            onChangeRowsPerPage={(newRowsPerPage) => {
              console.log(`Rows per page changed to: ${newRowsPerPage}`);
            }}
          />
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleAdd}
            className="bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-secondary2 transition duration-300 ease-in-out"
          >
            <AddIcon className="w-5 h-5" />
          </button>
          <button
            onClick={handleDelete}
            className="bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-secondary2 transition duration-300 ease-in-out"
            disabled={selectedRows.length === 0}
          >
            <IconDelete className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="flex justify-end gap-4 mt-8 w-full">
        <Button
          label="Cancelar"
          onClick={handleCancel}
          variantColor="variant2"
          className="py-2 px-8"
        />
        <Button
          label="Registrar"
          onClick={handleRegister}
          variantColor="variant1"
          className="py-2 px-8"
        />
      </div>
      <ModalAddOlympist
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        tutor={tutor}
      />
    </div>
  );
};

export default TableOlympians;
