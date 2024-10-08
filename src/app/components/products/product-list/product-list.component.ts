import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ProductModel } from '../../../models/product.model';
import { ProductService } from '../../../services/product.service';
import { RouterModule, Router } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import {ProductCreateComponent} from '../product-create/product-create.component';
import { ProductEditComponent } from '../product-edit/product-edit.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-product-list',
  standalone:true,
  imports: [RouterModule,SharedModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})

export class ProductListComponent implements OnInit {
  products: ProductModel[] = [];
  isLoading = false;
  error: string | null = null;
  selectedProduct: any = null;
  modalRef: NgbModal | null=null;
  demandPrediction:any;
  nameProduct:any;
  modalPredictionVisible = false;

  constructor( 
    private productService: ProductService,
    private modalService: NgbModal,
    private router: Router
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.productService.getProducts()
      .subscribe((products: any )=> {
        this.products = products.data.content;
        this.isLoading = false;
        console.log("data:", products);
      }, error => {
        this.error = error.message;
        this.isLoading = false;
        console.log("error:", error);
      });
  }

  openModalCreateProduct(){
    this.modalService.open(ProductCreateComponent);
  }

  closePredictionModal(){
    this.modalPredictionVisible=false;
  }

  PredictDemandProduct(idProduct:any, nameProduct:any){
    const today = new Date();
  
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1);
    
    const year = nextMonth.getFullYear();
    const month = nextMonth.getMonth() + 1;
    var data = {
      "product_id":idProduct,
      "year": year,
      "month": month,
    };

    this.productService.productDemandPrediction(data).subscribe(
      (resp: any) => {
        this.modalPredictionVisible=true;
        this.nameProduct = nameProduct;
        this.demandPrediction = Math.round(resp.prediction);
      },
      (error) => {
        console.error('Error predict demanding this product', error);
      }
    )
  }
}
