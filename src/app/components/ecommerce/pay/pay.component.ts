import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DepartmentModel } from 'src/app/models/department.model';
import { CustomerService } from 'src/app/services/customers.service';
import { OrderService } from 'src/app/services/order.service';
import { ShipmenService } from 'src/app/services/shipmen';
import { TransactionService } from 'src/app/services/transaction';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { AuthService } from '../../../components/auth/service/auth.service';
import { ProductModel } from '../../../models/product.model';
import { CartService } from '../../../services/cart.service';
import { CategoriaService } from '../../../services/categories.service';
import { DepartmentService } from '../../../services/department.service';
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
  cart: any[] = [];
  currentSection: number = 1;
  countdown: number = 240;
  intervalId: any;
  showContact = true;  // El primer div está visible por defecto
  showNames = false;
  showAddress = false;
  showShipping = false;
  showPayment = false;
  customerData:any
  voucherUploaded: boolean = false;
  provinces: any[] = [];
  isEditMode = false;
  departments: DepartmentModel[]=[];
  shipmentForm: FormGroup;

  selectedPaymentMethod: string = '';



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
    private customerService: CustomerService,
    private orderService: OrderService,
    private departmentService: DepartmentService,
    private cdr: ChangeDetectorRef,
    private shipmenService: ShipmenService,
    private transactionService: TransactionService
  ) {
    this.numberForm = this.fb.group({
      idcategoria: [0]
    });

    this.shipmentForm = this.fb.group({
      shi_department: ['', [Validators.required]],
      shi_province: ['', [Validators.required]],
      shi_district: ['', [Validators.required]],
      shi_adress: ['', [Validators.required]],
      shi_date_start: ['', [Validators.required]],
      shi_date_end: ['', [Validators.required]],
      shi_status: ['', [Validators.required]],
      ord_id: ['', [Validators.required]],
      shippingDays: ['', [Validators.required]], 
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
            this.userEmail = response.data[0].custEmail;
            this.getCustomer();
            console.log(this.customerData);  // Asignar el correo obtenido
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


  cargarDepartamentos() {
    if (this.departments.length === 0) {
      this.departmentService.list().subscribe(
        (departments: any) => {
          this.departments = departments.data;
          this.cdr.detectChanges(); // Fuerza la actualización del select
        },
        (error) => {
          console.error('Error al cargar los departamentos', error);
        }
      );
    }
  }


  onSelectedIdDepartament(event: Event) {
    const selectedDepartmentId = (event.target as HTMLSelectElement).value;
  
    if (!selectedDepartmentId) {
          console.log("ctmrr")
      return;
    }
  
    if (this.departments && this.departments.length > 0) {
      const selectedDepartment = this.departments.find(department => department.id.toString() === selectedDepartmentId);
  
      if (selectedDepartment) {
        alert(`Departamento seleccionado: ${selectedDepartment.id}`); // Mostrar ID del departamento
      } else {
        alert('Departamento no encontrado');
      }
    } else {
      alert('Los departamentos no se han cargado correctamente.');
    }
  }
  

  toggleSection(section: string): void {
    switch (section) {
      case 'contact':
        this.showContact = !this.showContact;
        break;
      case 'names':
        this.showNames = !this.showNames;
        break;
      case 'address':
        this.showAddress = !this.showAddress;
        break;
      case 'shipping':
        this.showShipping = !this.showShipping;
        break;     
      case 'payment':
          this.showPayment = !this.showPayment;
      break;   
    }
  }

openNextSection(currentSection: string): void {
  // Oculta la sección actual y muestra la siguiente
  switch (currentSection) {
    case 'contact':
      this.showContact = false;
      this.showNames = true;
      break;
    case 'names':
      this.showContact = false;
      this.showNames = true;
      break;
    case 'address':
      this.showNames = false;
      this.showAddress = true;
      break;
    case 'shipping':
      this.showAddress = false;  
      this.showShipping = true;
      break;
    case 'payment':
      this.showShipping = false;     
      this.showPayment = true;
      break;
  }
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

  getCustomer(){
    this.customerService.getByEmail(this.userEmail).subscribe((customerData: any) => {
      this.customerData = customerData.data;
      console.log(customerData);
    });
  }
 
openPaymentModal(paymentMethod: string) {
  this.selectedPaymentMethod = paymentMethod; // Guardamos el método de pago seleccionado
  const modalOverlay = document.getElementById('modalOverlay');

  if (modalOverlay) {
    modalOverlay.style.display = 'flex'; // Mostrar el fondo oscuro
  }

  if (paymentMethod === 'yape') {
    const yapeModal = document.getElementById('yapeModal');
    if (yapeModal) {
      yapeModal.style.display = 'block';
      this.startCountdown(); // Inicia la cuenta regresiva para Yape
    }
  } else if (paymentMethod === 'bcp') {
    const bcpModal = document.getElementById('bcpModal');
    if (bcpModal) {
      bcpModal.style.display = 'block';
      this.startCountdown(); // Inicia la cuenta regresiva para BCP
    }
  }
}

  // Método para cerrar el modal de pago
  closePaymentModal() {
    clearInterval(this.intervalId); // Detiene la cuenta regresiva
    const modalOverlay = document.getElementById('modalOverlay');
    if (modalOverlay) {
      modalOverlay.style.display = 'none'; // Ocultar el fondo oscuro
    }

    const yapeModal = document.getElementById('yapeModal');
    if (yapeModal) {
      yapeModal.style.display = 'none';
    }

    const bcpModal = document.getElementById('bcpModal');
    if (bcpModal) {
      bcpModal.style.display = 'none';
    }
  }

  // Método para iniciar la cuenta regresiva
  startCountdown() {
    this.intervalId = setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--;
      } else {
        this.closePaymentModal();
      }
    }, 1000); // Se ejecuta cada segundo
  }

  // Método para formatear el tiempo restante en minutos y segundos
  formatTime(time: number): string {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  SubmitOrder() {
    if (!this.voucherUploaded || !this.selectedPaymentMethod) {
      alert('Por favor, cargue una imagen del voucher y seleccione un método de pago antes de guardar.');
      return;
    }
  
    const cart = localStorage.getItem('cart');
    if (cart) {
      this.cart = JSON.parse(cart);
      console.log(this.cart);
  
      this.customerService.getByEmail(this.userEmail).subscribe((customerData: any) => {
        const customerId = customerData.data.id;
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().split('T')[0];
  
        const orderData = {
          ordDate: formattedDate,
          ord_total: this.totalAmount,
          customer: {
            id: customerId
          }
        };
  
        this.orderService.create(orderData).subscribe(
          (orderResponse: any) => {
            const orderId = orderResponse.data.ord_id;
  
            let orderDetails = this.groupedCartItemsArray.map((item: any) => ({
              "odt_amount": item.quantity,
              "odt_price": item.price,
              "odt_status": 1,
              "odt_description": "Ninguno",
              "order": {
                "ord_id": orderId
              },
              "product": {
                "id": item.id
              },

            }));
  
            this.orderService.createDetails(orderDetails).subscribe(
              (detailsResponse: any) => {
                const shipmentData = {
                  shi_department: this.shipmentForm.value.shi_department,
                  shi_province: this.shipmentForm.value.shi_province,
                  shi_district: this.shipmentForm.value.shi_district,
                  shi_adress: this.shipmentForm.value.shi_adress,

                  order: {
                    ord_id: orderId
                  },
                  shi_date_start: formattedDate,
                  shi_date_end: this.calculateShipmentEndDate(currentDate), // Usa la lógica basada en 'shippingDays'
                  shi_status: 1
                };
  
                this.shipmenService.create(shipmentData).subscribe(
                  (shipmentResponse: any) => {
                    // Preparar los datos para la transacción
                    const transactionData = new FormData();
                    transactionData.append('tra_tipe', this.selectedPaymentMethod); // 'yape' o 'bcp'
                    transactionData.append('tra_date', formattedDate);
                    transactionData.append('tra_amount', this.totalAmount.toString());
                    transactionData.append('order', orderId);
                    transactionData.append('tra_status', '1'); // Estado inicial de la transacción
                    
                    // Adjuntamos la imagen del voucher bajo la clave 'archivo'
                    if (this.voucherFile) {
                      transactionData.append('archivo', this.voucherFile); // Enviamos el archivo correctamente
                    }
  
                    this.transactionService.create(transactionData).subscribe(
                      (transactionResponse: any) => {
                        console.log('Transacción registrada con éxito:', transactionResponse);
                        localStorage.removeItem('cart');
                        window.location.href = '/ecommers';
                        alert('El registro de la venta fue hecho con éxito');
                      },
                      (transactionError: any) => {
                        console.error('Error al crear la transacción:', transactionError);
                        // Aquí puedes mostrar más detalles sobre el error
                        alert(`Error al crear la transacción: ${transactionError.message}`);
                      }
                    );
                  },
                  (shipmentError: any) => {
                    console.error('Error al crear el envío:', shipmentError);
                    alert(`Error al crear el envío: ${shipmentError.message}`);
                  }
                );
              },
              (detailsError: any) => {
                console.error('Error al crear los detalles de la orden:', detailsError);
                alert(`Error al crear los detalles de la orden: ${detailsError.message}`);
              }
            );
          },
          (orderError: any) => {
            console.error('Error al crear la orden:', orderError);
            alert(`Error al crear la orden: ${orderError.message}`);
          }
        );
      });
    }
  }
  


  calculateShipmentEndDate(startDate: Date): string {
    const shippingDays = this.shipmentForm.value.shippingDays;
    const daysForDelivery = parseInt(shippingDays, 10) || 1; 
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + daysForDelivery);
    return endDate.toISOString().split('T')[0];
  }
  

  voucherPreview: string | ArrayBuffer | null = null;
  voucherFile: File | null = null;

onFileSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const fileType = file.type;

    // Verifica que el archivo sea una imagen
    if (fileType.match(/image\/*/) == null) {
      alert('Por favor, seleccione un archivo de imagen válido.');
      return;
    }

    this.voucherUploaded = true;
    this.voucherFile = file; // Guardamos el archivo para su uso posterior

    const reader = new FileReader();
    reader.onload = (e) => this.voucherPreview = reader.result;
    reader.readAsDataURL(file);
  }
}

  


  
}
