import {
  RegisterAreas,
  RegisterInfoPage,
  RegisterLevelsPage,
} from '@/features';
import { Home } from '@/features/olympiads/pages/home';

import { RegisterLevelsAreaPage } from '@/features/olympiads/pages/register-levels-area';
import { RegisterLevelsGradesPage } from '@/features/olympiads/pages/register-levels-grades';
import RegisterDataExcel from '@/features/participants/pages/register-data-excel';
import RegisterParticipantPage from '@/features/participants/pages/register-participant';
import RegisterSelectedAreasPage from '@/features/participants/pages/register-selected-areas';
import RegisterTutorPage from '@/features/participants/pages/register-tutor';
import GenerateOrderPaymentPage from '@/features/registrations/pages/generate-payment-order-page';
import RegistrationsPage from '@/features/registrations/pages/registrations';
import UploadPaymentPage from '@/features/registrations/pages/upload-payment';
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
            path="/register-levels-grades"
            element={<RegisterLevelsGradesPage />}
          />
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
          <Route path="/registrations" element={<RegistrationsPage />} />
          <Route
            path="/generate-order-payment"
            element={<GenerateOrderPaymentPage />}
          />
          <Route path="/upload-payment" element={<UploadPaymentPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
