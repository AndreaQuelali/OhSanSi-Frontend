import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
import NavbarLayout from '@/layouts/navbar-layout';
import {
  Home,
  RegisterInfoPage,
  RegisterAreas,
  RegisterLevelsPage,
  RegisterLevelsGradesPage,
  RegisterLevelsAreaPage,
  ReportRegisterOliPage,
  RegisterParticipantPage,
  RegisterTutorPage,
  RegisterSelectedAreasPage,
  RegisterDataExcel,
  RegistrationsPage,
  GenerateOrderPaymentPage,
  UploadPaymentPage,
  RegistrationGuard,
  PageLoader,
  FormLoader,
} from './lazy-components';

const Presentation = lazy(() =>
  import('@/features/olympiads/pages/presentation').then((module) => ({
    default: module.Presentation,
  })),
);

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<NavbarLayout />}>
            <Route index element={<Home />} />
            <Route path="/presentation" element={<Presentation />} />
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
                <Suspense fallback={<FormLoader />}>
                  <RegistrationGuard>
                    <RegisterParticipantPage />
                  </RegistrationGuard>
                </Suspense>
              }
            />
            <Route
              path="/register-tutor"
              element={
                <Suspense fallback={<FormLoader />}>
                  <RegistrationGuard>
                    <RegisterTutorPage />
                  </RegistrationGuard>
                </Suspense>
              }
            />
            <Route
              path="/register-selected-areas"
              element={
                <Suspense fallback={<FormLoader />}>
                  <RegistrationGuard>
                    <RegisterSelectedAreasPage />
                  </RegistrationGuard>
                </Suspense>
              }
            />
            <Route
              path="/register-data-excel"
              element={
                <Suspense fallback={<FormLoader />}>
                  <RegistrationGuard>
                    <RegisterDataExcel />
                  </RegistrationGuard>
                </Suspense>
              }
            />
            <Route
              path="/registrations"
              element={
                <Suspense fallback={<PageLoader />}>
                  <RegistrationGuard>
                    <RegistrationsPage />
                  </RegistrationGuard>
                </Suspense>
              }
            />
            <Route
              path="/generate-order-payment"
              element={
                <Suspense fallback={<PageLoader />}>
                  <RegistrationGuard>
                    <GenerateOrderPaymentPage />
                  </RegistrationGuard>
                </Suspense>
              }
            />
            <Route
              path="/upload-payment"
              element={
                <Suspense fallback={<PageLoader />}>
                  <RegistrationGuard>
                    <UploadPaymentPage />
                  </RegistrationGuard>
                </Suspense>
              }
            />
            <Route
              path="/report-registered-olimpist"
              element={<ReportRegisterOliPage />}
            />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
