import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LotCreateComponent } from './lot-create/lot-create.component';
import { LotListComponent } from './lot-list/lot-list.component';
import { LotEditComponent } from './lot-edit/lot-edit.component';
  
const routes: Routes = [
    {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
    },
    {
        path: 'list',
        component: LotListComponent
    },
    {
        path: 'create',
        component: LotCreateComponent
    },
    {
        path: 'edit/:id',
        component: LotEditComponent
    }
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LotRoutingModule { }


