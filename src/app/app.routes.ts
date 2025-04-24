import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'order-book',
    loadComponent: () => import('./components/order-book/order-book-page/order-book-page.component').then(m => m.OrderBookPageComponent),
  },
  {
    path: '',
    redirectTo: 'order-book',
    pathMatch: 'full',
  },
];
