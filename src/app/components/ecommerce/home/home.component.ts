import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, RouterModule,NavigationEnd, ActivatedRoute } from '@angular/router';
import { CartService } from '../../../services/cart.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { AuthService } from '../../../components/auth/service/auth.service';
import { ProductModel } from '../../../models/product.model';
import { ProductService } from '../../../services/product.service';
import { SharedDataService } from '../../../services/shared-data.service';
import { CategoriaService } from '../../../services/categories.service';
import { Subscription } from 'rxjs';
import { EcommercePlantilla } from '../base-layout.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule, SharedModule, EcommercePlantilla],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  loginResponse: any;
  products: ProductModel[] = [];
  recommendedProducts: ProductModel[] = [];
  categories: any[] = [];
  NameCate: string = '';
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
  currentRoute: string = '';
  showRecommendations: boolean = false; // Flag para controlar la vista

  constructor(
    private fb: FormBuilder,
    public categoriaService: CategoriaService,
    private authService: AuthService,
    private productService: ProductService,
    private sharedDataService: SharedDataService,
    private cartService: CartService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.numberForm = this.fb.group({
      idcategoria: [0]
    });

    // Load categories
    this.categoriaService.list().subscribe((resp: any) => {
      this.categories = resp.data;
      console.log(this.categories);
    });

    this.startAutoSlide();
    // Detect route changes
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url;
        this.loadProducts();
      }
    });
  }

  ngOnInit(): void {
    // Initialize login response
    this.loginResponse = 'Ingresar';
    console.log(localStorage.getItem('usernamecustomer'));
    if(localStorage.getItem('usernamecustomer')!=null){
      this.loginResponse=localStorage.getItem('usernamecustomer');
    }

    //this.getProducts();
    //this.getRecommendedProducts()

    this.route.queryParams.subscribe(params => {
      if (params['recommendations']) {
        this.getRecommendedProducts();
      } else {
        this.getProducts();
      }
    });

    this.cartService.getCartItemCount().subscribe(count => {
      this.cartItemCount = count;
    });
  }


  loadProducts(): void {
    if (this.showRecommendations) {
      this.getRecommendedProducts();
    } else {
      this.getProducts();
    }
  }

  onSubmit(): void {
    this.categoria = this.numberForm.get('idcategoria')?.value || 0;
    console.log('Selected category:', this.categoria);
    this.getProducts(); // Refetch products based on selected category
  }

  logoutcustomer(): void {
    this.authService.logoutCustomer();
  }

  getProducts(): void {
    this.isLoading = true;
    const fetchProducts = this.categoria === 0
      ? this.productService.getProducts()
      : this.productService.getProductsByCategory(this.categoria);
    fetchProducts.subscribe((response: any) => {
      this.products = response.data.content;
      this.isLoading = false;
      this.NameCate = this.categoria === 0 ? 'Productos' : this.categories.find(cat => cat.id === this.categoria)?.name || 'Categoría';
      console.log("Productos filtrados por categoría:", this.NameCate);
    }, error => {
      this.error = error.message;
      this.isLoading = false;
      console.error("Error al cargar productos:", error);
    });
  }

  getRecommendedProducts(): void {
    const idUser = localStorage.getItem('idUserCustomer');
    if (idUser) {
      this.productService.getProductsRecomendationsByIdUserService(idUser).subscribe((response: any) => {
        this.products = response.data.content;
      }, error => {
        console.error('Error al cargar productos recomendados:', error);
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
