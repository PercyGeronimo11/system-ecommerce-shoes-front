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
  products: ProductModel[] = [];
  materials: MaterialModel[] = [];
  error: string | null = null;
  selectedIdMaterial: number = 0;
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

  materialForm: materialForm = {
    id:0,
    name: '',
    quantity: 0,
    priceUnit: 0,
    subTotal: 0,
  }

  lotCreateReq: LotCreateReq = {
    productId: 0,
    lotQuantityProducts: 0,
    lotDetail: this.lotForm.value.lotMaterials,
    lotTotalCost: 0,
  }

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
        matName: [material.matName, Validators.required],
        detPriceUnit: [material.detPriceUnit, [Validators.required, Validators.min(1)]],
        detQuantityMaterials: [material.detQuantityMaterials, [Validators.required, Validators.min(1)]],
        detSubTotal: [material.detSubTotal, Validators.required]
      }));
    });
  }

  removeLotMaterial(index: number) {
    this.lotMaterialsArray.removeAt(index);
  }

  editMaterial(index: number) {
    this.lotMaterialsArray.removeAt(index);
  }

  openModalMaterial() {
    this.isShowMaterialModal = true;
    this.getListMaterials();
  }

  closeModalMaterial() {
    this.isShowMaterialModal = false;
  }

  addMaterial() {
    this.lotMaterialsArray.push(this.fb.group({
      name: [this.materialForm.name, Validators.required],
      detPriceUnit: [this.materialForm.priceUnit, [Validators.required, Validators.min(1)]],
      detQuantityMaterials: [this.materialForm.quantity, [Validators.required, Validators.min(1)]],
      detSubTotal: [this.materialForm.subTotal, Validators.required]
    }));
    this.updateTotalCost();
    this.isShowMaterialModal = false;
  }

  onMaterialSelect() {
    const selectedMaterial = this.materials.find(material => material.id === this.selectedIdMaterial);
    if (selectedMaterial) {
      this.materialForm.priceUnit = Number((selectedMaterial.price / selectedMaterial.quantity).toFixed(2));
      this.materialForm.name = selectedMaterial.name;
    }
  }

  onQuantityRead() {
    this.calculateSubTotal();
  }

  onPriceUnitRead() {
    this.calculateSubTotal();
  }

  calculateSubTotal() {
    if (this.materialForm.quantity && this.materialForm.priceUnit) {
      const quantity = Number(this.materialForm.quantity);
      const priceUnit = Number(this.materialForm.priceUnit);
      this.materialForm.subTotal = quantity * priceUnit;
    }
  }

  updateTotalCost() {
    let total = 0;
    this.lotMaterialsArray.controls.forEach(group => {
      total += group.get('detSubTotal')?.value || 0;
    });
    this.lotForm.get('lotTotalCost')?.setValue(total);
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

  submitFormSaveLot() {
    const lotUpdateReq: LotCreateReq = {
      productId: this.lotForm.value.proName,
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
  
  // removeLotMaterial(index: number) {
  //   this.lotMaterialsArray.removeAt(index);
  // }

  // editMaterial(index: number) {
  //   this.lotMaterialsArray.removeAt(index);
  // }

  // openModalMaterial() {
  //   this.isShowMaterialModal = true;
  //   this.getListMaterials();
  // }

  // closeModalMaterial() {
  //   this.isShowMaterialModal = false;
  // }

  // addMaterial() {
  //   this.lotMaterialsArray.push(this.fb.group({
  //     name: [this.materialForm.name, Validators.required],
  //     detPriceUnit: [this.materialForm.priceUnit, [Validators.required, Validators.min(1)]],
  //     detQuantity: [this.materialForm.quantity, [Validators.required, Validators.min(1)]],
  //     detSubTotal: [this.materialForm.subTotal, Validators.required]
  //   }));
  //   this.updateTotalCost();
  //   this.isShowMaterialModal = false;
  // }

  // onMaterialSelect() {
  //   //const selectedMaterialId = this.selectedMaterial !== null ? Number(this.selectedMaterial) : null;
  //   const selectedMaterial = this.materials.find(material => material.id == this.selectedIdMaterial);
  //   console.log("id",this.selectedIdMaterial);
  //   console.log("maerial:",selectedMaterial);
  //   console.log("lista",this.materials);
  //   if (selectedMaterial) {
  //     this.materialForm.priceUnit = Number((selectedMaterial.price / selectedMaterial.quantity).toFixed(2));
  //     this.materialForm.name = selectedMaterial.name;
  //   }
  // }

  // onQuantityRead() {
  //   this.calculateSubTotal();
  // }

  // onPriceUnitRead() {
  //   this.calculateSubTotal();
  // }

  // calculateSubTotal() {
  //   if (this.materialForm.quantity && this.materialForm.priceUnit) {
  //     const quantity = Number(this.materialForm.quantity);
  //     const priceUnit = Number(this.materialForm.priceUnit);
  //     this.materialForm.subTotal = quantity * priceUnit;
  //   }
  // }
  // updateTotalCost() {
  //   let total = 0;
  //   this.lotMaterialsArray.controls.forEach(group => {
  //     total += group.get('detSubTotal')?.value || 0;
  //   });
  //   this.lotForm.get('lotTotalCost')?.setValue(total);
  // }
}
