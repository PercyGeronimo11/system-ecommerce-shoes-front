import { Component, OnInit } from '@angular/core';
import { PromocionService } from '../../../services/promotions.service';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ProductModel, ProductoForm, PromoDetailCreateReq, PromoCreateReq } from 'src/app/models/product.model';

@Component({
  selector: 'app-tbl-bootstrap',
  standalone: true,
  imports: [SharedModule, RouterModule],
  templateUrl: './promotions-edit.component.html',
  styleUrls: ['./promotions-edit.component.scss']
})
export class PromotionsEditComponent implements OnInit {
  promotions: any = [];
  products: ProductModel[] = [];
  filteredProducts: ProductModel[] = [];
  selectedPromotion: any = null;
  isCreating: boolean = false;
  selectedFile: File | null = null;
  selectedIdProducto: number = 0;
  error: string | null = null;
  imageToShow: any = null;
  isShowProductoModal: boolean = false;

  promocionForm: FormGroup = this.fb.group({
    promPercentage: [0, Validators.required],
    promStartdate: ['', Validators.required],
    promEnddate: ['', Validators.required],
    promDescription: ['', Validators.required],
    promUrlImage: ['', Validators.required],
    promStatus: [false, Validators.required],
    PromoProductos: this.fb.array([])
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
    promStatus: false,
    promUrlImage: '',
    promDetail: []
  };

  promoDetailCreate: PromoDetailCreateReq = {
    id: -1,
    proName: '',
  };

  constructor(
    public promocionService: PromocionService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.getPromoProduc();
  }

  getPromoProduc() {
    const id = this.route.snapshot.params['id'];
    this.promocionService.getById(id).subscribe(
      (data) => {
        this.promocionForm.patchValue({
          promPercentage: data.data.promPercentage,
          promStartdate: data.data.promStartdate,
          promEnddate: data.data.promEnddate,
          promDescription: data.data.promDescription,
          promUrlImage: data.data.promUrlImage,
          promStatus: data.data.promStatus
        });
        this.imageToShow = data.data.promUrlImage;
        this.setPromoProduc(data.data.promDetail);
      },
      (error) => {
        console.log("Error al obtener la promoción:", error);
      });
  }

  setPromoProduc(promDetail: PromoDetailCreateReq[]) {
    promDetail.forEach(detallesP => {
      this.PromoProductosArray.push(this.fb.group({
        id: [detallesP.id],
        proName: [detallesP.proName],
      }));
    });
    console.log("Productos de la promocion asociada:", this.PromoProductosArray.value);
  }

  get PromoProductosArray() {
    return this.promocionForm.get('PromoProductos') as FormArray;
  }

  close(): void {
    this.imageToShow = null;
    this.router.navigate(['/promotions']);
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
      promDetail: this.PromoProductosArray.value
    };

    const formData = new FormData();
    formData.append('promotion', new Blob([JSON.stringify(this.promoCreateReq)], { type: 'application/json' }));
    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }
    this.promocionService.edit(this.route.snapshot.params['id'], formData).subscribe(
      (data) => {
        this.router.navigate(['/promotions']);
        console.log("Promoción actualizada:", data);
      },
      (error) => {
        console.error("Error al editar la promoción:", error);
      }
    );
  }

  openModalProducto() {
    this.isShowProductoModal = true;
    this.filterProducts();
  }

  closeModalProducto() {
    this.isShowProductoModal = false;
  }

  filterProducts() {
    const assignedProductIds = this.PromoProductosArray.controls.map(control => control.value.id);
    this.filteredProducts = this.products.filter(product => !assignedProductIds.includes(product.id));
  }

  addProducto() {
    const productoSeleccionado = this.products.find(product => product.id === this.selectedIdProducto);
    if (productoSeleccionado) {
      this.PromoProductosArray.push(this.fb.group({
        id: [productoSeleccionado.id],
        proName: [productoSeleccionado.proName],
      }));
    }
    this.closeModalProducto();
    this.filterProducts();
  }

  removePromoProducto(index: number) {
    this.PromoProductosArray.removeAt(index);
    this.filterProducts();
  }
}
