import { HttpOptions, HttpRequestOptions, IParams } from './http.model';
import { toHttpParams } from './http.utils';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment as env } from '@env/environment';
import { Observable, throwError } from 'rxjs';

@Injectable()
export abstract class HttpService {
  constructor(public http: HttpClient) {}

  private createUrl(url: string, useFullUrl: boolean): string {
    return useFullUrl ? url : env.SERVER_API_URL + url;
  }

  protected get<T>(url: string, options: HttpOptions = {}, useFullUrl: boolean = false): Observable<T> {
    const finalUrl = this.createUrl(url, useFullUrl);
    return this.http.get<T>(finalUrl, {
      ...options,
      params: toHttpParams(options.params as IParams),
    });
  }

  protected post<T>(url: string, data: T, options: HttpOptions = {}, useFullUrl: boolean = false): Observable<T> {
    const finalUrl = this.createUrl(url, useFullUrl);
    return this.http.post<T>(finalUrl, data, {
      ...options,
      params: toHttpParams(options.params as IParams),
    });
  }

  protected patch<T>(url: string, data: T, options: HttpOptions = {}, useFullUrl: boolean = false): Observable<T> {
    const finalUrl = this.createUrl(url, useFullUrl);
    return this.http.patch<T>(finalUrl, data, {
      ...options,
      params: toHttpParams(options.params as IParams),
    });
  }

  protected put<T>(url: string, data: T, options: HttpOptions = {}, useFullUrl: boolean = false): Observable<T> {
    const finalUrl = this.createUrl(url, useFullUrl);
    return this.http.put<T>(finalUrl, data, {
      ...options,
      params: toHttpParams(options.params as IParams),
    });
  }

  protected delete<T>(url: string, options: HttpOptions = {}, useFullUrl: boolean = false): Observable<T> {
    const finalUrl = this.createUrl(url, useFullUrl);
    return this.http.delete<T>(finalUrl, {
      ...options,
      params: toHttpParams(options.params as IParams),
    });
  }

  protected response<T>(method: string, url: string, options: HttpRequestOptions = {}, useFullUrl: boolean = false): Observable<T> {
    const finalUrl = this.createUrl(url, useFullUrl);

    return this.http.request(method, finalUrl, {
      ...options,
      body: options.body,
      params: toHttpParams(options.params as IParams),
    });
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('API call error:', error);
    return throwError('An error occurred while communicating with the server.');
  }
}
