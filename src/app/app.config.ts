import {
  ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection,
} from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEsCO from '@angular/common/locales/es-CO';
import {
  provideRouter, withComponentInputBinding, withInMemoryScrolling, withViewTransitions,
} from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor, errorInterceptor } from './core/interceptors';

// Toda la interfaz esta en espanol y los precios en pesos. Sin registrar el
// locale, el pipe `date` formatea en en-US: "February 20, 2026".
registerLocaleData(localeEsCO);

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: LOCALE_ID, useValue: 'es-CO' },
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(
      routes,
      // Permite recibir params de ruta como @Input() en los componentes.
      withComponentInputBinding(),
      // Al navegar, vuelve arriba; respeta el ancla si la hay.
      withInMemoryScrolling({ scrollPositionRestoration: 'top', anchorScrolling: 'enabled' }),
      // La tarjeta de una oferta crece hasta su detalle (y vuelve). Donde el
      // navegador no lo soporta, la navegación es la de siempre.
      withViewTransitions({ skipInitialTransition: true }),
    ),
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
  ],
};
