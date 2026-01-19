import { ApplicationConfig, importProvidersFrom, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withDebugTracing } from '@angular/router';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LoadingInterceptor } from './interceptors/loading.interceptor';
import { CorsInterceptor } from './interceptors/cors.interceptor';
import { provideNgxStripe, STRIPE_PUBLISHABLE_KEY } from 'ngx-stripe';
import { registerLocaleData } from '@angular/common';

import localeFrCM from '@angular/common/locales/fr-CM';

registerLocaleData(localeFrCM);
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    { provide: LOCALE_ID, useValue: 'fr-CM' },
    importProvidersFrom([
      TranslateModule.forRoot({
        loader: {
            provide: TranslateLoader,
            useFactory: (createTranslateLoader),
            deps: [HttpClient]
        },
        defaultLanguage: 'fr',
      })  
    ]),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true
    },
    { provide: HTTP_INTERCEPTORS, useClass: CorsInterceptor, multi: true },
    provideNgxStripe('pk_test_51QydBnP1JVeVCDSKAwmszQbjui4iRexbdPLeWmfYwoXpQayltVXrUXwKUPaxyr9pZQq5Yd6GOYibpoZ54L36g0Id00KKkJF9wH')
  ],

};
