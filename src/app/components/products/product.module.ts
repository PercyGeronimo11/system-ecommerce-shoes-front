import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from "./product-routing.module";
import ProductCreateComponent from './product-create/product-create.component';
import { FormsModule } from '@angular/forms';


@NgModule({
    declarations: [
      ProductCreateComponent
    ],
    imports: [
      CommonModule, 
      ProductRoutingModule,
      FormsModule
    ]
  })
export class ProductModule{}