import { CommonModule } from '@angular/common'; // Importa CommonModule para directivas comunes de Angular
import { Component } from '@angular/core';

@Component({
  selector: 'app-ecommerce',
  standalone: true,
  imports: [CommonModule], // Asegúrate de importar los módulos necesarios
  templateUrl: './ecommerce.component.html',
  styleUrls: ['./ecommerce.component.scss']
})
export class EcommerceComponent {
  products = [
    {
      name: 'Producto 1',
      description: 'Descripción del producto 1',
      price: 29.99,
      image: 'path_to_image/product1.jpg'
    },
    {
      name: 'Producto 2',
      description: 'Descripción del producto 2',
      price: 39.99,
      image: 'path_to_image/product2.jpg'
    },
    // Añade más productos según sea necesario
  ];

  constructor() {}

  addToCart(product: any): void {
    console.log('Producto agregado al carrito', product);
  }
}
