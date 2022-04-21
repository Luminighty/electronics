import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ChipsComponent } from './chips/chips.component';


const routes: Routes = [{
  path: "chips",
  component: ChipsComponent,
}, {
  path: '**',
  redirectTo: '/chips'
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
