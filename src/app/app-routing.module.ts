import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProductDetailComponent } from 'src/app/components/ecommerce/product-detail/product-detail.component'; // Asegúrate de que la ruta sea correcta
import { AuthGuard } from './components/auth/auth.guard';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: '/ecommers',
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
        loadComponent: () => import('./components/materials/materials-create/materials-create.component').then(m => m.MaterialCreateModule),canActivate: [AuthGuard]
      },
      {
        path: 'materialEdit/:id',
        loadComponent: () => import('./components/materials/materials-edit/materials-edit.component').then(m => m.MaterialEditModule),canActivate: [AuthGuard]
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
        loadComponent: () => import('./components/promotions/promotions-list/promotions-list.component').then(p => p.PromotionsListComponent),canActivate: [AuthGuard]
      },
      {
        path: 'promotions/:id',
        loadComponent: () => import('./components/promotions/promotions-list/promotions-list.component').then(p => p.PromotionsListComponent),canActivate: [AuthGuard]
      },
      {
        path: 'categories',
        loadComponent: () => import('./components/categories/categories-list/categories-list.component').then(c => c.CategoriesListComponent),canActivate: [AuthGuard]
      },
      {
        path: 'categories/:id',
        loadComponent: () => import('./components/categories/categories-list/categories-list.component').then(c => c.CategoriesListComponent),canActivate: [AuthGuard]
      },
      {
        path: 'products',
        loadChildren: () => import('./components/products/product.module').then(m => m.ProductModule),canActivate: [AuthGuard]
      },
      {
        path: 'lots',
        loadChildren: () => import('./components/lots/lot.module').then(m => m.LotModule),canActivate: [AuthGuard]
      },
      {
        path: 'customers',
        loadComponent: () => import('./components/customers/customers-list/customers-list.component').then(cu => cu.CustomerListModule),canActivate: [AuthGuard]
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
      },
  

    ]
  },
  { path: 'product/:id', component: ProductDetailComponent },
  {
    path: '',
    component: GuestComponent,
    children: [
      {
        path: 'auth/signup',
        loadComponent: () => import('./demo/authentication/sign-up/sign-up.component')
      },
      {
        path: 'login',
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
