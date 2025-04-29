import {
  RegisterAreas,
  RegisterInfoPage,
  RegisterLevelsPage,
} from '@/features';
import { Home } from '@/features/olympiads/pages/home';
import { RegisterLevelsAreaPage } from '@/features/olympiads/pages/register-levels-area';
import RegisterListOlympistOneTutor from '@/features/olympians-with-tutor/pages/register-list-olympist-one-tutor';
import RegisterListPartTutors from '@/features/olympians-with-tutor/pages/register-list-participants-tutors';
import RegisterDataExcel from '@/features/participants/pages/register-data-excel';
import RegisterParticipantPage from '@/features/participants/pages/register-participant';
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
            path="/register-levels-area"
            element={<RegisterLevelsAreaPage />}
          />
          <Route
            path="/register-olimpists"
            element={<RegisterParticipantPage />}
          />
          <Route path="/register-tutor" element={<RegisterTutorPage />} />
          <Route
            path="/register-selected-areas"
            element={<RegisterSelectedAreasPage />}
          />
          <Route path="/register-data-excel" element={<RegisterDataExcel />} />
          <Route
            path="/register-list-one-tutor"
            element={<RegisterListOlympistOneTutor />}
          />
          <Route
            path="/register-list-tutors"
            element={<RegisterListPartTutors />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
