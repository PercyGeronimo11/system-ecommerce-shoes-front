import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/components/auth/service/auth.service';
import { ProductModel } from 'src/app/models/product.model';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { CartService } from '../../../services/cart.service';
import { CategoriaService } from '../../../services/categories.service';
import { EcommercePlantilla } from '../base-layout.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterModule, CommonModule, SharedModule, EcommercePlantilla],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, OnDestroy {
  loginResponse: any;
  cartItems: ProductModel[] = [];
  groupedCartItems: { [key: string]: ProductModel } = {};
  cartItemCount: number = 0;
  numberForm: FormGroup;
  categories: any[] = [];
  categoria: number = 0;
  totalAmount: number = 0;
  isRemoving: boolean = false; // Variable para manejar el estado de la animación
  userSubscription: Subscription | undefined;

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

    // Calcular el monto total de los productos en el carrito
    this.calculateTotalAmount();
    
    // Suscribirse al loginResponse para actualizar la UI
    this.userSubscription = this.sharedDataService.user$.subscribe(user => {
      if (user) {
        this.loginResponse = user.username;
      } else {
        this.loginResponse = 'Ingresar';
      }
    });
    
    console.log(this.cartItems); // Verifica los datos aquí
    this.cdr.detectChanges(); // Forzar detección de cambios si es necesario
  }

  ngOnDestroy(): void {
    // Implementar la lógica de limpieza si es necesario
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  groupCartItems() {
    this.groupedCartItems = this.cartItems.reduce((acc, item) => {
      const key = `${item.id}-${item.size}`;
      if (acc[key]) {
        acc[key].quantity += 1;
      } else {
        acc[key] = { ...item, quantity: 1 };
      }
      return acc;
    }, {} as { [key: string]: ProductModel });
  }

  get groupedCartItemsArray() {
    return Object.values(this.groupedCartItems);
  }

  calculateTotalAmount() {
    this.totalAmount = this.cartItems.reduce((total, item) => total + item.price * (item.quantity || 1), 0);
  }

  onSubmit(): void {
    this.categoria = this.numberForm.get('idcategoria')?.value;
    console.log('Selected category:', this.categoria);
    this.ngOnInit(); // Reload or filter items based on selected category
  }

  logout(): void {
    this.authService.logout();
  }

  removeItem(productId: number, size: number): void {
    this.isRemoving = true; // Muestra la animación
  
    setTimeout(() => {
      console.log(`Removing all items with ID ${productId} and size ${size}`);
  
      this.cartService.removeAllFromCart(productId, size);
      
      // Actualiza la lista de productos en el carrito
      this.cartItems = this.cartService.getCartItems();
      
      // Vuelve a agrupar los productos
      this.groupCartItems();
      
      // Recalcula el total
      this.calculateTotalAmount();
      
      // Ocultar la animación después de 1 segundo
      this.isRemoving = false;
      
      // Actualiza el conteo de productos en el carrito
      this.cartItemCount = this.cartService.getCartSize();
      
      // Forzar detección de cambios
      this.cdr.detectChanges();
    }, 1000); // El tiempo de espera coincide con la duración de la animación
  }
}
