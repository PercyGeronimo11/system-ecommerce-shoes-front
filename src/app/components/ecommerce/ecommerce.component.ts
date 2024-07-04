import { CommonModule } from '@angular/common'; // Importa CommonModule para directivas comunes de Angular
import { Component } from '@angular/core';
import { Product } from '../../.../../models/product/product.model';
import { ProductService } from '../../.../../services/products/product.service';


@Component({
  selector: 'app-ecommerce',
  standalone: true,
  imports: [CommonModule], // Asegúrate de importar los módulos necesarios
  templateUrl: './ecommerce.component.html',
  styleUrls: ['./ecommerce.component.scss']
})

export class EcommerceComponent {


  constructor(private productService: ProductService) {}


  products: Product[] = [];
  isLoading = false;
  error: string | null = null;
  
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
  addToCart(product: any): void {
    console.log('Producto agregado al carrito', product);
  } 


  
}
