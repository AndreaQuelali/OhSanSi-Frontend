import { RegisterAreas, RegisterInfoPage } from '@/features';
import NavbarLayout from '@/layouts/navbar-layout';
import { BrowserRouter, Route, Routes } from 'react-router';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<NavbarLayout />}>
          <Route index element={<RegisterInfoPage />} />
          <Route path="/register-areas" element={<RegisterAreas />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
