import { Component, OnInit } from '@angular/core';
import { PromocionService } from '../../../services/promotions.service';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ProductModel, ProductoForm, PromoCreateReq } from 'src/app/models/product.model';

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
  selectedPromotion: any = null;
  isCreating: boolean = false;
  selectedFile: File | null = null;
  selectedIdProducto: number = 0;
  error: string | null = null;
  imageToShow: any;
  isShowProductoModal: boolean = false;

  promocionForm: FormGroup = this.fb.group({

    promPercentage: 0,
    promStartdate: new Date(),
    promEnddate: new Date(),
    promDescription: '',
    promUrlImage: '',
    promStatus: false,
/*
    promPercentage: [0, [Validators.required, Validators.min(1), Validators.max(100)]],
    promStartdate: ['', Validators.required],
    promEnddate: ['', Validators.required],
    promDescription: ['', Validators.required],
    promStatus: [false, Validators.required],
*/


    PromoProductos: this.fb.array([])
  }, {
    validators: this.dateLessThan('promStartdate', 'promEnddate')
  });

  productoForm: ProductoForm = {
    id: 0,
    category: {
      id: 0,
      catName: '',
      description: '',
      status: false
    },
    proName: '',
    proDescription: '',
    proUnitPrice: 0,
    proUnitCost: 0,
    proSizePlatform: null,
    proSizeTaco: null,
    proColor: null,
    proSize: null,
    proStock: 0,
    proUrlImage: ''
  };

  promoCreateReq: PromoCreateReq = {
    promPercentage: 0,
    promStartdate: new Date(),
    promEnddate: new Date(),
    promDescription: '',
    promUrlImage: '',
    promStatus: false,
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
      console.log("Todos los productos cargados:", products);
    }, (error) => {
      this.error = error.message;
      console.error("Error al cargar todos los productos:", error);
    });
  }

  submitFormSaveLot() {
    const formData = new FormData();

    // Construir el objeto promotion
    const promotion = {
      promPercentage: this.promocionForm.value.promPercentage,
      promStartdate: this.promocionForm.value.promStartdate,
      promEnddate: this.promocionForm.value.promEnddate,
      promDescription: this.promocionForm.value.promDescription,
      promUrlImage: this.selectedFile ? this.selectedFile.name : '',
      promStatus: this.promocionForm.value.promStatus,
      promDetail: this.promocionForm.value.PromoProductos
    };

    // Añadir el objeto promotion a FormData como una cadena JSON
    formData.append('promotion', JSON.stringify(promotion));

    // Añadir la imagen al FormData si existe
    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    // Llama al servicio con FormData
    this.promocionService.create(formData).subscribe(
      (data: any) => {
        console.log("Se ha guardado correctamente", data);
        this.router.navigate(['/promotions']);
      },
      (error) => {
        console.log("No se guardó", error);
      }
    );
  }

  get PromoProductosArray() {
    return this.promocionForm.get('PromoProductos') as FormArray;
  }

  removePromoProducto(index: number) {
    this.PromoProductosArray.removeAt(index);
  }

  editMaterial(index: number) {
    this.PromoProductosArray.removeAt(index);
  }

  openModalProducto() {
    this.isShowProductoModal = true;
    this.getProducts();
  }

  closeModalProducto() {
    this.isShowProductoModal = false;
  }

  addProducto() {
    const selectedProducto = this.products.find(producto => producto.id == this.selectedIdProducto);
    if (selectedProducto) {
      this.PromoProductosArray.push(this.fb.group({
        proId: [selectedProducto.id, Validators.required],
        proName: [selectedProducto.proName, Validators.required],
      }));
      this.isShowProductoModal = false;
    } else {
      console.log("Producto no encontrado");
    }
  }
}
