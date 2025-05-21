import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router';
import { RegisterInfoPage } from './register-info';

describe('RegisterInfoPage', () => {
  it('debería renderizar el formulario correctamente', () => {
    render(
      <MemoryRouter>
        <RegisterInfoPage />
      </MemoryRouter>,
    );

    const title = screen.getByText(
      'Registro de Información General de la Olimpiada',
    );
    expect(title).toBeInTheDocument();

    const yearDropdown = screen.getByRole('combobox');
    expect(yearDropdown).toBeInTheDocument();

    const submitButton = screen.getByRole('button', { name: /registrar/i });
    expect(submitButton).toBeInTheDocument();
  });

});
