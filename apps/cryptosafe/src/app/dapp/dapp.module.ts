import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';
import { DappComponent } from './dapp.component';
import { MaterialModule } from '@deadchain/shared';

export const routes: Route[] = [
  {
    path: '',
    component: DappComponent,
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,

    RouterModule.forChild(routes),
  ],
  declarations: [
    DappComponent,
  ],
  exports: []
})
export class DappModule {}
