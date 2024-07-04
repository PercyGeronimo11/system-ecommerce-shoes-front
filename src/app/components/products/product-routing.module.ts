import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductCreateComponent } from './product-create/product-create.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductEditComponent } from './product-edit/product-edit.component';
  
const routes: Routes = [
    // {
    //     path: '',
    //     children: [
    //         {
    //             path: 'create',
    //             loadComponent:()=> ProductCreateComponent
    //         },
    //         {
    //             path: 'list',
    //             loadComponent: () => ProductListComponent
    //         },
    //         {
    //             path: 'edit',
    //             loadComponent: () => ProductEditComponent
    //         },
    //     ]
    // }
    {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
    },
    {
        path: 'list',
        component: ProductListComponent
    },
    {
        path: 'create',
        component: ProductCreateComponent
    },
    {
        path: 'edit',
        component: ProductEditComponent
    }
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProductRoutingModule { }


