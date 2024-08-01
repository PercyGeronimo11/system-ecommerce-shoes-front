import { Component, OnInit } from '@angular/core';
import { PromocionService } from '../../../services/promotions.service';
import { Router, ActivatedRoute,RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ProductModel, ProductoForm, PromoCreateReq } from 'src/app/models/product.model';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-promotions-edit',
  standalone: true,
  imports: [RouterModule, SharedModule],
  templateUrl: './promotions-edit.component.html',
  styleUrls: ['./promotions-edit.component.scss']
})
export class PromotionsEditComponent implements OnInit {
  promotions: any = [];
  products: ProductModel[] = [];
  filteredProducts: ProductModel[] = [];
  selectedPromotion: any = null;
  isEditing: boolean = true;
  selectedFile: File | null = null;
  selectedIdProducto: number = 0;
  error: string | null = null;
  imageToShow: any;
  isShowProductoModal: boolean = false;
  promocionForm: FormGroup = this.fb.group({
    promPercentage: [0, Validators.required],
    promStartdate: ['', Validators.required],
    promEnddate: ['', Validators.required],
    promDescription: ['', Validators.required],
    promUrlImage: [''],
    promStatus: [false, Validators.required],
    PromoProductos: this.fb.array([])
  });

  constructor(
    public promocionService: PromocionService,
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.getProducts();
    this.loadPromotionData();
  }

  loadPromotionData() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.promocionService.getById(+id).subscribe((promotion: any) => {
        this.selectedPromotion = promotion;
        this.promocionForm.patchValue({
          promPercentage: promotion.promPercentage,
          promStartdate: promotion.promStartdate,
          promEnddate: promotion.promEnddate,
          promDescription: promotion.promDescription,
          promStatus: promotion.promStatus,
          promUrlImage: promotion.promUrlImage
        });
        promotion.promDetail.forEach((detail: any) => {
          this.PromoProductosArray.push(this.fb.group({
            id: [detail.product.id, Validators.required],
            proName: [detail.product.proName, Validators.required],
          }));
        });
        this.imageToShow = promotion.promUrlImage;
      }, (error) => {
        console.error("Error al cargar la promoción:", error);
        this.error = error.message;
      });
    }
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

  submitFormEdit() {
    const promoEditReq: PromoCreateReq = {
      promPercentage: this.promocionForm.value.promPercentage,
      promStartdate: this.promocionForm.value.promStartdate,
      promEnddate: this.promocionForm.value.promEnddate,
      promDescription: this.promocionForm.value.promDescription,
      promStatus: this.promocionForm.value.promStatus,
      promUrlImage: this.promocionForm.value.promUrlImage,
      promDetail: this.promocionForm.value.PromoProductos
    };

    const formData = new FormData();
    formData.append('promotion', new Blob([JSON.stringify(promoEditReq)], { type: 'application/json' }));
    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.promocionService.edit(+id, formData).subscribe(
        (data: any) => {
          console.log("Promoción actualizada correctamente", data);
          this.router.navigate(['/promotions']);
        },
        (error) => {
          console.log("No se pudo actualizar la promoción", error);
        }
      );
    }
  }

  get PromoProductosArray() {
    return this.promocionForm.get('PromoProductos') as FormArray;
  }

  removePromoProducto(index: number) {
    this.PromoProductosArray.removeAt(index);
    this.filterProducts();
  }

  openModalProducto() {
    this.selectedIdProducto = 0; // Reinicia la selección
    this.isShowProductoModal = true;
    this.filterProducts();
  }

  closeModalProducto() {
    this.isShowProductoModal = false;
  }

  addProducto() {
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
  }

  filterProducts() {
    this.filteredProducts = this.products.filter(product => !this.PromoProductosArray.value.some((promoProduct: any) => promoProduct.id === product.id));
  }
}
