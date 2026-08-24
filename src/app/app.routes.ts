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
        loadComponent: () => import('./pages/home/landing/landing').then((m) => m.LandingPage),
        title: 'Jobsy — Conecta hogares con profesionales',
      },

      // ---- Empleos ----
      {
        path: 'empleos',
        loadComponent: () =>
          import('./pages/jobs/job-search/job-search').then((m) => m.JobSearchPage),
        title: 'Buscar empleo — Jobsy',
      },
      {
        path: 'empleos/:id',
        loadComponent: () =>
          import('./pages/jobs/job-detail/job-detail').then((m) => m.JobDetailPage),
        title: 'Detalle de la oferta — Jobsy',
      },
      {
        path: 'empleos/:id/postularme',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/jobs/apply-wizard/apply-wizard').then((m) => m.ApplyWizardPage),
        title: 'Postularme — Jobsy',
      },

      // ---- Empleados ----
      {
        path: 'empleados',
        loadComponent: () =>
          import('./pages/employees/employee-search/employee-search').then(
            (m) => m.EmployeeSearchPage,
          ),
        title: 'Buscar empleados — Jobsy',
      },
      {
        path: 'empleados/:id',
        loadComponent: () =>
          import('./pages/employees/employee-detail/employee-detail').then(
            (m) => m.EmployeeDetailPage,
          ),
        title: 'Perfil del empleado — Jobsy',
      },
      {
        path: 'publicar-oferta',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/employees/publish-offer/publish-offer').then((m) => m.PublishOfferPage),
        title: 'Publicar oferta — Jobsy',
      },
      {
        path: 'agendar',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/employees/schedule/schedule').then((m) => m.SchedulePage),
        title: 'Agendar horario — Jobsy',
      },
      {
        path: 'contratacion/:id',
        canActivate: [authGuard],
        loadComponent: () => import('./pages/employees/hiring/hiring').then((m) => m.HiringPage),
        title: 'Contratacion — Jobsy',
      },

      // ---- Tienda ----
      {
        path: 'tienda',
        loadComponent: () => import('./pages/store/store/store').then((m) => m.StorePage),
        title: 'Tienda — Jobsy',
      },
      {
        path: 'tienda/producto/:id',
        loadComponent: () =>
          import('./pages/store/product-detail/product-detail').then((m) => m.ProductDetailPage),
        title: 'Producto — Jobsy',
      },
      {
        path: 'tienda/carrito',
        loadComponent: () => import('./pages/store/cart/cart').then((m) => m.CartPage),
        title: 'Mi carrito — Jobsy',
      },
      {
        path: 'tienda/checkout',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/store/checkout/checkout').then((m) => m.CheckoutPage),
        title: 'Finalizar compra — Jobsy',
        children: [
          { path: '', redirectTo: 'pse', pathMatch: 'full' },
          {
            path: 'pse',
            loadComponent: () => import('./pages/store/checkout/pse/pse').then((m) => m.PsePage),
          },
          {
            path: 'tarjeta',
            loadComponent: () =>
              import('./pages/store/checkout/card/card').then((m) => m.CardPage),
          },
          {
            path: 'billetera',
            loadComponent: () =>
              import('./pages/store/checkout/digital-wallet/digital-wallet').then(
                (m) => m.DigitalWalletPage,
              ),
          },
          {
            path: 'saldo',
            loadComponent: () =>
              import('./pages/store/checkout/jobsy-balance/jobsy-balance').then(
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
        loadComponent: () => import('./pages/auth/login/login').then((m) => m.LoginPage),
        title: 'Iniciar sesion — Jobsy',
      },
      {
        path: 'recuperar',
        loadComponent: () =>
          import('./pages/auth/forgot-password/forgot-password').then((m) => m.ForgotPasswordPage),
        title: 'Restablecer contrasena — Jobsy',
      },
      {
        path: 'correo-enviado',
        loadComponent: () =>
          import('./pages/auth/email-sent/email-sent').then((m) => m.EmailSentPage),
        title: 'Correo enviado — Jobsy',
      },
      {
        path: 'exito',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/auth/login-success/login-success').then((m) => m.LoginSuccessPage),
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
          import('./pages/register/create-account/create-account').then((m) => m.CreateAccountPage),
        title: 'Crear cuenta — Jobsy',
      },
      {
        path: 'rol',
        loadComponent: () =>
          import('./pages/register/select-role/select-role').then((m) => m.SelectRolePage),
        title: 'Seleccionar rol — Jobsy',
      },
      {
        path: 'checklist',
        loadComponent: () =>
          import('./pages/register/checklist/checklist').then((m) => m.ChecklistPage),
        title: 'Completar perfil — Jobsy',
      },
      {
        path: 'paso-1',
        loadComponent: () =>
          import('./pages/register/step-personal/step-personal').then((m) => m.StepPersonalPage),
        title: 'Paso 1: datos personales — Jobsy',
      },
      {
        path: 'paso-2',
        loadComponent: () =>
          import('./pages/register/step-work/step-work').then((m) => m.StepWorkPage),
        title: 'Paso 2: modalidad de trabajo — Jobsy',
      },
      {
        path: 'paso-3',
        loadComponent: () =>
          import('./pages/register/step-location/step-location').then((m) => m.StepLocationPage),
        title: 'Paso 3: ubicacion y foto — Jobsy',
      },
      {
        path: 'cuenta-creada',
        loadComponent: () =>
          import('./pages/register/account-created/account-created').then(
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
          import('./pages/home/home-logged/home-logged').then((m) => m.HomeLoggedPage),
        title: 'Mi inicio — Jobsy',
      },
      {
        path: 'mis-postulaciones',
        loadComponent: () =>
          import('./pages/applications/my-applications/my-applications').then(
            (m) => m.MyApplicationsPage,
          ),
        title: 'Mis postulaciones — Jobsy',
      },

      // ---- Perfil ----
      {
        path: 'perfil',
        loadComponent: () => import('./pages/profile/profile/profile').then((m) => m.ProfilePage),
        title: 'Mi perfil — Jobsy',
      },
      {
        path: 'perfil/editar',
        loadComponent: () =>
          import('./pages/profile/edit-profile/edit-profile').then((m) => m.EditProfilePage),
        title: 'Editar perfil — Jobsy',
      },
      {
        path: 'perfil/subir-foto',
        loadComponent: () =>
          import('./pages/profile/upload-photo/upload-photo').then((m) => m.UploadPhotoPage),
        title: 'Foto de perfil — Jobsy',
      },

      {
        path: 'hoja-de-vida',
        loadComponent: () => import('./pages/resume/resume/resume').then((m) => m.ResumePage),
        title: 'Hoja de vida — Jobsy',
      },

      // ---- Reportes ----
      {
        path: 'reportes',
        loadComponent: () =>
          import('./pages/reports/report-center/report-center').then((m) => m.ReportCenterPage),
        title: 'Centro de reportes — Jobsy',
      },
      {
        path: 'reportes/visual',
        loadComponent: () =>
          import('./pages/reports/visual-report/visual-report').then((m) => m.VisualReportPage),
        title: 'Reporte visual — Jobsy',
      },

      // ---- Cuenta ----
      {
        path: 'cuenta',
        loadComponent: () => import('./pages/account/account/account').then((m) => m.AccountPage),
        title: 'Mi cuenta — Jobsy',
        children: [
          { path: '', redirectTo: 'informacion', pathMatch: 'full' },
          {
            path: 'informacion',
            loadComponent: () =>
              import('./pages/account/information/information').then((m) => m.AccountInfoPage),
          },
          {
            path: 'plan',
            loadComponent: () =>
              import('./pages/account/plan/plan').then((m) => m.AccountPlanPage),
          },
          {
            path: 'metodos-pago',
            loadComponent: () =>
              import('./pages/account/payment-methods/payment-methods').then(
                (m) => m.PaymentMethodsPage,
              ),
          },
        ],
      },

      {
        path: 'configuracion',
        loadComponent: () =>
          import('./pages/settings/settings/settings').then((m) => m.SettingsPage),
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
          import('./pages/admin/dashboard/dashboard').then((m) => m.AdminDashboardPage),
        title: 'Dashboard — Admin Jobsy',
      },
      {
        path: 'analiticas',
        loadComponent: () =>
          import('./pages/admin/analytics/analytics').then((m) => m.AdminAnalyticsPage),
        title: 'Analiticas — Admin Jobsy',
      },
      {
        path: 'productos',
        loadComponent: () =>
          import('./pages/admin/products/products').then((m) => m.AdminProductsPage),
        title: 'Productos — Admin Jobsy',
      },
      {
        path: 'categorias',
        loadComponent: () =>
          import('./pages/admin/categories/categories').then((m) => m.AdminCategoriesPage),
        title: 'Categorias — Admin Jobsy',
      },
      {
        path: 'inventario',
        loadComponent: () =>
          import('./pages/admin/inventory/inventory').then((m) => m.AdminInventoryPage),
        title: 'Inventario — Admin Jobsy',
      },
      {
        path: 'reportes',
        loadComponent: () =>
          import('./pages/admin/reports/reports').then((m) => m.AdminReportsPage),
        title: 'Reportes — Admin Jobsy',
      },
    ],
  },

  // ============================================================
  //  404
  // ============================================================
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFoundPage),
    title: 'Pagina no encontrada — Jobsy',
  },
];
