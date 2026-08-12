import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './core/guards';

/**
 * Enrutado de Jobsy.
 * Agrupado por layout: auth (tarjeta centrada), publico (header+footer),
 * app (usuario logueado) y admin (sidebar oscuro).
 * Todas las paginas son lazy para que el bundle inicial se mantenga pequeno.
 */
export const routes: Routes = [
  // ---------- AUTENTICACION ----------
  {
    path: 'auth',
    loadComponent: () => import('./shared/layouts/auth-layout/auth-layout').then((m) => m.AuthLayoutComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'login' },
      { path: 'login', loadComponent: () => import('./pages/auth/login/login').then((m) => m.LoginPage), title: 'Iniciar Sesion | Jobsy' },
      { path: 'recuperar', loadComponent: () => import('./pages/auth/forgot-password/forgot-password').then((m) => m.ForgotPasswordPage), title: 'Restablecer Contrasena | Jobsy' },
      { path: 'correo-enviado', loadComponent: () => import('./pages/auth/email-sent/email-sent').then((m) => m.EmailSentPage), title: 'Correo Enviado | Jobsy' },
      { path: 'exito', loadComponent: () => import('./pages/auth/login-success/login-success').then((m) => m.LoginSuccessPage), title: 'Bienvenido | Jobsy' },
    ],
  },

  // ---------- REGISTRO (onboarding por pasos) ----------
  {
    path: 'registro',
    loadComponent: () => import('./shared/layouts/auth-layout/auth-layout').then((m) => m.AuthLayoutComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'crear-cuenta' },
      { path: 'crear-cuenta', loadComponent: () => import('./pages/register/create-account/create-account').then((m) => m.CreateAccountPage), title: 'Crear Cuenta | Jobsy' },
      { path: 'rol', loadComponent: () => import('./pages/register/select-role/select-role').then((m) => m.SelectRolePage), title: 'Seleccionar Rol | Jobsy' },
      { path: 'checklist', loadComponent: () => import('./pages/register/checklist/checklist').then((m) => m.ChecklistPage), title: 'Check List | Jobsy' },
      { path: 'paso-1', loadComponent: () => import('./pages/register/step-personal/step-personal').then((m) => m.StepPersonalPage), title: 'Paso 1 | Jobsy' },
      { path: 'paso-2', loadComponent: () => import('./pages/register/step-work/step-work').then((m) => m.StepWorkPage), title: 'Paso 2 | Jobsy' },
      { path: 'paso-3', loadComponent: () => import('./pages/register/step-location/step-location').then((m) => m.StepLocationPage), title: 'Paso 3 | Jobsy' },
      { path: 'cuenta-creada', loadComponent: () => import('./pages/register/account-created/account-created').then((m) => m.AccountCreatedPage), title: 'Cuenta Creada | Jobsy' },
    ],
  },

  // ---------- SITIO PUBLICO ----------
  {
    path: '',
    loadComponent: () => import('./shared/layouts/public-layout/public-layout').then((m) => m.PublicLayoutComponent),
    children: [
      { path: '', loadComponent: () => import('./pages/home/landing/landing').then((m) => m.LandingPage), title: 'Jobsy | Conecta. Crece. Oportunidades' },

      // Empleo
      { path: 'empleos', loadComponent: () => import('./pages/jobs/job-search/job-search').then((m) => m.JobSearchPage), title: 'Buscar Empleo | Jobsy' },
      { path: 'empleos/:id', loadComponent: () => import('./pages/jobs/job-detail/job-detail').then((m) => m.JobDetailPage), title: 'Detalle de oferta | Jobsy' },
      { path: 'empleos/:id/postularme', loadComponent: () => import('./pages/jobs/apply-wizard/apply-wizard').then((m) => m.ApplyWizardPage), canActivate: [authGuard], title: 'Postularme | Jobsy' },

      // Empleados
      { path: 'empleados', loadComponent: () => import('./pages/employees/employee-search/employee-search').then((m) => m.EmployeeSearchPage), title: 'Buscar Empleados | Jobsy' },
      { path: 'empleados/:id', loadComponent: () => import('./pages/employees/employee-detail/employee-detail').then((m) => m.EmployeeDetailPage), title: 'Perfil de empleado | Jobsy' },
      { path: 'publicar-oferta', loadComponent: () => import('./pages/employees/publish-offer/publish-offer').then((m) => m.PublishOfferPage), canActivate: [authGuard], title: 'Publicar Oferta | Jobsy' },
      { path: 'agendar', loadComponent: () => import('./pages/employees/schedule/schedule').then((m) => m.SchedulePage), canActivate: [authGuard], title: 'Agendar Horario | Jobsy' },
      { path: 'contratacion/:id', loadComponent: () => import('./pages/employees/hiring/hiring').then((m) => m.HiringPage), canActivate: [authGuard], title: 'Contratacion | Jobsy' },

      // Tienda
      { path: 'tienda', loadComponent: () => import('./pages/store/store/store').then((m) => m.StorePage), title: 'Tienda Jobsy' },
      { path: 'tienda/producto/:id', loadComponent: () => import('./pages/store/product-detail/product-detail').then((m) => m.ProductDetailPage), title: 'Producto | Jobsy' },
      { path: 'tienda/carrito', loadComponent: () => import('./pages/store/cart/cart').then((m) => m.CartPage), title: 'Carrito | Jobsy' },
      {
        path: 'tienda/checkout',
        loadComponent: () => import('./pages/store/checkout/checkout').then((m) => m.CheckoutPage),
        canActivate: [authGuard],
        title: 'Checkout | Jobsy',
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'pse' },
          { path: 'pse', loadComponent: () => import('./pages/store/checkout/pse/pse').then((m) => m.PsePage) },
          { path: 'tarjeta', loadComponent: () => import('./pages/store/checkout/card/card').then((m) => m.CardPage) },
          { path: 'billetera', loadComponent: () => import('./pages/store/checkout/digital-wallet/digital-wallet').then((m) => m.DigitalWalletPage) },
          { path: 'saldo', loadComponent: () => import('./pages/store/checkout/jobsy-balance/jobsy-balance').then((m) => m.JobsyBalancePage) },
        ],
      },
    ],
  },

  // ---------- AREA PRIVADA DEL USUARIO ----------
  {
    path: 'app',
    loadComponent: () => import('./shared/layouts/app-layout/app-layout').then((m) => m.AppLayoutComponent),
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'inicio' },
      { path: 'inicio', loadComponent: () => import('./pages/home/home-logged/home-logged').then((m) => m.HomeLoggedPage), title: 'Inicio | Jobsy' },
      { path: 'mis-postulaciones', loadComponent: () => import('./pages/applications/my-applications/my-applications').then((m) => m.MyApplicationsPage), title: 'Mis Postulaciones | Jobsy' },

      // Perfil
      { path: 'perfil', loadComponent: () => import('./pages/profile/profile/profile').then((m) => m.ProfilePage), title: 'Perfil | Jobsy' },
      { path: 'perfil/editar', loadComponent: () => import('./pages/profile/edit-profile/edit-profile').then((m) => m.EditProfilePage), title: 'Editar Perfil | Jobsy' },
      { path: 'perfil/foto', loadComponent: () => import('./pages/profile/upload-photo/upload-photo').then((m) => m.UploadPhotoPage), title: 'Subir Foto | Jobsy' },

      { path: 'hoja-de-vida', loadComponent: () => import('./pages/resume/resume/resume').then((m) => m.ResumePage), title: 'Hoja de Vida | Jobsy' },

      // Reportes
      { path: 'reportes', loadComponent: () => import('./pages/reports/report-center/report-center').then((m) => m.ReportCenterPage), title: 'Centro de Reportes | Jobsy' },
      { path: 'reportes/visual', loadComponent: () => import('./pages/reports/visual-report/visual-report').then((m) => m.VisualReportPage), title: 'Reporte Visual | Jobsy' },

      { path: 'configuracion', loadComponent: () => import('./pages/settings/settings/settings').then((m) => m.SettingsPage), title: 'Configuracion | Jobsy' },

      // Cuenta
      {
        path: 'cuenta',
        loadComponent: () => import('./pages/account/account/account').then((m) => m.AccountPage),
        title: 'Cuenta | Jobsy',
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'informacion' },
          { path: 'informacion', loadComponent: () => import('./pages/account/information/information').then((m) => m.InformationPage) },
          { path: 'plan', loadComponent: () => import('./pages/account/plan/plan').then((m) => m.PlanPage) },
          { path: 'metodos-de-pago', loadComponent: () => import('./pages/account/payment-methods/payment-methods').then((m) => m.PaymentMethodsPage) },
        ],
      },
    ],
  },

  // ---------- PANEL DE ADMINISTRACION ----------
  {
    path: 'admin',
    loadComponent: () => import('./shared/layouts/admin-layout/admin-layout').then((m) => m.AdminLayoutComponent),
    canActivate: [authGuard, roleGuard(['admin'])],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', loadComponent: () => import('./pages/admin/dashboard/dashboard').then((m) => m.DashboardPage), title: 'Dashboard | Jobsy Admin' },
      { path: 'analiticas', loadComponent: () => import('./pages/admin/analytics/analytics').then((m) => m.AnalyticsPage), title: 'Analiticas | Jobsy Admin' },
      { path: 'productos', loadComponent: () => import('./pages/admin/products/products').then((m) => m.AdminProductsPage), title: 'Productos | Jobsy Admin' },
      { path: 'categorias', loadComponent: () => import('./pages/admin/categories/categories').then((m) => m.AdminCategoriesPage), title: 'Categorias | Jobsy Admin' },
      { path: 'inventario', loadComponent: () => import('./pages/admin/inventory/inventory').then((m) => m.AdminInventoryPage), title: 'Inventario | Jobsy Admin' },
      { path: 'reportes', loadComponent: () => import('./pages/admin/reports/reports').then((m) => m.AdminReportsPage), title: 'Reportes | Jobsy Admin' },
    ],
  },

  // ---------- 404 ----------
  { path: '**', loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFoundPage), title: 'Pagina no encontrada | Jobsy' },
];
