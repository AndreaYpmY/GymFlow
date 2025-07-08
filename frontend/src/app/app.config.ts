import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { registerLocaleData, CommonModule } from '@angular/common';
import { provideHttpClient, withFetch, withXsrfConfiguration } from '@angular/common/http';
import localeIt from '@angular/common/locales/it';
import { LOCALE_ID } from '@angular/core';
import { routes } from './app.routes';
registerLocaleData(localeIt, 'it-IT');


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), // Importa le rotte definite in app.routes.ts
    provideHttpClient(
      withFetch(), // Usa fetch per le richieste HTTP
      withXsrfConfiguration({ cookieName: 'XSRF-TOKEN', headerName: 'X-XSRF-TOKEN' }) 
    ),
    { provide: LOCALE_ID, useValue: 'it-IT' }, // Imposta la localizzazione italiana
  ]
};