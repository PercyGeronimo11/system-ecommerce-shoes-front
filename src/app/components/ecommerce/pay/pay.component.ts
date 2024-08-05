import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CustomerService } from 'src/app/services/customers.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { AuthService } from '../../../components/auth/service/auth.service';
import { ProductModel } from '../../../models/product.model';
import { CartService } from '../../../services/cart.service';
import { CategoriaService } from '../../../services/categories.service';
import { SharedDataService } from '../../../services/shared-data.service';
import { EcommercePlantilla } from '../base-layout.component';

@Component({
  selector: 'app-pay',
  standalone: true,
  imports: [RouterModule, CommonModule, SharedModule, EcommercePlantilla],
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.scss']
})
export class PayComponent implements OnInit, OnDestroy {
  loginResponse: string = 'Ingresar';
  user: any;
  cartItems: ProductModel[] = [];
  groupedCartItems: { [key: string]: ProductModel & { quantity: number } } = {};
  cartItemCount: number = 0;
  numberForm: FormGroup;
  categories: any[] = [];
  categoria: number = 0;
  totalAmount: number = 0;
  isRemoving: boolean = false;
  userEmail: string | null = null; 
  showUserInfo = false;
  showAdditionalInfo = false;  // New property
  isLoading = false;
  isEditingUsername = false;
  isEditingEmail = false;
  showAddressInfo = false;  // New property


  additionalInfo = {
    nombres: '',
    apellidos: '',
    dni: ''
  };  // New property

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private authService: AuthService,
    private sharedDataService: SharedDataService,
    private categoriaService: CategoriaService,
    private customerService: CustomerService
  ) {
    this.numberForm = this.fb.group({
      idcategoria: [0]
    });

    this.categoriaService.list().subscribe((resp: any) => {
      this.categories = resp.data;
      console.log(this.categories);
    });
  }

  ngOnInit(): void {
    this.cartItems = this.cartService.getCartItems();
    this.groupCartItems();
    this.cartItemCount = this.cartService.getCartSize();
    this.calculateTotalAmount();

    this.sharedDataService.user$.subscribe((user) => {
      this.user = user;
      if (this.user) {
        this.customerService.getUser(this.user.username).subscribe((response: any) => {
          if (response && response.data && response.data.length > 0) {
            this.userEmail = response.data[0].custEmail;  // Asignar el correo obtenido
          }
        });
      }
    });
    const customerInfo = this.authService.getCustomerInfo();
    if (customerInfo) {
      this.sharedDataService.updateUser(customerInfo);
    }

    console.log(this.cartItems);
  }

  ngOnDestroy(): void {}

  groupCartItems() {
    this.groupedCartItems = this.cartItems.reduce((acc, item) => {
      const key = `${item.id}-${item.size}`;
      if (acc[key]) {
        acc[key].quantity += 1;
      } else {
        acc[key] = { ...item, quantity: 1 };
      }
      return acc;
    }, {} as { [key: string]: ProductModel & { quantity: number } });
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
    this.ngOnInit();
  }

  logout(): void {
    this.authService.logout();
  }

  removeItem(productId: number, size: number): void {
    this.isRemoving = true;

    setTimeout(() => {
      console.log(`Removing all items with ID ${productId} and size ${size}`);
      this.cartService.removeAllFromCart(productId, size);
      this.cartItems = this.cartService.getCartItems();
      this.groupCartItems();
      this.calculateTotalAmount();
      this.isRemoving = false;
      this.cartItemCount = this.cartService.getCartSize();
      window.location.reload();
    }, 1000);
  }

  toggleUserInfo() {
    this.showUserInfo = !this.showUserInfo;
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  toggleAdditionalInfo() {
    this.showAdditionalInfo = !this.showAdditionalInfo;
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  toggleEdit(field: string) {
    if (field === 'username') {
      this.isEditingUsername = !this.isEditingUsername;
    } else if (field === 'email') {
      this.isEditingEmail = !this.isEditingEmail;
    }
  }

  toggleAddressInfo() {
    this.showAddressInfo = !this.showAddressInfo;
  }

}
