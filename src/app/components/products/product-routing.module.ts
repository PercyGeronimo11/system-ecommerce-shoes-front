import { NgModule } from '@angular/core';
import {RouterModule,Routes} from '@angular/router';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductCreateComponent } from './product-create/product-create.component';

const routes: Routes=[
    {
        path:'',
        children:[
            {
                path:'list',
                component:ProductListComponent
            },
            {
                path:"create",
                component:ProductCreateComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProductRoutingModule{}


