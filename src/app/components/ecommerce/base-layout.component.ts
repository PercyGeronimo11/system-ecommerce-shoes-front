// src/app/components/ecommerce/ecommerce-plantilla.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { AuthService } from '../../components/auth/service/auth.service';
import { ProductModel } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { SharedDataService } from '../../services/shared-data.service';
import { CategoriaService } from '../../services/categories.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-base-layout',
  standalone: true,
  imports: [RouterModule, CommonModule, SharedModule],
  templateUrl: './base-layout.component.html',
  styleUrls: ['./base-layout.component.scss']
})
export class EcommercePlantilla implements OnInit, OnDestroy {
  loginResponse: any;
  products: ProductModel[] = [];
  categories: any = [];
  NameCate: any = [];
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
  cartItemCount: number = 0;
  userSubscription: Subscription | undefined;
  constructor(private fb: FormBuilder,
    public categoriaService: CategoriaService,
    private authService: AuthService,
    private productService: ProductService,
    private sharedDataService: SharedDataService,
    private cartService: CartService,
    private router: Router) {
    this.numberForm = this.fb.group({
      idcategoria: [0]
    });

    this.categoriaService.list().subscribe((resp: any) => {
      this.categories = resp.data;
      console.log(this.categories);
    });
    this.startAutoSlide();
  }

  ngOnInit(): void {
    // Obtener el nombre de usuario al inicializar el componente
    this.userSubscription = this.sharedDataService.user$.subscribe(user => {
      if (user) {
        this.loginResponse = user.username;
      } else {
        this.loginResponse = 'Ingresar';
      }
    });
    this.getProducts();
    this.categoria == 0;

    // Subscribe to cart item count
    this.cartService.getCartItemCount().subscribe(count => {
      this.cartItemCount = count;
    });
  }

  onSubmit(): void {
    this.categoria = this.numberForm.get('idcategoria')?.value;
    console.log('Selected category:', this.categoria);
    this.ngOnInit();
  }

  logoutcustomer(): void {
    this.authService.logoutCustomer();
  }
  getProducts(): void {
    this.isLoading = true;
    if (this.categoria == 0) {
      this.productService.getProducts().subscribe((products: any) => {
        this.products = products.data.content;
        this.isLoading = false;
        this.NameCate = "Productos";
        console.log("Productos filtrados por categoría:", this.NameCate);
        console.log("Todos los productos cargados:", products);
      }, error => {
        this.error = error.message;
        this.isLoading = false;
        console.error("Error al cargar todos los productos:", error);
      });
    } else {
      this.productService.getProductsByCategory(this.categoria).subscribe((products: any) => {
        this.products = products.data.content;
        this.isLoading = false;
        console.log("Productos filtrados por categoría:", this.NameCate);
        console.log("Productos filtrados por categoría:", products);
      }, error => {
        this.error = error.message;
        this.isLoading = false;
        console.error("Error al cargar productos por categoría:", error);
      });
    }
  }

  ngOnDestroy() {
    clearInterval(this.slideInterval);
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
    }, 3000);
  }

  logout(): void {
    this.authService.logout();
  }

  viewProductDetail(product: ProductModel): void {
    this.router.navigate(['/product', product.id]);
  }
}
