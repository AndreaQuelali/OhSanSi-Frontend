import {
  RegisterAreas,
  RegisterInfoPage,
  RegisterLevelsPage,
} from '@/features';
import { Home } from '@/features/olympiads/pages/home';
import RegisterOlympistPage from '@/features/participants/pages/register-olympist';
import RegisterSelectedAreasPage from '@/features/participants/pages/register-selected-areas';
import RegisterTutorPage from '@/features/participants/pages/register-tutor';
import NavbarLayout from '@/layouts/navbar-layout';
import { BrowserRouter, Route, Routes } from 'react-router';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<NavbarLayout />}>
          <Route index element={<Home />} />
          <Route path="/register-info" element={<RegisterInfoPage />} />
          <Route path="/register-areas" element={<RegisterAreas />} />
          <Route path="/register-levels" element={<RegisterLevelsPage />} />
          <Route
            path="/register-olimpists"
            element={<RegisterOlympistPage />}
          />
          <Route path="/register-tutor" element={<RegisterTutorPage />} />
          <Route
            path="/register-selected-areas"
            element={<RegisterSelectedAreasPage />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
