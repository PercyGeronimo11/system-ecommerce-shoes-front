import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/components/auth/service/auth.service';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ProductModel } from '../../../models/product.model';
import { CartService } from '../../../services/cart.service';
import { CategoriaService } from '../../../services/categories.service';
import { ProductService } from '../../../services/product.service';
import { EcommercePlantilla } from '../base-layout.component';
@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [RouterModule, CommonModule, SharedModule,EcommercePlantilla],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  loginResponse: any;
  selectedSize: number | null = null;
  products: ProductModel[] = [];
  product: ProductModel | undefined;
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
  cart: any[] = []; // Lista para almacenar los productos agregados al carrito

  constructor(private fb: FormBuilder,
    public categoriaService: CategoriaService,
    private authService: AuthService,
    private productService: ProductService,
    private sharedDataService: SharedDataService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private router: Router) {
    this.numberForm = this.fb.group({
      idcategoria: [0]
    });

    this.categoriaService.list().subscribe((resp: any) => {
      this.categories = resp.data;
      console.log(this.categories);
    });
    this.startAutoSlide();
    this.loadCartFromLocalStorage();
  }

  ngOnInit(): void {
    this.loginResponse = 'Ingresar';

    //obtener usuario
    /*
    this.sharedDataService.loginResponse$.subscribe(loginResp => {
      if (loginResp.error) {
        console.log('Estos datos son', this.loginResponse);
      } else {
        this.loginResponse = loginResp.data.custFirstName;
        console.log('Estos datos son', this.loginResponse);
      }
    });
*/



    this.getProducts();
    this.categoria == 0;

    // Subscribe to cart item count
    this.cartService.getCartItemCount().subscribe(count => {
      this.cartItemCount = count;
    });

    this.cartItemCount = this.cartService.getCartSize();

    this.loadProductDetail();
  }

  loadProductDetail(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.productService.getProductById(productId).subscribe((response: any) => {
        this.product = response.data;
        console.log('Producto cargado:', this.product);
      }, error => {
        console.error("Error al cargar el producto:", error);
      });
    }
  }

  onSubmit(): void {
    this.categoria = this.numberForm.get('idcategoria')?.value;
    console.log('Selected category:', this.categoria);
    this.ngOnInit();
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

  addToCart(product: ProductModel): void {
    if (this.selectedSize) {
      const productToAdd = {
        id: product.id,
        name: product.proName,
        size: this.selectedSize,
        price: product.proUnitPrice,
        image: product.proUrlImage
      };
      this.cart.push(productToAdd);
      this.saveCartToLocalStorage();
      this.cartService.getCartItemCount().subscribe(count => {
        this.cartItemCount = count; // Actualiza el contador local
      });
      console.log('Producto agregado al carrito:', productToAdd);
      localStorage.setItem('addingProduct', 'true'); // Indica que se está agregando un producto
      document.getElementById('loading')?.classList.remove('d-none'); // Muestra el mensaje de carga
      setTimeout(() => {
        window.location.reload(); // Refresca la página después de la animación
      }, 1000); // Tiempo de espera para la animación (1.5 segundos)
    } else {
      console.error('Seleccione una talla antes de agregar al carrito');
    }
  }

  saveCartToLocalStorage(): void {
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  loadCartFromLocalStorage(): void {
    const cart = localStorage.getItem('cart');
    if (cart) {
      this.cart = JSON.parse(cart);
    }
  }

  selectSize(size: number) {
    this.selectedSize = size;
  }
}
