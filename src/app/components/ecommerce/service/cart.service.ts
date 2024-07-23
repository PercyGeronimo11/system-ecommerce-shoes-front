import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProductModel } from 'src/app/models/product.model';

interface CartProduct extends ProductModel {
  size: number;
  image: string;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartProduct[] = [];
  private cartItemCount = new BehaviorSubject<number>(0);

  constructor() {
    this.loadCartFromLocalStorage();
  }

  getCartItems() {
    return this.cartItems;
  }

  addToCart(product: CartProduct) {
    const existingProduct = this.cartItems.find(item => item.id === product.id && item.size === product.size);
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      product.quantity = 1;
      this.cartItems.push(product);
    }
    this.cartItemCount.next(this.cartItems.length); // Emite el nuevo conteo
    this.saveCartToLocalStorage();
  }

  getCartItemCount() {
    return this.cartItemCount.asObservable();
  }

  private saveCartToLocalStorage(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }

  private loadCartFromLocalStorage(): void {
    const cart = localStorage.getItem('cart');
    if (cart) {
      this.cartItems = JSON.parse(cart);
      this.cartItemCount.next(this.cartItems.length);
    }
  }

  getCartSize(): number {
    return this.cartItems.length;
  }
}
