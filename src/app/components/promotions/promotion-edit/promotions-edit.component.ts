import { Component, OnInit } from '@angular/core';
import { PromocionService } from '../../../services/promotions.service';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ProductModel,PromoCreateReq } from 'src/app/models/product.model';
import { PromoDetailResp, PromoCompleteResp } from 'src/app/models/promotion.model';
import { ProductModule } from '../../products/product.module';

@Component({
  selector: 'app-tbl-bootstrap',
  standalone: true,
  imports: [SharedModule, RouterModule],
  templateUrl: './promotions-edit.component.html',
  styleUrls: ['./promotions-edit.component.scss']
})
export class PromotionsEditComponent implements OnInit {
  promotions: any = [];
  promoID: number=0;
  products: ProductModel[] = [];
  filteredProducts: ProductModel[] = [];
  selectedPromotion: any = null;

  isCreating: boolean = false;
  cargarpromodet: number = 1;
  selectedFile: File | null = null;
  SeleccionarIdProducto: number = 0;
  error: string | null = null;
  imageToShow: any = null;
  isShowProductoModal: boolean = false;

  promocionForm: FormGroup = this.fb.group({
    promPercentage: [0, Validators.required],
    promStartdate: ['', Validators.required],
    promEnddate: ['', Validators.required],
    promDescription: ['', Validators.required],
    promUrlImage: '',
    promStatus: [false, Validators.required],
    PromoDetProductos: this.fb.array([])
  });


  promoCompleteResp: PromoCompleteResp = {
    id: 0,
    promPercentage: 0,
    promStartdate: new Date(),
    promEnddate: new Date(),
    promDescription: '',
    promStatus: false,
    promUrlImage: '',
    promoDetail: this.promocionForm.value.PromoDetProductos
  }
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
    private route: ActivatedRoute,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.getProducts();
    this.getDetalles();
  }

  getDetalles() {
    this.promoID= this.route.snapshot.params['id'];
    this.promocionService.getById(this.promoID).subscribe(
      (response: { data: PromoCompleteResp }) => {
        const data = response.data;
        this.promocionForm.patchValue({
          promPercentage: data.promPercentage,
          promStartdate: data.promStartdate,
          promEnddate: data.promEnddate,
          promDescription: data.promDescription,
          promUrlImage: data.promUrlImage,
          promStatus: data.promStatus,
        });
        this.imageToShow = data.promUrlImage;
        data.promoDetail.forEach((detalle: PromoDetailResp) => {
          this.addProductoGuardados(detalle.id);
        });
      },
      (error) => {
        console.log("Error al obtener la promoción:", error);
      });
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

  submitFormEditprom() {
    this.promoCreateReq = {
      promPercentage: this.promocionForm.value.promPercentage,
      promStartdate: this.promocionForm.value.promStartdate,
      promEnddate: this.promocionForm.value.promEnddate,
      promDescription: this.promocionForm.value.promDescription,
      promStatus: this.promocionForm.value.promStatus,
      promUrlImage: this.promocionForm.value.promUrlImage,
      promDetail: this.PromoDetProductosArray.value
    };

    const formData = new FormData();
    formData.append('promotion', new Blob([JSON.stringify(this.promoCreateReq)], { type: 'application/json' }));
    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }
    this.promocionService.edit(this.promoID, formData).subscribe(
      (resp: any) => {
        console.log("Promoción actualizada:", resp);
        this.router.navigate(['/promotions']);
      },
      (error) => {
        this.error = error.message;
        console.error("Error al editar la promoción:",  this.error

         );
      }
    );
  }

  get PromoDetProductosArray() {
    return this.promocionForm.get('PromoDetProductos') as FormArray;
  }

  openModalProducto() {
    this.SeleccionarIdProducto = 0;
    this.isShowProductoModal = true;
    this.filterProducts();
  }

  closeModalProducto() {
    this.isShowProductoModal = false;
  }

  addProducto() {
    if (this.SeleccionarIdProducto != 0 ) {
      const productoSeleccionado = this.products.find(product => product.id == this.SeleccionarIdProducto);
      if (productoSeleccionado) {
        this.PromoDetProductosArray.push(this.fb.group({
          id: [productoSeleccionado.id, Validators.required],
          proName: [productoSeleccionado.proName, Validators.required],
        }));
        this.filterProducts();
        this.isShowProductoModal = false;
      } else {
        console.log("Producto no encontrado"+productoSeleccionado);
      }
    } else {
      this.SeleccionarIdProducto = 0;
    }
  }

  addProductoGuardados(idproductoGuardado: number) {
    const productoSeleccionado = this.products.find(product => product.id === idproductoGuardado);
    if (productoSeleccionado) {
      this.PromoDetProductosArray.push(this.fb.group({
        id: [productoSeleccionado.id, Validators.required],
        proName: [productoSeleccionado.proName, Validators.required],
      }));
      this.filterProducts();
    } else {
      console.log("Producto no encontrado");
    }
  }

  filterProducts() {
    this.filteredProducts = this.products.filter(product => !this.PromoDetProductosArray.value.some((promoProduct: any) => promoProduct.id === product.id));
  }

  removePromoProducto(index: number) {
    this.PromoDetProductosArray.removeAt(index);
    this.filterProducts();
  }
}
