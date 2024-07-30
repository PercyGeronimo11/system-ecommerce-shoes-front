import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { AuthService } from '../../../components/auth/service/auth.service';
import { ProductModel } from '../../../models/product.model';
import { CartService } from '../../../services/cart.service';
import { CategoriaService } from '../../../services/categories.service';
import { SharedDataService } from '../../../services/shared-data.service';
@Component({
  selector: 'app-pay',
  standalone: true,
  imports: [RouterModule, CommonModule, SharedModule],
  templateUrl: './pay.component.html',
  styleUrl: './pay.component.scss'
})
export class PayComponent {
loginResponse: any;
  cartItems: ProductModel[] = [];
  groupedCartItems: { [key: number]: ProductModel } = {};
  cartItemCount: number = 0;
  numberForm: FormGroup;
  categories: any[] = [];
  categoria: number = 0;
  totalAmount: number = 0;
  isRemoving: boolean = false; // Variable para manejar el estado de la animación

  constructor(private fb: FormBuilder,
              private cartService: CartService,
              private authService: AuthService,
              private sharedDataService: SharedDataService,
              private categoriaService: CategoriaService,
             ) {
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
    this.sharedDataService.loginResponse$.subscribe(loginResp => {
      if (loginResp.error) {
        this.loginResponse = 'Ingresar';
      } else {
        this.loginResponse = loginResp.data.custFirstName;
      }
    });
    
    console.log(this.cartItems); // Verifica los datos aquí
  }

  ngOnDestroy(): void {
    // Implementar la lógica de limpieza si es necesario
  }




  groupCartItems() {
    this.groupedCartItems = this.cartItems.reduce((acc, item) => {
      // Usa una cadena que combine ID y tamaño como clave
      const key = `${item.id}-${item.size}`;
      if (acc[key]) {
        acc[key].quantity += 1; // Acumula la cantidad
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

  removeItem(productId: number, size: number): void {
    this.isRemoving = true; // Muestra la animación
  
    setTimeout(() => {
      console.log(`Removing all items with ID ${productId} and size ${size}`); // Verifica que esta línea se ejecute
  
      // Elimina todos los productos con el ID y tamaño especificado
      this.cartService.removeAllFromCart(productId, size);
      
      // Actualiza la lista de productos en el carrito
      this.cartItems = this.cartService.getCartItems();
      
      // Vuelve a agrupar los productos
      this.groupCartItems();
      
      // Recalcula el total
      this.calculateTotalAmount();
      
      // Ocultar la animación después de 1 segundo (ajusta según tu necesidad)
      this.isRemoving = false;
      
      // Actualiza el conteo de productos en el carrito
      this.cartItemCount = this.cartService.getCartSize();
      
      // Recargar la página
      window.location.reload();
    }, 1000); // El tiempo de espera coincide con la duración de la animación
  }
  
}
