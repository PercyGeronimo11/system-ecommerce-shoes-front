import { Component, OnInit } from '@angular/core';
import { Product } from '../../../models/product/product.model';
import { ProductService } from '../../../services/products/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export default class ProductListComponent implements OnInit {

  products: Product[]=[];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(): void {
    this.productService.getProducts().subscribe(
      (data: Product[]) => {
        this.products = data;
      },
      (error) => {
        console.error('Error fetching products', error);
      }
    );
  }

  deleteProduct(id: number): void {
    this.productService.deleteProduct(id).subscribe(
      () => {
        this.getProducts(); // Refresh the list after deletion
      },
      (error) => {
        console.error('Error deleting product', error);
      }
    );
  }
}
