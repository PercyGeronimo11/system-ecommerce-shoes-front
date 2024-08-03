import { Component, OnInit } from '@angular/core';
import { PromocionService } from '../../../services/promotions.service';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ProductModel, PromoCreateReq } from 'src/app/models/product.model';

@Component({
  selector: 'app-tbl-bootstrap',
  standalone: true,
  imports: [SharedModule, RouterModule],
  templateUrl: './promotions-create.component.html',
  styleUrls: ['./promotions-create.component.scss']
})
export class PromotionsCreateComponent implements OnInit {
  promotions: any = [];
  products: ProductModel[] = [];
  filteredProducts: ProductModel[] = [];
  selectedPromotion: any = null;
  isCreating: boolean = false;
  selectedFile: File | null = null;
  selectedIdProducto: number = 0;
  error: string | null = null;
  imageToShow: any;
  isShowProductoModal: boolean = false;
  //Obtencion de datos del formulario
  promocionForm: FormGroup = this.fb.group({
    promPercentage: 0,
    promStartdate: '',
    promEnddate: '',
    promDescription: '',
    promUrlImage: '',
    promStatus: false,
    PromoProductos: this.fb.array([])
  });

  //modelo de la promocion
  promoCreateReq: PromoCreateReq = {
    promPercentage: 0,
    promStartdate: new Date(),
    promEnddate: new Date(),
    promDescription: '',
    promStatus: false,
    promUrlImage: '',
    promDetail: this.promocionForm.value.PromoProductos,
  };

  constructor(
    public promocionService: PromocionService,
    private router: Router,
    private fb: FormBuilder,
  ) { }

  dateLessThan(startDate: string, endDate: string) {
    return (formGroup: FormGroup) => {
      const start = formGroup.controls[startDate];
      const end = formGroup.controls[endDate];

      if (start.value && end.value && new Date(start.value) >= new Date(end.value)) {
        end.setErrors({ dateLessThan: true });
      } else {
        end.setErrors(null);
      }
    };
  }

  ngOnInit(): void {
    this.getProducts();
  }

  close(): void {
    this.imageToShow = null;
    this.router.navigate(['/promotions']);
  }

  clearImageToShow() {
    this.imageToShow = null;
  }

  onFileSelected(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.selectedFile = event.target.files[0];

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageToShow = e.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  getProducts() {
    this.promocionService.getProducts().subscribe((products: any) => {
      this.products = products.data.content;
      this.filterProducts();
      console.log("Todos los productos cargados:", products);
    }, (error) => {
      this.error = error.message;
      console.error("Error al cargar todos los productos:", error);
    });
  }

  submitFormSaveLot() {
    this.promoCreateReq = {
      promPercentage: this.promocionForm.value.promPercentage,
      promStartdate: this.promocionForm.value.promStartdate,
      promEnddate: this.promocionForm.value.promEnddate,
      promDescription: this.promocionForm.value.promDescription,
      promStatus: this.promocionForm.value.promStatus,
      promUrlImage: this.promocionForm.value.promUrlImage,
      promDetail: this.promocionForm.value.PromoProductos
    };

    const formData = new FormData();
    formData.append('promotion', new Blob([JSON.stringify(this.promoCreateReq)], { type: 'application/json' }));
    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }
    this.promocionService.create(formData)
      .subscribe(
        (data: any) => {
          console.log("se a guardado correctamente", data);
          this.router.navigate(['/promotions']);
        },
        (error) => {
          console.log("No se guardo", error);
        });
  }

  get PromoProductosArray() {
    return this.promocionForm.get('PromoProductos') as FormArray;
  }

  removePromoProducto(index: number) {
    const removedProductoId = this.PromoProductosArray.at(index).get('id')?.value;
    this.PromoProductosArray.removeAt(index);
    // Restablecer el producto eliminado a la lista de productos disponibles
    this.filteredProducts = this.products.filter(product => !this.PromoProductosArray.value.some((promoProduct: any) => promoProduct.id === product.id));
  }

  openModalProducto() {
    this.selectedIdProducto =0; // Reinicia la selección
    this.isShowProductoModal = true;
    this.filterProducts();
  }

  closeModalProducto() {
    this.isShowProductoModal = false;
  }

  addProducto() {
    if (this.selectedIdProducto != 0) {
      const selectedProducto = this.products.find(producto => producto.id == this.selectedIdProducto);
      if (selectedProducto) {
        this.PromoProductosArray.push(this.fb.group({
          id: [selectedProducto.id, Validators.required],
          proName: [selectedProducto.proName, Validators.required],
        }));
        this.filterProducts();
        this.isShowProductoModal = false;
      } else {
        console.log("Producto no encontrado");
      }
    } else{
      this.selectedIdProducto = 0;
    }
  }

  filterProducts() {
    // Filtrar productos excluyendo los ya seleccionados
    this.filteredProducts = this.products.filter(product => !this.PromoProductosArray.value.some((promoProduct: any) => promoProduct.id === product.id));
  }
}
