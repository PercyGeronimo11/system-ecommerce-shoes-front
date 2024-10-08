import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, RouterModule, NavigationEnd, ActivatedRoute } from '@angular/router';
import { CartService } from '../../../services/cart.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { AuthService } from '../../../components/auth/service/auth.service';
import { ProductCustomer, ProductModel } from '../../../models/product.model';
import { ProductService } from '../../../services/product.service';
import { ProductCustomerService } from '../../../services/productCustomer.service';
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
  ratingAverageProduct: number=0;
  productCustomers: ProductCustomer[] = [];
  recommendedProducts: ProductModel[] = [];
  categories: any[] = [];
  NameCate: string = '';
  isLoading = false;
  error: string | null = null;
  categoria: number = 0;
  numberForm: FormGroup;
  promociones: { [id: number]: any } = {};
  slides = [
    { image: 'assets/images/baner1.jpg', caption: '', description: '' },
    { image: 'assets/images/baner2.jpg', caption: '', description: '' },
  ];
  currentSlide = 0;
  slideInterval: any;
  cartItemCount: number = 0;
  userSubscription: Subscription | undefined;
  currentRoute: string = '';
  isRecomendations: boolean = false;
  isTitleEcommerce: boolean = false;

  constructor(
    private fb: FormBuilder,
    public categoriaService: CategoriaService,
    private authService: AuthService,
    private productService: ProductService,
    private productCustomerService: ProductCustomerService,
    private cartService: CartService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.numberForm = this.fb.group({
      idcategoria: [0]
    });

    this.categoriaService.list().subscribe((resp: any) => {
      this.categories = resp.data;
      console.log(this.categories);
    });

    this.startAutoSlide();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url;
        //this.loadProducts();
        this.route.queryParams.subscribe(params => {
          if (params['recommendations']) {
            this.getRecommendedProducts();
            this.isTitleEcommerce = true;
          } else {
            this.getProducts();
            this.isTitleEcommerce = false;
          }
        });
      }
    });
  }

  ngOnInit(): void {
    this.loginResponse = 'Ingresar';
    console.log(localStorage.getItem('usernamecustomer'));
    if (localStorage.getItem('usernamecustomer') != null) {
      this.loginResponse = localStorage.getItem('usernamecustomer');
    }

    this.route.queryParams.subscribe(params => {
      if (params['recommendations']) {
        this.getRecommendedProducts();
        this.isTitleEcommerce = true;
      } else {
        this.getProducts();
        this.isTitleEcommerce = false;
      }
    });

    this.cartService.getCartItemCount().subscribe(count => {
      this.cartItemCount = count;
    });

    //this.loadProductRatings();
  }

  // loadProductRatings(): void {
  //   this.productCustomerService.getRatingProductsService(this.customerId).subscribe(
  //     (response: any) => {
  //       this.productCustomers = response.data;
  //       const productCustomer = this.productCustomers.find(pc => Number(pc.product_id) === Number(this.productId));
  //       if (productCustomer) {
  //         console.log("El rating es:", productCustomer.rating);
  //       } else {
  //         console.log("Producto no encontrado, devolviendo 0 como rating.");
  //       }
  //       this.ratingAverageProduct = productCustomer ? productCustomer.rating : 0;
  //     },
  //     error => {
  //       console.error('Error loading product ratings', error);
  //     }
  //   );
  // }

  getRatingForProduct(productId: number): number {
    const productCustomer: ProductCustomer | any = this.productCustomers.find(pc => pc.product_id === productId);
    if (productCustomer) {
      console.log("El rating es:", productCustomer.rating);
    } else {
      console.log("Producto no encontrado, devolviendo 0 como rating.", productCustomer);
    }
    return productCustomer ? productCustomer.rating : 0;
  }

  rateProduct(star: number, product: any): void {
    let idCustomer = localStorage.getItem('idCustomer');
    const productCustomer: ProductCustomer = {
      customer_id: idCustomer, // Asegúrate de que esta estructura sea correcta
      product_id: product.id,
      clicks: 0,
      rating: star
    };

    this.productCustomerService.saveRatingProductService(productCustomer).subscribe(
      response => {
        console.log('Calificación guardada con éxito');
      },
      error => {
        console.error('Error saving product rating', error);
      }
    );
  }


  loadProducts(): void {
    if (this.isRecomendations) {
      this.getRecommendedProducts();
      this.isTitleEcommerce = true;
    } else {
      this.getProducts();
    }
  }

  onSubmit(): void {
    this.categoria = this.numberForm.get('idcategoria')?.value || 0;
    console.log('Selected category:', this.categoria);
    this.getProducts();
    this.isTitleEcommerce = false;
  }

  logoutcustomer(): void {
    this.authService.logoutCustomer();
  }

  //obtengo la promocion x id del producto
  getpromoxproduct(idproducto: number): void {
    this.productService.getpromo(idproducto).subscribe((resp: any) => {
      if (resp && resp.data) {
        this.promociones[idproducto] = resp.data;
      } else {
        this.promociones[idproducto] = null; // No hay promoción para este producto
      }
    });
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

      this.products.forEach(product => this.getpromoxproduct(product.id));

      console.log("Productos filtrados por categoría:", this.NameCate);
    }, error => {
      this.error = error.message;
      this.isLoading = false;
      console.error("Error al cargar productos:", error);
    });
  }

  getRecommendedProducts(): void {
    const idUser = localStorage.getItem('idCustomer');
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
    if (this.promociones[product.id]?.promPercentage) {
      const discountPercentage = this.promociones[product.id].promPercentage;
      product.proUnitPrice = product.proUnitPrice - (product.proUnitPrice * discountPercentage / 100.0);
    }
    product.precioDescuento=product.proUnitPrice;
    this.router.navigate(['/product', product.id]);
    
  }


}
