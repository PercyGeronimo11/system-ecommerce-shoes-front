import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LotRoutingModule } from "./lot-routing.module";
import { FormsModule } from '@angular/forms';
import { LotListComponent } from './lot-list/lot-list.component';


@NgModule({
    declarations: [
    ],
    imports: [
      CommonModule, 
      LotRoutingModule,
      FormsModule
    ]
  })
export class LotModule{}