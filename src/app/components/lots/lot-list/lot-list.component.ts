import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { LotModel } from '../../../models/lot.model';
import { LotService } from '../../../services/lot.service';
import { RouterModule, Router } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import {LotCreateComponent} from '../lot-create/lot-create.component';
import { LotEditComponent } from '../lot-edit/lot-edit.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductCreateReq, ProductModel } from '../../../models/product.model';
import { ProductService } from '../../../services/product.service';
import { CategoriaService } from '../../categories/service/categories.service';
import { BrowserModule } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {CategoryModel} from '../../../models/category.model';

@Component({
  selector: 'app-lot-list',
  standalone: true,
  imports: [RouterModule,SharedModule],
  templateUrl: './lot-list.component.html',
  styleUrl: './lot-list.component.scss'
})

export class LotListComponent implements OnInit{
  lots: LotModel[] = [];
  isLoading = false;
  error: string | null = null;
//  modalRef: NgbModal | null=null;
  products: ProductModel[]=[];
  
  constructor( 
    private lotService: LotService,
    private productService: ProductService,
    private modalService: NgbModal,
    private router: Router
  ) {}

  ngOnInit() {
    this.getListLots();
    this.getListProducts();
  }

  getListLots(){
    this.isLoading = true;
    this.lotService.getLots()
      .subscribe((lots: any )=> {
        this.lots = lots.data.content;
        this.isLoading = false;
        //console.log("data:", lots);
      }, error => {
        this.error = error.message;
        this.isLoading = false;
        console.log("error:", error);
      });
  }

  getListProducts(){
    this.productService.getProducts()
    .subscribe(
      (data: ProductModel[])=>{
        this.products=data;
      },
      (error)=>{
        this.error=error.message;
        console.log("Error de traer lista de productos",error);
      }
    )
  }

  deleteLot(id: number): void {
    this.lotService.deleteLot(id).subscribe(
      () => {
        //this.getLots(); // Refresh the list after deletion
      },
      (error) => {
        console.error('Error deleting lot', error);
      }
    );
  }
}

