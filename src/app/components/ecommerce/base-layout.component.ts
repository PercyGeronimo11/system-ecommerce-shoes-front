import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductModel } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { RouterModule } from '@angular/router';
//import { PromocionService } from '../promotions/service/promotions.service';
import { AuthService } from '../../components/auth/service/auth.service';
import { FormBuilder, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-base-layout',
  standalone: true,
  imports: [RouterModule,CommonModule,SharedModule],
  templateUrl: './base-layout.component.html',
  styleUrls: ['./base-layout.component.scss']
})
export class EcommercePlantilla implements OnInit, OnDestroy {
  products: ProductModel[] = [];
  isLoading = false;
  error: string | null = null;
  categoria: number = 0;
  numberForm: FormGroup;
  slides = [
    { image: 'assets/images/baner1.jpg', caption: '', description: '' },
    { image: 'assets/images/baner2.jpg', caption: '', description: '' },
  ];
  currentSlide = 0;
  slideInterval: any;

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private productService: ProductService,
    //private promotionService:PromocionService,

    private router: Router
  ) {
    this.numberForm = this.fb.group({
      idcategoria: [0]
    });



  }
  ngOnInit(): void {
    this.getProducts();
    this.categoria == 0

  }

  onSubmit(): void {
    this.categoria = this.numberForm.get('idcategoria')?.value || 0;
    this.  ngOnInit();
  }

  getProducts(): void {
    this.isLoading = true;
    if (this.categoria == 0) {
      this.productService.getProducts()
        .subscribe(
          (products: any) => {
            this.products = products.data.content;
            this.isLoading = false;
            console.log("Todos los productos cargados:", products);
          },
          error => {
            this.error = error.message;
            this.isLoading = false;
            console.error("Error al cargar todos los productos:", error);
          }
        );
    } else {
      this.productService.getProductsByCategory(this.categoria)
        .subscribe(
          (products: any) => {
            this.products = products.data.content;
            this.isLoading = false;
            console.log("Productos filtrados por categoría:", products);
          },
          error => {
            this.error = error.message;
            this.isLoading = false;
            console.error("Error al cargar productos por categoría:", error);
          }
        );
    }
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
  logout(): void {
    this.authService.logout();
  }





}
