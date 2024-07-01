import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// const routes: Routes = [
//     {
//       path: '',
//       children: [
//         {
//           path: 'list',
//           loadComponent: () => import('./product-list/product-list.component').then(m => m.ProductListComponent)
//         },
//         {
//           path: 'create', // Change 'createa' to 'create' for consistency
//           loadComponent: () => import('./product-create/product-create.component').then(mod => mod.ProductCreateComponent) // Use mod instead of m
//         },
//       ]
//     }
//   ];
  
const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'list',
                loadComponent: () => import('./product-list/product-list.component')
            },
            {
                path: 'create',
                loadComponent: () => import('./product-create/product-create.component')
            },
        ]
    }
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProductRoutingModule { }


