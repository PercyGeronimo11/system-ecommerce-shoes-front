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
  modalRef: NgbModal | null=null;

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

  deleteProduct(id: number): void {
    this.productService.deleteProduct(id).subscribe(
      () => {
        //this.getProducts(); // Refresh the list after deletion
      },
      (error) => {
        console.error('Error deleting product', error);
      }
    );
  }

  openModalCreateProduct(){
    this.modalService.open(ProductCreateComponent);
  }
}
