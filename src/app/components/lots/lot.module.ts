import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LotRoutingModule } from "./lot-routing.module";
import { FormsModule } from '@angular/forms';


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