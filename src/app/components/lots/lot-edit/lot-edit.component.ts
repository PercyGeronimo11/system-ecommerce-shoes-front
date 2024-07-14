import { Component, OnInit } from '@angular/core';
import { ProductModel } from '../../../models/product.model';
import { ProductService } from '../../../services/product.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MaterialService } from '../../materials/service/materials.service';
import { MaterialModel } from 'src/app/models/material.model';
import { LotCreateReq, LotDetailModelResp, materialForm } from 'src/app/models/lot.model';
import { LotService } from 'src/app/services/lot.service';

@Component({
  selector: 'app-lot-edit',
  standalone: true,
  imports: [RouterModule, SharedModule],
  templateUrl: './lot-edit.component.html',
  styleUrl: './lot-edit.component.scss'
})
export class LotEditComponent implements OnInit   {
  lotId: string='';
  productId: string='';
  products: ProductModel[] = [];
  materials: MaterialModel[] = [];
  error: string | null = null;
  selectedIdMaterial: number=0;
  isShowMaterialModal: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductService,
    private materialService: MaterialService,
    private lotService: LotService,
  ) {
  }
  lotForm: FormGroup = this.fb.group({
    productId: ['', Validators.required],
    lotQuantity: [null, [Validators.required, Validators.min(1)]],
    lotMaterials: this.fb.array([]),
    lotTotalCost: [Validators.required, Validators.min(0)]
  });

  ngOnInit(): void {
    this.lotId=this.route.snapshot.paramMap.get('id')||'';
    this.getLotComplete(this.lotId);
    this.getListProducts();
  }

  materialDetailsModal: materialForm = {
    id:0,
    name: '',
    quantity: 0,
    priceUnit: 0,
    subTotal: 0,
  }

  // lotCreateReq: LotCreateReq = {
  //   productId: 0,
  //   lotQuantityProducts: 0,
  //   lotDetail: this.lotForm.value.lotMaterials,
  //   lotTotalCost: 0,
  // }

  // ------------------------- Metodos ---------------------------
  getLotComplete(id:string){
    this.lotService.getLotService(id).subscribe(
      (data) => {
        this.lotForm.patchValue({
          productId: data.data.product.id,
          lotQuantity: data.data.lotQuantityProducts,
          lotTotalCost: data.data.lotTotalCost
        });
        this.setLotMaterials(data.data.lotDetails);
        this.productId= data.data.product.id;
      },
      error => {
        this.error = error.message;
        console.log("Error al cargar el lote", error);
      }
    );
  }

  get lotMaterialsArray() {
    return this.lotForm.get('lotMaterials') as FormArray;
  }

  setLotMaterials(materials: LotDetailModelResp[]) {
    materials.forEach(material => {
      this.lotMaterialsArray.push(this.fb.group({
        name: [material.name, Validators.required],
        detPriceUnit: [material.detPriceUnit, [Validators.required, Validators.min(1)]],
        detQuantity: [material.detQuantity, [Validators.required, Validators.min(1)]],
        detSubTotal: [material.detSubTotal, Validators.required]
      }));
    });
    console.log("Materiales:",materials);
  }

  openModalMaterial() {
    this.isShowMaterialModal = true;
    this.getListMaterials();
  }

  closeModalMaterial() {
    this.isShowMaterialModal = false;
  }
  getListMaterials() {
    this.materialService.list().subscribe(
      (data:any) => {
        this.materials = data.data;
      },
      error => {
        this.error = error.message;
        console.log("Error al obtener la lista de materiales", error);
      }
    );
  }
  onMaterialSelect() {
    const selectedMaterial = this.materials.find(material => material.id == this.selectedIdMaterial);
    if (selectedMaterial) {
      this.materialDetailsModal.priceUnit = Number((selectedMaterial.price / selectedMaterial.quantity).toFixed(2));
      this.materialDetailsModal.name = selectedMaterial.name;
    }else{
      console.log("Material No econtrado");
    }
  }
  onQuantityMaterialRead() {
    this.calculateSubTotal();
  }

  onPriceUnitMaterialRead() {
    this.calculateSubTotal();
  }

  addMaterial() {
    this.lotMaterialsArray.push(this.fb.group({
      name: [this.materialDetailsModal.name, Validators.required],
      detPriceUnit: [this.materialDetailsModal.priceUnit, [Validators.required, Validators.min(1)]],
      detQuantity: [this.materialDetailsModal.quantity, [Validators.required, Validators.min(1)]],
      detSubTotal: [this.materialDetailsModal.subTotal, Validators.required]
    }));
    this.updateTotalCost();
    this.isShowMaterialModal = false;
  }

  updateTotalCost() {
    let total = 0;
    this.lotMaterialsArray.controls.forEach(group => {
      total += group.get('detSubTotal')?.value || 0;
    });
    this.lotForm.get('lotTotalCost')?.setValue(total);
  }
  
  removeLotMaterial(index: number) {
    this.lotMaterialsArray.removeAt(index);
  }

  calculateSubTotal() {
    if (this.materialDetailsModal.quantity && this.materialDetailsModal.priceUnit) {
      const quantity = Number(this.materialDetailsModal.quantity);
      const priceUnit = Number(this.materialDetailsModal.priceUnit);
      this.materialDetailsModal.subTotal = Number((quantity * priceUnit).toFixed(2));
    }else{
      console.log("No se tiene asignado la cantidad ni el precio unitario");
    }
  }


  getListProducts() {
    this.productService.getProducts().subscribe(
      (data:any) => {
        this.products = data.data.content;
      },
      error => {
        this.error = error.message;
        console.log("Error al obtener la lista de productos", error);
      }
    );
  }

  submitFormSaveLot() {
    const lotUpdateReq: LotCreateReq = {
      productId: this.lotForm.value.productId,
      lotQuantityProducts: this.lotForm.value.lotQuantity,
      lotTotalCost: this.lotForm.value.lotTotalCost,
      lotDetail: this.lotForm.value.lotMaterials,
    };
    this.lotService.updateLotService(this.lotId, lotUpdateReq).subscribe(
      data => {
        console.log("Lote actualizado correctamente", data);
        this.router.navigate(['/lots/list']);
      },
      error => {
        console.log("Error al actualizar el lote", error);
      }
    );
  }

}
