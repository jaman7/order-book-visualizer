import { AppState, selectLanguageState } from '../core.state';
import { DEFAULT_LANGUAGE, INITIAL_PARTIALS } from './language.config';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import buildEnvironment from '@env/build-environment';
import { Store, select } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable, forkJoin, Subscription, of, lastValueFrom } from 'rxjs';
import { catchError, distinctUntilChanged, filter, map, tap } from 'rxjs/operators';

@Injectable()
export class LanguageService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private translations: { [key: string]: any } = {};

  private downloadedPartials = new Set<string>();

  private initialPartials = new Set<string>(INITIAL_PARTIALS);

  constructor(
    private translate: TranslateService,
    private store: Store<AppState>,
    private http: HttpClient
  ) {}

  setTranslateLanguage$: Observable<string> = this.store.pipe(
    select(selectLanguageState),
    distinctUntilChanged(),
    filter(Boolean),
    tap(language => {
      this.translate.use(language || DEFAULT_LANGUAGE);
      this.loadTranslations([...this.initialPartials]);
    })
  );

  loadTranslations(partials: string[] = []): Promise<boolean> {
    if (!partials.length) return Promise.resolve(true);
    return lastValueFrom(
      forkJoin(partials.map(partial => this.fetchTranslation(partial))).pipe(
        map(() => true),
        catchError(() => of(true))
      )
    );
  }

  private fetchTranslation<T>(partial: string, lang: string = this.translate.currentLang): Observable<T> {
    if (this.downloadedPartials.has(partial)) return of(null);
    this.downloadedPartials.add(partial);
    const buildTimestamp = new Date(buildEnvironment.buildTimestamp).getTime();
    return this.http.get<T>(`assets/i18Local/${lang}/${partial}.json?v=${buildTimestamp}`).pipe(
      tap(response => {
        const translations = {
          ...this.translate.translations[lang],
          ...this.translations[lang],
          ...response,
        };
        this.translations[lang] = translations;
        this.translate.setTranslation(lang, translations);
      }),
      catchError(error => {
        console.error(`Failed to load partial ${partial}:`, error);
        return of(null);
      })
    );
  }

  init(): Subscription {
    return this.setTranslateLanguage$.subscribe();
  }
}
