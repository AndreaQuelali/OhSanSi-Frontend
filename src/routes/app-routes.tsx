import { Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
import NavbarLayout from '@/layouts/navbar-layout';
import { PageLoader } from '@/components/ui/loadings';
import NotFound from './not-found';
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
  AdminGuard,
  Login,
} from './lazy-components';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route element={<NavbarLayout />}>
          {' '}
          <Route
            index
            element={
              <Suspense fallback={<PageLoader />}>
                <Presentation />
              </Suspense>
            }
          />
          {/* Login Route */}
          <Route
            path="/login"
            element={
              <Suspense fallback={<PageLoader />}>
                <Login />
              </Suspense>
            }
          />{' '}
          {/* Administrator Routes */}
          <Route path="/administrator">
            <Route
              index
              element={
                <AdminGuard>
                  <Suspense fallback={<PageLoader />}>
                    <Home />
                  </Suspense>
                </AdminGuard>
              }
            />
            <Route
              path="register-info"
              element={
                <AdminGuard>
                  <Suspense fallback={<PageLoader />}>
                    <RegisterInfoPage />
                  </Suspense>
                </AdminGuard>
              }
            />
            <Route
              path="register-areas"
              element={
                <AdminGuard>
                  <Suspense fallback={<PageLoader />}>
                    <RegisterAreas />
                  </Suspense>
                </AdminGuard>
              }
            />
            <Route
              path="register-levels"
              element={
                <AdminGuard>
                  <Suspense fallback={<PageLoader />}>
                    <RegisterLevelsPage />
                  </Suspense>
                </AdminGuard>
              }
            />
            <Route
              path="register-levels-grades"
              element={
                <AdminGuard>
                  <Suspense fallback={<PageLoader />}>
                    <RegisterLevelsGradesPage />
                  </Suspense>
                </AdminGuard>
              }
            />
            <Route
              path="register-levels-area"
              element={
                <AdminGuard>
                  <Suspense fallback={<PageLoader />}>
                    <RegisterLevelsAreaPage />
                  </Suspense>
                </AdminGuard>
              }
            />
            <Route
              path="report-registered-olimpist"
              element={
                <AdminGuard>
                  <Suspense fallback={<PageLoader />}>
                    <ReportRegisterOliPage />
                  </Suspense>
                </AdminGuard>
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
          />{' '}
          <Route
            path="/register-info"
            element={
              <AdminGuard>
                <Suspense fallback={<PageLoader />}>
                  <RegisterInfoPage />
                </Suspense>
              </AdminGuard>
            }
          />
          <Route
            path="/register-areas"
            element={
              <AdminGuard>
                <Suspense fallback={<PageLoader />}>
                  <RegisterAreas />
                </Suspense>
              </AdminGuard>
            }
          />
          <Route
            path="/register-levels"
            element={
              <AdminGuard>
                <Suspense fallback={<PageLoader />}>
                  <RegisterLevelsPage />
                </Suspense>
              </AdminGuard>
            }
          />
          <Route
            path="/register-levels-grades"
            element={
              <AdminGuard>
                <Suspense fallback={<PageLoader />}>
                  <RegisterLevelsGradesPage />
                </Suspense>
              </AdminGuard>
            }
          />
          <Route
            path="/register-levels-area"
            element={
              <AdminGuard>
                <Suspense fallback={<PageLoader />}>
                  <RegisterLevelsAreaPage />
                </Suspense>
              </AdminGuard>
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
          />{' '}
          <Route
            path="/report-registered-olimpist"
            element={
              <AdminGuard>
                <Suspense fallback={<PageLoader />}>
                  <ReportRegisterOliPage />
                </Suspense>
              </AdminGuard>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
