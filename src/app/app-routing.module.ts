// Angular Import
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './components/auth/auth.guard';

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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
