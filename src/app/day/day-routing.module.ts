import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DayPage } from './day.page';
import { Day } from '../model/day';

const routes: Routes = [
  {
    path: '',
    component: DayPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DayPageRoutingModule {}
