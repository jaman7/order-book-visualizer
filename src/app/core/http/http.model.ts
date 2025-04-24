import { HttpHeaders } from '@angular/common/http';

export type HttpObserveType = 'body' | 'events' | 'response';

export interface IParams {
  [param: string]: number | number[] | string | string[] | boolean | boolean[];
}

export class HttpOptions {
  headers?: HttpHeaders | { [header: string]: string | string[] };

  observe?: 'body';

  params?: IParams;

  reportProgress?: boolean;

  responseType?: 'json';

  withCredentials?: boolean;

  forceRefresh?: boolean;

  retries?: number;

  useFullUrl?: boolean;

  timeout?: number;
}

export class HttpRequestOptions<T = unknown> {
  body?: T;

  headers?: HttpHeaders | { [header: string]: string | string[] };

  params?: {
    [param: string]: string | string[];
  };

  observe?: HttpObserveType;

  reportProgress?: boolean;

  responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';

  withCredentials?: boolean;
}
