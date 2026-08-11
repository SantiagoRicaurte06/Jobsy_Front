# Jobsy — Frontend

Cliente web de **Jobsy**, la plataforma que conecta hogares con trabajadores del hogar.
Angular 22 (standalone + zoneless), SCSS propio, arquitectura MVC por capas.

> **Estado actual:** solo la estructura. Todas las páginas están generadas con su
> `.ts`, `.html` y `.scss` vacíos, listos para maquetar. Los datos vienen de mocks
> que simulan el backend real.

## Arranque

```bash
npm install
npm start
```

Abre http://localhost:4200

## Arquitectura (MVC)

| Capa | Carpeta | Rol |
|---|---|---|
| **Modelo** | `src/app/core/models/` | Interfaces TypeScript — el contrato de datos con el backend |
| **Controlador** | `src/app/core/services/` | Servicios que orquestan datos y lógica de negocio |
| **Vista** | `src/app/pages/` + `src/app/shared/` | Componentes: plantillas HTML y estilos |

```
src/
├── app/
│   ├── core/                  # Lógica transversal (singleton)
│   │   ├── models/            # Interfaces de datos por microservicio
│   │   ├── services/          # Servicios de dominio (mock ↔ HTTP)
│   │   ├── guards/            # authGuard, roleGuard
│   │   ├── interceptors/      # JWT + manejo de errores
│   │   └── constants/
│   ├── shared/                # Reutilizable entre páginas
│   │   ├── components/        # job-card, product-card, header, footer…
│   │   ├── layouts/           # public / app / auth / admin
│   │   ├── pipes/
│   │   └── directives/
│   ├── pages/                 # Una carpeta por pantalla del Figma
│   ├── mocks/                 # TEMPORAL — datos simulados
│   ├── app.routes.ts          # Enrutado completo (lazy loading)
│   └── app.config.ts          # Providers: router, HttpClient, interceptors
├── styles/
│   ├── _variables.scss        # Design tokens (colores, tipografía, espaciado)
│   └── _mixins.scss           # container, card, btn-primary…
└── environments/              # useMocks, apiUrl, endpoints
```

## Cómo pasar de mocks al backend real

Los servicios ya tienen las dos rutas implementadas. Solo cambia el flag:

```ts
// src/environments/environment.ts
useMocks: false,
apiUrl: 'http://localhost:8080/api',
```

Cada servicio hace:

```ts
if (environment.useMocks) return mockResponse(DATOS_FALSOS);
return this.api.get<Tipo>(`${this.path}/recurso`);
```

Cuando el backend esté listo: pon `useMocks: false`, ajusta las rutas de
`environment.endpoints` y **borra la carpeta `src/app/mocks/`**.

## Mapa de servicios → microservicios

| Servicio | Microservicio |
|---|---|
| `AuthService`, `ProfileService`, `ResumeService`, `EmployeeService` | `Usuarios_Api` |
| `JobService`, `ApplicationService` | `Empleo_API` |
| `ProductService`, `OrderService`, `AdminService` | `Tienda_APi` / `Catalogo_api` |
| `SubscriptionService` | `suscripciones_API` |
| `ReportService` | `Soporte_API` |
| `ApiService` (gateway base) | `Core_api` |
| `CartService` | — solo estado local del cliente |

## Rutas

| Grupo | Prefijo | Layout | Protección |
|---|---|---|---|
| Autenticación | `/auth/*` | `auth-layout` | — |
| Registro | `/registro/*` | `auth-layout` | — |
| Sitio público | `/`, `/empleos`, `/empleados`, `/tienda` | `public-layout` | — |
| Área privada | `/app/*` | `app-layout` | `authGuard` |
| Administración | `/admin/*` | `admin-layout` | `authGuard` + `roleGuard(['admin'])` |

## Estilos

Usa los tokens en cualquier SCSS de componente — ya están en el `includePath`:

```scss
@use 'variables' as v;
@use 'mixins' as m;

.mi-componente {
  background: v.$color-primary;
  padding: v.$space-4;
  @include m.card;
}
```

**Paleta:** azul `#1668B3` (marca), naranja `#F5821F` (CTA principal),
azul claro `#2B8FE0` (acciones secundarias), verde `#2E9E5B` (verificado).

## Diseño de referencia

[Figma — JOBSY](https://www.figma.com/design/h1mrQxQYKAHcuZ4sjVT7iH/JOBSY?node-id=0-1)

## Comandos

```bash
npm start          # servidor de desarrollo
npm run build      # build de producción
npm test           # tests unitarios
```
