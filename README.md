# Feature: Olympiads

Este feature maneja toda la funcionalidad relacionada con la gestión de olimpiadas, incluyendo la creación, configuración de áreas, niveles y reportes.

## Estructura de Carpetas

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