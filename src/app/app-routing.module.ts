// Angular Import
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './components/auth/auth.guard';
//import { ProductListComponent } from './components/products/product-list/product-list.component';
// import { ProductCreateComponent } from './components/products/product-create/product-create.component';
// import { ProductEditComponent } from './components/products/product-edit/product-edit.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// project import
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';
import { MaterialEditModule } from './components/materials/materials-edit/materials-edit.component';

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
        loadComponent: () => import('./demo/dashboard/dash-analytics.component'),canActivate: [AuthGuard]
      },
      {
        path: 'materials',
        loadComponent: () => import('./components/materials/materials-list/materials-list.component').then(m => m.MaterialsListModule),canActivate: [AuthGuard]
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
        loadComponent: () => import('./components/users/users-list/users-list.component').then(m => m.UsersListModule),canActivate: [AuthGuard]
      },
      {
        path: 'userCreate',
        loadComponent: () => import('./components/users/users-create/users-create.component').then(m => m.UsersCreateModule)
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
        path: 'categoriaCreate',
        loadComponent: () => import('./components/categories/categories-create/categories-create.component').then(c => c.CategoriaCreateModule)
      },
      {
        path: 'categories',
        loadComponent: () => import('./components/categories/categories-list/categories-list.component').then(c => c.CategoriesListComponent)
      },
      {
        path: 'products',
        loadChildren: () => import('./components/products/product.module').then(m => m.ProductModule)
      },
      {
        path: 'promocionEdit/:id',
        loadComponent: () => import('./components/promotions/promotions-edit/promotions-edit.component').then(m => m.PromocionEditModule)
      },
      {
        path: 'promotions/:id',
        loadComponent: () => import('./components/promotions/promotions-list/promotions-list.component').then(m => m.PromotionsListComponent)
      },
      {
        path: 'categoriaEdit/:id',
        loadComponent: () => import('./components/categories/categories-edit/categories-edit.component').then(c => c.CategoriaEditModule)
      },
      {
        path: 'categories/:id',
        loadComponent: () => import('./components/categories/categories-list/categories-list.component').then(c => c.CategoriesListComponent)
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
];

@NgModule({
  imports: [NgbModule, RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
