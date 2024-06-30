// angular import
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product/product.model';
import { ProductService } from '../../services/products/product.service';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, SharedModule],
  //imports: [SharedModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export default class ProductListComponent {

   products: Product[]=[];
   error: any;
   constructor(private productService: ProductService) { }

   ngOnInit() {
    this.productService.getProducts()
      .subscribe(
        (data) => this.products = data,
        (error) => this.error = error
      );
  }

  //  ngOnInit(): void {
  //    this.productService.getProducts().subscribe(data => {
  //      this.products = data;
  //    });
  //  }

  // getProducts(): void {
  //   this.productService.getProducts().subscribe(
  //     (data: Product[]) => {
  //       this.products = data;
  //     },
  //     (error) => {
  //       console.error('Error fetching products', error);
  //     }
  //   );
  // }

  // deleteProduct(id: number): void {
  //   this.productService.deleteProduct(id).subscribe(
  //     () => {
  //       this.getProducts(); // Refresh the list after deletion
  //     },
  //     (error) => {
  //       console.error('Error deleting product', error);
  //     }
  //   );
  // }
}



