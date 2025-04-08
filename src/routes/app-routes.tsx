import {
  RegisterAreas,
  RegisterInfoPage,
  RegisterLevelsPage,
} from '@/features';
import { Home } from '@/features/olympiads/pages/home';
import RegisterParticipant from '@/features/participants/pages/register-participant';
import { RegisterTutorPage } from '@/features/participants/pages/register-tutor';
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
            path="register-applicants"
            index
            element={<RegisterTutorPage />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
