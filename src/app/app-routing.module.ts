// Angular Import
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
//import { ProductListComponent } from './components/products/product-list/product-list.component';
import { ProductCreateComponent } from './components/products/product-create/product-create.component';
import { ProductEditComponent } from './components/products/product-edit/product-edit.component';

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
        // path: 'products',
        // loadComponent: () => import('./demo/products/product-list.component')
        path: 'materials',
        loadComponent: () => import('./components/materials/materials-list/materials-list.component').then(m => m.MaterialsListModule)
      },
      {
        path: 'materialCreate',
        loadComponent: () => import('./components/materials/materials-create/materials-create.component').then(m => m.MaterialCreateModule)
      },
      {
        path: 'products',
        loadChildren: () => import('./components/products/product.module').then(m => m.ProductModule)
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
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
