import { Route } from '@angular/router';



export const routes: Route[] = [
  {
    path: 'dapp',
    loadChildren: () => import('./dapp/dapp.module').then(m => m.DappModule),
  },
  {
    path: '',
    redirectTo: 'dapp',
    pathMatch: 'full',
  }
];
