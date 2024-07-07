import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Product } from '../../models/product/product.model';
import { ProductService } from '../../services/products/product.service';
import { Router } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-ecommerce',
  standalone: true,
  imports: [CommonModule,SharedModule, RouterModule],

  templateUrl: './ecommerce.component.html',
  styleUrls: ['./ecommerce.component.scss']
})
export class EcommerceComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  isLoading = false;
  error: string | null = null;

  slides = [
    { image: 'assets/images/baner1.jpg', caption: '', description: '' },
    { image: 'assets/images/baner2.jpg', caption: '', description: '' },
  ];
  currentSlide = 0;
  slideInterval: any;

  constructor(private productService: ProductService,

    private router: Router
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.productService.getProducts()
      .subscribe((products: any) => {
        this.products = products.data.content;
        this.isLoading = false;
        console.log("data:", products);
      }, error => {
        this.error = error.message;
        this.isLoading = false;
        console.log("error:", error);
      });

    this.startAutoSlide();
  }

  ngOnDestroy() {
    clearInterval(this.slideInterval);
  }

  addToCart(product: any): void {
    console.log('Producto agregado al carrito', product);
  }

  previousSlide(event: Event) {
    event.preventDefault();
    this.currentSlide = (this.currentSlide === 0) ? this.slides.length - 1 : this.currentSlide - 1;
  }

  nextSlide(event: Event) {
    event.preventDefault();
    this.currentSlide = (this.currentSlide === this.slides.length - 1) ? 0 : this.currentSlide + 1;
  }

  startAutoSlide() {
    this.slideInterval = setInterval(() => {
      this.currentSlide = (this.currentSlide === this.slides.length - 1) ? 0 : this.currentSlide + 1;
    }, 3000); // Cambia la imagen cada 5 segundos
  }
}
