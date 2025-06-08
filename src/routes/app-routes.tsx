import { Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
import NavbarLayout from '@/layouts/navbar-layout';
import { PageLoader } from '@/components/ui/loadings';
import {
  Home,
  Presentation,
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
} from './lazy-components';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<NavbarLayout />}>
          <Route
            index
            element={
              <Suspense fallback={<PageLoader />}>
                <Presentation />
              </Suspense>
            }
          />
          {/* Administrator Routes */}
          <Route path="/administrator">
            <Route
              index
              element={
                <Suspense fallback={<PageLoader />}>
                  <Home />
                </Suspense>
              }
            />
            <Route
              path="register-info"
              element={
                <Suspense fallback={<PageLoader />}>
                  <RegisterInfoPage />
                </Suspense>
              }
            />
            <Route
              path="register-areas"
              element={
                <Suspense fallback={<PageLoader />}>
                  <RegisterAreas />
                </Suspense>
              }
            />
            <Route
              path="register-levels"
              element={
                <Suspense fallback={<PageLoader />}>
                  <RegisterLevelsPage />
                </Suspense>
              }
            />
            <Route
              path="register-levels-grades"
              element={
                <Suspense fallback={<PageLoader />}>
                  <RegisterLevelsGradesPage />
                </Suspense>
              }
            />
            <Route
              path="register-levels-area"
              element={
                <Suspense fallback={<PageLoader />}>
                  <RegisterLevelsAreaPage />
                </Suspense>
              }
            />
            <Route
              path="report-registered-olimpist"
              element={
                <Suspense fallback={<PageLoader />}>
                  <ReportRegisterOliPage />
                </Suspense>
              }
            />
          </Route>{' '}
          {/* Olympian Routes */}
          <Route path="/olympian">
            <Route
              index
              element={
                <Suspense fallback={<PageLoader />}>
                  <Home />
                </Suspense>
              }
            />
            <Route
              path="register-olympians"
              element={
                <RegistrationGuard>
                  <RegisterParticipantPage />
                </RegistrationGuard>
              }
            />
            <Route
              path="register-tutor"
              element={
                <RegistrationGuard>
                  <RegisterTutorPage />
                </RegistrationGuard>
              }
            />
            <Route
              path="register-selected-areas"
              element={
                <RegistrationGuard>
                  <RegisterSelectedAreasPage />
                </RegistrationGuard>
              }
            />
            <Route
              path="register-data-excel"
              element={
                <RegistrationGuard>
                  <RegisterDataExcel />
                </RegistrationGuard>
              }
            />
            <Route
              path="registrations"
              element={
                <RegistrationGuard>
                  <RegistrationsPage />
                </RegistrationGuard>
              }
            />
            <Route
              path="generate-order-payment"
              element={
                <RegistrationGuard>
                  <GenerateOrderPaymentPage />
                </RegistrationGuard>
              }
            />
            <Route
              path="upload-payment"
              element={
                <RegistrationGuard>
                  <UploadPaymentPage />
                </RegistrationGuard>
              }
            />
          </Route>{' '}
          {/* Legacy routes for backward compatibility */}
          <Route
            path="/presentation"
            element={
              <Suspense fallback={<PageLoader />}>
                <Presentation />
              </Suspense>
            }
          />
          <Route
            path="/register-info"
            element={
              <Suspense fallback={<PageLoader />}>
                <RegisterInfoPage />
              </Suspense>
            }
          />
          <Route
            path="/register-areas"
            element={
              <Suspense fallback={<PageLoader />}>
                <RegisterAreas />
              </Suspense>
            }
          />
          <Route
            path="/register-levels"
            element={
              <Suspense fallback={<PageLoader />}>
                <RegisterLevelsPage />
              </Suspense>
            }
          />
          <Route
            path="/register-levels-grades"
            element={
              <Suspense fallback={<PageLoader />}>
                <RegisterLevelsGradesPage />
              </Suspense>
            }
          />
          <Route
            path="/register-levels-area"
            element={
              <Suspense fallback={<PageLoader />}>
                <RegisterLevelsAreaPage />
              </Suspense>
            }
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
            element={
              <Suspense fallback={<PageLoader />}>
                <ReportRegisterOliPage />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
