import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpService } from '@app/core/http/http.service';
import { transformRawSnapshot } from './order-book.utils';

@Injectable({ providedIn: 'root' })
export class OrderBookService extends HttpService {
  getOrderBook(): Observable<any> {
    return this.response<string>('get', '/api/bigxyt/assets/files/sample.json', { responseType: 'text' }, true).pipe(
      map((response: string) =>
        response
          .split('\n')
          .filter((el: string) => el.trim())
          .map((line: string) => JSON.parse(line))
      )
    );
  }
}
