import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './core/guards';

/**
 * Rutas de Jobsy, agrupadas por layout.
 * Todo se carga con loadComponent para que cada pantalla viaje en su propio chunk.
 */
export const routes: Routes = [
  // ============================================================
  //  Sitio publico (header + footer)
  // ============================================================
  {
    path: '',
    loadComponent: () =>
      import('./shared/layouts/public-layout/public-layout').then((m) => m.PublicLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/inicio/portada/portada').then((m) => m.LandingPage),
        title: 'Jobsy — Conecta hogares con profesionales',
      },

      // ---- Empleos ----
      {
        path: 'empleos',
        loadComponent: () =>
          import('./pages/empleos/buscar-empleos/buscar-empleos').then((m) => m.JobSearchPage),
        title: 'Buscar empleo — Jobsy',
      },
      {
        path: 'empleos/:id',
        loadComponent: () =>
          import('./pages/empleos/detalle-empleo/detalle-empleo').then((m) => m.JobDetailPage),
        title: 'Detalle de la oferta — Jobsy',
      },
      {
        path: 'empleos/:id/postularme',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/empleos/asistente-postulacion/asistente-postulacion').then((m) => m.ApplyWizardPage),
        title: 'Postularme — Jobsy',
      },

      // ---- Empleados ----
      {
        path: 'empleados',
        loadComponent: () =>
          import('./pages/empleados/buscar-empleados/buscar-empleados').then(
            (m) => m.EmployeeSearchPage,
          ),
        title: 'Buscar empleados — Jobsy',
      },
      {
        path: 'empleados/:id',
        loadComponent: () =>
          import('./pages/empleados/detalle-empleado/detalle-empleado').then(
            (m) => m.EmployeeDetailPage,
          ),
        title: 'Perfil del empleado — Jobsy',
      },
      {
        path: 'publicar-oferta',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/empleados/publicar-oferta/publicar-oferta').then((m) => m.PublishOfferPage),
        title: 'Publicar oferta — Jobsy',
      },
      {
        path: 'agendar',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/empleados/agendar/agendar').then((m) => m.SchedulePage),
        title: 'Agendar horario — Jobsy',
      },
      {
        path: 'contratacion/:id',
        canActivate: [authGuard],
        loadComponent: () => import('./pages/empleados/contratacion/contratacion').then((m) => m.HiringPage),
        title: 'Contratacion — Jobsy',
      },

      // ---- Tienda ----
      {
        path: 'tienda',
        loadComponent: () => import('./pages/tienda/tienda/tienda').then((m) => m.StorePage),
        title: 'Tienda — Jobsy',
      },
      {
        path: 'tienda/producto/:id',
        loadComponent: () =>
          import('./pages/tienda/detalle-producto/detalle-producto').then((m) => m.ProductDetailPage),
        title: 'Producto — Jobsy',
      },
      {
        path: 'tienda/carrito',
        loadComponent: () => import('./pages/tienda/carrito/carrito').then((m) => m.CartPage),
        title: 'Mi carrito — Jobsy',
      },
      {
        path: 'tienda/checkout',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/tienda/pago/pago').then((m) => m.CheckoutPage),
        title: 'Finalizar compra — Jobsy',
        children: [
          { path: '', redirectTo: 'pse', pathMatch: 'full' },
          {
            path: 'pse',
            loadComponent: () => import('./pages/tienda/pago/pse/pse').then((m) => m.PsePage),
          },
          {
            path: 'tarjeta',
            loadComponent: () =>
              import('./pages/tienda/pago/tarjeta/tarjeta').then((m) => m.CardPage),
          },
          {
            path: 'billetera',
            loadComponent: () =>
              import('./pages/tienda/pago/billetera/billetera').then(
                (m) => m.DigitalWalletPage,
              ),
          },
          {
            path: 'saldo',
            loadComponent: () =>
              import('./pages/tienda/pago/saldo/saldo').then(
                (m) => m.JobsyBalancePage,
              ),
          },
        ],
      },
    ],
  },

  // ============================================================
  //  Autenticacion (tarjeta centrada sobre fondo celeste)
  // ============================================================
  {
    path: 'auth',
    loadComponent: () =>
      import('./shared/layouts/auth-layout/auth-layout').then((m) => m.AuthLayoutComponent),
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      {
        path: 'login',
        loadComponent: () => import('./pages/acceso/ingreso/ingreso').then((m) => m.LoginPage),
        title: 'Iniciar sesion — Jobsy',
      },
      {
        path: 'recuperar',
        loadComponent: () =>
          import('./pages/acceso/recuperar/recuperar').then((m) => m.ForgotPasswordPage),
        title: 'Restablecer contrasena — Jobsy',
      },
      {
        path: 'correo-enviado',
        loadComponent: () =>
          import('./pages/acceso/correo-enviado/correo-enviado').then((m) => m.EmailSentPage),
        title: 'Correo enviado — Jobsy',
      },
      {
        path: 'exito',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/acceso/ingreso-exitoso/ingreso-exitoso').then((m) => m.LoginSuccessPage),
        title: 'Sesion iniciada — Jobsy',
      },
    ],
  },

  // ============================================================
  //  Registro por pasos (mismo layout que auth)
  // ============================================================
  {
    path: 'registro',
    loadComponent: () =>
      import('./shared/layouts/auth-layout/auth-layout').then((m) => m.AuthLayoutComponent),
    children: [
      { path: '', redirectTo: 'crear-cuenta', pathMatch: 'full' },
      {
        path: 'crear-cuenta',
        loadComponent: () =>
          import('./pages/registro/crear-cuenta/crear-cuenta').then((m) => m.CreateAccountPage),
        title: 'Crear cuenta — Jobsy',
      },
      {
        path: 'rol',
        loadComponent: () =>
          import('./pages/registro/elegir-rol/elegir-rol').then((m) => m.SelectRolePage),
        title: 'Seleccionar rol — Jobsy',
      },
      {
        path: 'checklist',
        loadComponent: () =>
          import('./pages/registro/lista-pasos/lista-pasos').then((m) => m.ChecklistPage),
        title: 'Completar perfil — Jobsy',
      },
      {
        path: 'paso-1',
        loadComponent: () =>
          import('./pages/registro/paso-personal/paso-personal').then((m) => m.StepPersonalPage),
        title: 'Paso 1: datos personales — Jobsy',
      },
      {
        path: 'paso-2',
        loadComponent: () =>
          import('./pages/registro/paso-trabajo/paso-trabajo').then((m) => m.StepWorkPage),
        title: 'Paso 2: modalidad de trabajo — Jobsy',
      },
      {
        path: 'paso-3',
        loadComponent: () =>
          import('./pages/registro/paso-ubicacion/paso-ubicacion').then((m) => m.StepLocationPage),
        title: 'Paso 3: ubicacion y foto — Jobsy',
      },
      {
        path: 'cuenta-creada',
        loadComponent: () =>
          import('./pages/registro/cuenta-creada/cuenta-creada').then(
            (m) => m.AccountCreatedPage,
          ),
        title: 'Cuenta creada — Jobsy',
      },
    ],
  },

  // ============================================================
  //  Area privada del usuario (header + menu lateral + footer)
  // ============================================================
  {
    path: 'app',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./shared/layouts/app-layout/app-layout').then((m) => m.AppLayoutComponent),
    children: [
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
      {
        path: 'inicio',
        loadComponent: () =>
          import('./pages/inicio/inicio-privado/inicio-privado').then((m) => m.HomeLoggedPage),
        title: 'Mi inicio — Jobsy',
      },
      {
        path: 'mis-postulaciones',
        loadComponent: () =>
          import('./pages/postulaciones/mis-postulaciones/mis-postulaciones').then(
            (m) => m.MyApplicationsPage,
          ),
        title: 'Mis postulaciones — Jobsy',
      },

      // ---- Perfil ----
      {
        path: 'perfil',
        loadComponent: () => import('./pages/perfil/perfil/perfil').then((m) => m.ProfilePage),
        title: 'Mi perfil — Jobsy',
      },
      {
        path: 'perfil/editar',
        loadComponent: () =>
          import('./pages/perfil/editar-perfil/editar-perfil').then((m) => m.EditProfilePage),
        title: 'Editar perfil — Jobsy',
      },
      {
        path: 'perfil/subir-foto',
        loadComponent: () =>
          import('./pages/perfil/subir-foto/subir-foto').then((m) => m.UploadPhotoPage),
        title: 'Foto de perfil — Jobsy',
      },

      {
        path: 'hoja-de-vida',
        loadComponent: () => import('./pages/hoja-vida/hoja-vida/hoja-vida').then((m) => m.ResumePage),
        title: 'Hoja de vida — Jobsy',
      },

      // ---- Reportes ----
      {
        path: 'reportes',
        loadComponent: () =>
          import('./pages/reportes/centro-reportes/centro-reportes').then((m) => m.ReportCenterPage),
        title: 'Centro de reportes — Jobsy',
      },
      {
        path: 'reportes/visual',
        loadComponent: () =>
          import('./pages/reportes/reporte-visual/reporte-visual').then((m) => m.VisualReportPage),
        title: 'Reporte visual — Jobsy',
      },

      // ---- Cuenta ----
      {
        path: 'cuenta',
        loadComponent: () => import('./pages/cuenta/cuenta/cuenta').then((m) => m.AccountPage),
        title: 'Mi cuenta — Jobsy',
        children: [
          { path: '', redirectTo: 'informacion', pathMatch: 'full' },
          {
            path: 'informacion',
            loadComponent: () =>
              import('./pages/cuenta/informacion/informacion').then((m) => m.AccountInfoPage),
          },
          {
            path: 'plan',
            loadComponent: () =>
              import('./pages/cuenta/plan/plan').then((m) => m.AccountPlanPage),
          },
          {
            path: 'metodos-pago',
            loadComponent: () =>
              import('./pages/cuenta/metodos-pago/metodos-pago').then(
                (m) => m.PaymentMethodsPage,
              ),
          },
        ],
      },

      {
        path: 'configuracion',
        loadComponent: () =>
          import('./pages/configuracion/configuracion/configuracion').then((m) => m.SettingsPage),
        title: 'Configuracion — Jobsy',
      },
    ],
  },

  // ============================================================
  //  Panel de administracion (sidebar azul oscuro)
  // ============================================================
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard(['admin'])],
    loadComponent: () =>
      import('./shared/layouts/admin-layout/admin-layout').then((m) => m.AdminLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/admin/tablero/tablero').then((m) => m.AdminDashboardPage),
        title: 'Dashboard — Admin Jobsy',
      },
      {
        path: 'analiticas',
        loadComponent: () =>
          import('./pages/admin/analiticas/analiticas').then((m) => m.AdminAnalyticsPage),
        title: 'Analiticas — Admin Jobsy',
      },
      {
        path: 'productos',
        loadComponent: () =>
          import('./pages/admin/productos/productos').then((m) => m.AdminProductsPage),
        title: 'Productos — Admin Jobsy',
      },
      {
        path: 'categorias',
        loadComponent: () =>
          import('./pages/admin/categorias/categorias').then((m) => m.AdminCategoriesPage),
        title: 'Categorias — Admin Jobsy',
      },
      {
        path: 'inventario',
        loadComponent: () =>
          import('./pages/admin/inventario/inventario').then((m) => m.AdminInventoryPage),
        title: 'Inventario — Admin Jobsy',
      },
      {
        path: 'reportes',
        loadComponent: () =>
          import('./pages/admin/reportes/reportes').then((m) => m.AdminReportsPage),
        title: 'Reportes — Admin Jobsy',
      },
    ],
  },

  // ============================================================
  //  404
  // ============================================================
  {
    path: '**',
    loadComponent: () => import('./pages/no-encontrado/no-encontrado').then((m) => m.NotFoundPage),
    title: 'Pagina no encontrada — Jobsy',
  },
];
