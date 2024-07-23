import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from 'src/app/components/auth/service/auth.service';
import { CategoriaService } from 'src/app/components/categories/service/categories.service';
import { CartService } from 'src/app/components/ecommerce/service/cart.service';
import { ProductModel } from 'src/app/models/product.model';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterModule, CommonModule, SharedModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, OnDestroy {
  loginResponse: any;
  cartItems: ProductModel[] = [];
  groupedCartItems: { [key: number]: ProductModel } = {};
  cartItemCount: number = 0;
  numberForm: FormGroup;
  categories: any[] = [];
  categoria: number = 0;

  constructor(private fb: FormBuilder,
              private cartService: CartService,
              private authService: AuthService,
              private sharedDataService: SharedDataService,
              private categoriaService: CategoriaService,
              private cdr: ChangeDetectorRef) {
    this.numberForm = this.fb.group({
      idcategoria: [0]
    });

    // Initialize categories
    this.categoriaService.list().subscribe((resp: any) => {
      this.categories = resp.data;
      console.log(this.categories);
    });
  }

  ngOnInit(): void {
    this.cartItems = this.cartService.getCartItems();
    this.groupCartItems();
    this.cartItemCount = this.cartService.getCartSize();
    
    // Suscribirse al loginResponse para actualizar la UI
    this.sharedDataService.loginResponse$.subscribe(loginResp => {
      if (loginResp.error) {
        this.loginResponse = 'Ingresar';
      } else {
        this.loginResponse = loginResp.data.custFirstName;
      }
    });
    
    console.log(this.cartItems); // Verifica los datos aquí
    this.cdr.detectChanges(); // Forzar detección de cambios si es necesario
  }

  ngOnDestroy(): void {
    // Implementar la lógica de limpieza si es necesario
  }

  groupCartItems() {
    this.groupedCartItems = this.cartItems.reduce((acc, item) => {
      if (acc[item.id]) {
        acc[item.id].quantity += 1; // Incrementa la cantidad para productos existentes
      } else {
        acc[item.id] = { ...item, quantity: 1 }; // Inicializa la cantidad para nuevos productos
      }
      return acc;
    }, {} as { [key: number]: ProductModel });
  }
  
  get groupedCartItemsArray() {
    return Object.values(this.groupedCartItems);
  }

  getCartItems() {
    return this.cartItems;
  }

  onSubmit(): void {
    this.categoria = this.numberForm.get('idcategoria')?.value;
    console.log('Selected category:', this.categoria);
    this.ngOnInit(); // Reload or filter items based on selected category
  }

  logout(): void {
    this.authService.logout();
  }
}
