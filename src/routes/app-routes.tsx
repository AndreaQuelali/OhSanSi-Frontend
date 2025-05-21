import RegistrationGuard from '@/components/guards/registration-guard';
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
import { ReportRegisterOliPage } from '@/features/reports-admi/report-registerered-olimpist';
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
            element={
              <RegistrationGuard>
                <RegisterParticipantPage />
              </RegistrationGuard>
            }
          />
          <Route
            path="/register-tutor"
            element={
              <RegistrationGuard>
                <RegisterTutorPage />
              </RegistrationGuard>
            }
          />
          <Route
            path="/register-selected-areas"
            element={
              <RegistrationGuard>
                <RegisterSelectedAreasPage />
              </RegistrationGuard>
            }
          />
          <Route
            path="/register-data-excel"
            element={
              <RegistrationGuard>
                <RegisterDataExcel />
              </RegistrationGuard>
            }
          />
          <Route
            path="/registrations"
            element={
              <RegistrationGuard>
                <RegistrationsPage />
              </RegistrationGuard>
            }
          />
          <Route
            path="/generate-order-payment"
            element={
              <RegistrationGuard>
                <GenerateOrderPaymentPage />
              </RegistrationGuard>
            }
          />
          <Route
            path="/upload-payment"
            element={
              <RegistrationGuard>
                <UploadPaymentPage />
              </RegistrationGuard>
            }
          />
          <Route
            path="/report-registered-olimpist"
            element={<ReportRegisterOliPage />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
