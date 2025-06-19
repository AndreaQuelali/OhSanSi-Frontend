import React from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { CustomPagination } from '@/components';
import { OlympianRow, TableProps } from '../../interfaces/form-data-excel';

const columns: TableColumn<OlympianRow>[] = [
  { name: 'Nombre(s)', selector: (row) => row.Name, sortable: true },
  { name: 'Apellido(s)', selector: (row) => row.Lastname, sortable: true },
  { name: 'CI Olimpista', selector: (row) => row.CIOlympian, sortable: true },
  {
    name: 'Fecha de Nacimiento',
    selector: (row) => row.Birthdate,
    sortable: true,
  },
  {
    name: 'Correo electrónico',
    selector: (row) => row.Email,
    sortable: true,
  },
  { name: 'Departamento', selector: (row) => row.Department, sortable: true },
  { name: 'Provincia', selector: (row) => row.Province, sortable: true },
  {
    name: 'Unidad Educativa',
    selector: (row) => row.School,
    sortable: true,
  },
  { name: 'Grado', selector: (row) => row.Grade, sortable: true },
  {
    name: 'Nombre(s) tutor legal',
    selector: (row) => row.NamesTutorLegal,
    sortable: true,
  },
  {
    name: 'Apellido(s) tutor legal',
    selector: (row) => row.LastnamesTutorLegal,
    sortable: true,
  },
  {
    name: 'CI tutor legal',
    selector: (row) => row.CITutorLegal,
    sortable: true,
  },
  {
    name: 'Celular tutor legal',
    selector: (row) => row.PhoneTutorLegal,
    sortable: true,
  },
  {
    name: 'Correo electrónico tutor legal',
    selector: (row) => row.EmailTutorLegal,
    sortable: true,
  },
  { name: 'Área', selector: (row) => row.Area, sortable: true },
  {
    name: 'Nivel/Categoría',
    selector: (row) => row.Level,
    sortable: true,
  },
  {
    name: 'Nombre(s) profesor',
    selector: (row) => row.NamesTeacher,
    sortable: true,
  },
  {
    name: 'Apellido(s) profesor',
    selector: (row) => row.LastNamesTeacher,
    sortable: true,
  },
  { name: 'CI profesor', selector: (row) => row.CITeacher, sortable: true },
  {
    name: 'Celular profesor',
    selector: (row) => row.PhoneTeacher,
    sortable: true,
  },
  {
    name: 'Correo electrónico profesor',
    selector: (row) => row.EmailTeacher,
    sortable: true,
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

export const TableOlympians: React.FC<TableProps> = ({ data }) => {
  return (
    <div className="w-full overflow-x-auto">
      {data.length === 0 ? (
        <div className="text-center text-neutral2 body-lg p-4">
          No hay datos cargados.
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={data}
          pagination
          paginationPerPage={10}
          paginationComponent={CustomPagination}
          customStyles={customStyles}
          noHeader
          responsive
          highlightOnHover
        />
      )}
    </div>
  );
};
