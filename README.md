# Feature: Olympiads

Este feature maneja toda la funcionalidad relacionada con la gestión de olimpiadas, incluyendo la creación, configuración de áreas, niveles y reportes.

## 📁 Estructura de Carpetas

```
src/features/olympiads/
├── components/           # Componentes UI organizados por tipo
│   ├── cards/           # Componentes tipo tarjeta
│   ├── forms/           # Formularios
│   ├── modals/          # Modales

│   ├── tables/          # Tablas
│   └── index.ts         # Exportaciones de componentes
├── constants/           # Constantes y configuraciones
│   └── olympiad-constants.ts
├── hooks/              # Hooks personalizados
│   ├── use-areas.ts
│   ├── use-confirmation.ts
│   └── use-olympiads.ts
├── interfaces/         # Tipos TypeScript
│   ├── form-info.d.ts
│   └── form-levels.d.ts
├── pages/             # Páginas/rutas del feature
│   ├── register-areas.tsx
│   ├── register-info.tsx
│   ├── register-levels.tsx
│   ├── register-levels-area.tsx
│   ├── register-levels-grades.tsx
│   └── report-registerered-olimpist.tsx
├── services/          # Lógica de API
│   └── olympiad-api.ts
├── utils/             # Utilidades y helpers
│   └── olympiad-helpers.ts
└── index.ts           # Exportaciones principales del feature
```

# Registrations Feature - Estructura Refactorizada

Este directorio contiene toda la lógica relacionada con registros y pagos, reestructurada siguiendo el patrón de `features/registrations`.

## 📁 Estructura de Archivos

```
registrations/
├── components/
│   ├── modals/
│   │   ├── modal-upload-payment.tsx          # Modal de subida de comprobantes
│   │   ├── payment-order-modal-individual.tsx # Modal de orden de pago individual
│   │   └── payment-order-modal.tsx           # Modal de orden de pago grupal
│   ├── cards/
│   │   └── registration-card.tsx             # Componente de tarjeta de registro
│   ├── payment-order-content.tsx             # Contenido del PDF individual
│   ├── payment-order-group-content.tsx       # Contenido del PDF grupal
│   └── registrations-list.tsx                # Lista de registros
├── hooks/
│   ├── use-upload-payment.ts                 # Hook para modal de subida
│   ├── use-payment-order-modal.ts            # Hook para modal individual
│   ├── use-payment-order-group-modal.ts      # Hook para modal grupal
│   ├── use-registration-card.ts              # Hook para tarjeta de registro
│   └── use-registrations-list.ts             # Hook para lista de registros
├── interfaces/
│   ├── modal-upload-payment.d.ts             # Tipos para subida de comprobantes
│   ├── payment-order-modal.d.ts              # Tipos para orden de pago
│   ├── registration-card.d.ts                # Tipos para tarjeta de registro
│   ├── registrations-list.d.ts               # Tipos para lista de registros
│   └── registrations.d.ts                    # Tipos heredados (legacy)
├── services/
│   ├── payment-upload-api.ts                 # API para subida de comprobantes
│   ├── registration-card-api.ts              # API para tarjeta de registro
│   └── registrations-list-api.ts             # API para lista de registros
├── utils/
│   ├── image-validation.ts                   # Validación de imágenes
│   ├── pdf-generator.ts                      # Generación de PDF
│   ├── registration-card-helpers.ts          # Helpers para tarjeta
│   └── registrations-list-helpers.ts         # Helpers para lista
├── constants/
│   └── registrations-list.ts                 # Constantes y validaciones
├── pages/
│   └── pre-registrations.tsx                 # Página de pre-registros
└── index.ts                                  # Exportaciones principales
```