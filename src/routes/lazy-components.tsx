import { lazy } from 'react';

export const Home = lazy(() =>
  import('@/features/olympiads/pages/home').then((module) => ({
    default: module.Home,
  })),
);

export const RegisterInfoPage = lazy(() =>
  import('@/features/olympiads/pages/register-info').then((module) => ({
    default: module.RegisterInfoPage,
  })),
);
export const RegisterAreas = lazy(() =>
  import('@/features/olympiads/pages/register-areas').then((module) => ({
    default: module.RegisterAreas,
  })),
);
export const RegisterLevelsPage = lazy(() =>
  import('@/features/olympiads/pages/register-levels').then((module) => ({
    default: module.RegisterLevelsPage,
  })),
);
export const RegisterLevelsGradesPage = lazy(() =>
  import('@/features/olympiads/pages/register-levels-grades').then(
    (module) => ({
      default: module.RegisterLevelsGradesPage,
    }),
  ),
);
export const RegisterLevelsAreaPage = lazy(() =>
  import('@/features/olympiads/pages/register-levels-area').then((module) => ({
    default: module.RegisterLevelsAreaPage,
  })),
);
export const ReportRegisterOliPage = lazy(() =>
  import('@/features/olympiads/pages/report-registerered-olimpist').then(
    (module) => ({
      default: module.ReportRegisterOliPage,
    }),
  ),
);

export const RegisterParticipantPage = lazy(
  () => import('@/features/participants/pages/register-participant'),
);
export const RegisterTutorPage = lazy(
  () => import('@/features/participants/pages/register-tutor'),
);
export const RegisterSelectedAreasPage = lazy(
  () => import('@/features/participants/pages/register-selected-areas'),
);
export const RegisterDataExcel = lazy(
  () => import('@/features/participants/pages/register-data-excel'),
);

export const RegistrationsPage = lazy(
  () => import('@/features/registrations/pages/registrations'),
);
export const GenerateOrderPaymentPage = lazy(
  () => import('@/features/registrations/pages/generate-payment-order-page'),
);
export const UploadPaymentPage = lazy(
  () => import('@/features/registrations/pages/upload-payment'),
);

export const RegistrationGuard = lazy(
  () => import('@/components/guards/registration-guard'),
);
export const Presentation = lazy(() =>
  import('@/features/olympiads/pages/presentation').then((module) => ({
    default: module.Presentation,
  })),
);
