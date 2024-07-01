// Angular Import
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// project import
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: '/analytics',
        pathMatch: 'full'
      },
      {
        path: 'analytics',
        loadComponent: () => import('./demo/dashboard/dash-analytics.component')
      },
      {
        path: 'materials',
        loadComponent: () => import('./components/materials/materials-list/materials-list.component').then(m => m.MaterialsListModule)
      },
      {
        path: 'materialCreate',
        loadComponent: () => import('./components/materials/materials-create/materials-create.component').then(m => m.MaterialCreateModule)
      },

      {
        path: 'promotions',
        loadComponent: () => import('./components/promotions/promotions-list/promotions-list.component').then(m => m.PromotionsListComponent)
      },
      {
        path: 'promocionCreate',
        loadComponent: () => import('./components/promotions/promotions-create/promotions-create.component').then(p => p.PromocionCreateModule)
      },
      {
        path: 'promocionEdit/:id',
        loadComponent: () => import('./components/promotions/promotions-edit/promotions-edit.component').then(p => p.PromocionEditModule)
      },

      {
        path: 'promotions/:id',
        loadComponent: () => import('./components/promotions/promotions-list/promotions-list.component').then(m => m.PromotionsListComponent)
      },

      {
        path: 'component',
        loadChildren: () => import('./demo/ui-element/ui-basic.module').then((m) => m.UiBasicModule)
      },
      {
        path: 'chart',
        loadComponent: () => import('./demo/chart & map/core-apex.component')
      },
      {
        path: 'forms',
        loadComponent: () => import('./demo/forms & tables/form-elements/form-elements.component')
      },
      {
        path: 'tables',
        loadComponent: () => import('./demo/forms & tables/tbl-bootstrap/tbl-bootstrap.component')
      },
      {
        path: 'sample-page',
        loadComponent: () => import('./demo/sample-page/sample-page.component')
      }
    ]
  },
  {
    path: '',
    component: GuestComponent,
    children: [
      {
        path: 'auth/signup',
        loadComponent: () => import('./demo/authentication/sign-up/sign-up.component')
      },
      {
        path: 'auth/signin',
        loadComponent: () => import('./demo/authentication/sign-in/sign-in.component')
      }
    ]
  }
];

@NgModule({
  imports: [NgbModule, RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
