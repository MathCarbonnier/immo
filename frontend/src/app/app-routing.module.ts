import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BienListComponent } from './containers/bien-list/bien-list.component';
import { BienDetailComponent } from './containers/bien-detail/bien-detail.component';
import { BienFormComponent } from './containers/bien-form/bien-form.component';

const routes: Routes = [
  { path: '', redirectTo: 'biens', pathMatch: 'full' },
  { path: 'biens', component: BienListComponent },
  { path: 'biens/new', component: BienFormComponent },
  { path: 'biens/:id/edit', component: BienFormComponent },
  { path: 'biens/:id', component: BienDetailComponent },
  { path: '**', redirectTo: 'biens' } // Catch-all route for any undefined routes
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
