import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from "./product-routing.module";
import { FormsModule } from '@angular/forms';
import { ProductListComponent } from './product-list/product-list.component';


@NgModule({
    declarations: [
    ],
    imports: [
      CommonModule, 
      ProductRoutingModule,
      FormsModule
    ]
  })
export class ProductModule{}