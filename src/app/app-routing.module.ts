import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
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
        path: 'materialEdit/:id',
        loadComponent: () => import('./components/materials/materials-edit/materials-edit.component').then(m => m.MaterialEditModule)
      },
      {
        path: 'users',
        loadComponent: () => import('./components/users/users-list/users-list.component').then(m => m.UsersListModule)
      },
      {
        path: 'userCreate',
        loadComponent: () => import('./components/users/users-create/users-create.component').then(m => m.UsersCreateModule)
      },

      {
        path: 'promotions',
        loadComponent: () => import('./components/promotions/promotions-list/promotions-list.component').then(p => p.PromotionsListComponent)
      },
      {
        path: 'promotions/:id',
        loadComponent: () => import('./components/promotions/promotions-list/promotions-list.component').then(p => p.PromotionsListComponent)
      },
      {
        path: 'categories',
        loadComponent: () => import('./components/categories/categories-list/categories-list.component').then(c => c.CategoriesListComponent)
      },
      {
        path: 'categories/:id',
        loadComponent: () => import('./components/categories/categories-list/categories-list.component').then(c => c.CategoriesListComponent)
      },
      {
        path: 'products',
        loadChildren: () => import('./components/products/product.module').then(m => m.ProductModule)
      },
      {
        path: 'lots',
        loadChildren: () => import('./components/lots/lot.module').then(m => m.LotModule)
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
        loadComponent: () => import('./components/auth/sign-in/sign-in.component')
      }
    ]
  },
  {
    path: 'ecommers',
    loadComponent: () => import('./components/ecommerce/base-layout.component').then(p => p.EcommercePlantilla)
  } // Ruta independiente para EcommerceComponent
  ,{
    path: 'ecommersCreate',
    loadComponent: () => import('./components/ecommerce/users-eco-ingreso/users-eco-ingreso.component').then(e => e.EcommersIngresoModule)
  }
  ,{
    path: 'ecommersCliente',
    loadComponent: () => import('./components/ecommerce/users-eco-create/users-eco-create.component').then(e => e.UsersEcoCreateComponent)
  }
];

@NgModule({
  imports: [
    NgbModule,
    RouterModule.forRoot(routes)],
  exports: [RouterModule,]
})
export class AppRoutingModule {

 }
