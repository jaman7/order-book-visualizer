import { metaReducers, reducers } from './core.state';
import { HttpClientModule } from './http/httpclient.module';
import { MissingTranslation } from './language/language-missing-translation.handler';
import { LanguageService } from './language/language.service';
import { LanguageEffects } from './language/store';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import buildEnvironment from '@env/build-environment';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { MissingTranslationHandler, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(
    http,
    'assets/i18Local/',
    `.json?v=${buildEnvironment?.buildTimestamp ? new Date(buildEnvironment.buildTimestamp ?? null).getTime() : ''}`
  );
}

export function initializeLanguageService(languageService: LanguageService) {
  return (): void => {
    languageService.init();
  };
}

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    StoreRouterConnectingModule.forRoot(),
    StoreModule.forRoot(reducers, { metaReducers }),
    StoreDevtoolsModule.instrument({
      maxAge: 10,
    }),
    EffectsModule.forRoot([LanguageEffects]),
    TranslateModule.forRoot({
      missingTranslationHandler: { provide: MissingTranslationHandler, useClass: MissingTranslation },
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  declarations: [],
  providers: [
    LanguageService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeLanguageService,
      deps: [LanguageService],
      multi: true,
    },
  ],
  exports: [TranslateModule, HttpClientModule],
})
export class TranslateCoreModule {}
