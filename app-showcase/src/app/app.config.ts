import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { JetStreamWsService } from '@his-base/jetstream-ws';
import '@angular/compiler';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from '../environments/environment.development';
import { AngularFireModule } from '@angular/fire/compat';

export function createTranslateLoader(http: HttpClient) {

  return new TranslateHttpLoader(http, '../../assets/i18n/', '.json');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
    importProvidersFrom([
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpClient]
        },
      }),
      BrowserModule,
      BrowserAnimationsModule,
      AngularFirestoreModule,
      AngularFireModule.initializeApp(environment.firebaseConfig),
    ]),
    {
      provide: JetStreamWsService,
      useValue: new JetStreamWsService({
      // stream name
        name: 'OPD',
      }),
    },
  ],
};


