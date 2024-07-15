import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ProductModel } from '../../../models/product.model';
import { ProductService } from '../../../services/product.service';
import { MaterialService } from '../../materials/service/materials.service';
import { MaterialModel } from 'src/app/models/material.model';
import { LotCreateReq, materialForm } from 'src/app/models/lot.model';
import { LotService } from 'src/app/services/lot.service';

@Component({
  selector: 'app-lot-create',
  standalone: true,
  imports: [RouterModule, SharedModule],
  templateUrl: './lot-create.component.html',
  styleUrl: './lot-create.component.scss'
})

export class LotCreateComponent implements OnInit {
  products: ProductModel[] = [];
  materials: MaterialModel[] = [];
  error: string | null = null;
  selectedIdMaterial: number = 0;
  isShowMaterialModal: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private productService: ProductService,
    private materialService: MaterialService,
    private lotService: LotService,
  ) {
  }

  lotForm: FormGroup = this.fb.group({
    proName: ['', Validators.required],
    lotQuantity: [null, [Validators.required, Validators.min(1)]],
    lotMaterials: this.fb.array([]),
    lotTotalCost: [Validators.required, Validators.min(0)]
  });

  materialForm: materialForm = {
    id: 0,
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

  ngOnInit(): void {
    this.getListProducts();
  }

  submitFormSaveLot() {
    this.lotCreateReq = {
      productId: this.lotForm.value.proName,
      lotQuantityProducts: this.lotForm.value.lotQuantity,
      lotTotalCost: this.lotForm.value.lotTotalCost,
      lotDetail: this.lotForm.value.lotMaterials,
    }
    this.lotService.createLot(this.lotCreateReq)
      .subscribe(
        (data: any) => {
          console.log("se a guardado correctamente", data);
          this.router.navigate(['/lots/list']);
        },
        (error) => {
          console.log("No se guardo", error);
        });
  }

  getListProducts() {
    this.productService.getProducts()
      .subscribe(
        (data: any) => {
          this.products = data.data.content;
        },
        (error) => {
          this.error = error.message;
          console.log("Error de traer lista de productos", error);
        }
      )
  }

  getListMaterials() {
    this.materialService.list()
      .subscribe(
        (data: any) => {
          this.materials = data.data;
          console.log("Listado los materiales", this.materials);
        },
        (error) => {
          this.error = error.message;
          console.log("Error de traer lista de productos", error);
        }
      )
  }

  get lotMaterialsArray() {
    return this.lotForm.get('lotMaterials') as FormArray;
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
      detQuantity: [this.materialForm.quantity, [Validators.required, Validators.min(1)]],
      detSubTotal: [this.materialForm.subTotal, Validators.required]
    }));
    this.updateTotalCost();
    this.isShowMaterialModal = false;
  }

  onMaterialSelect() {
    //const selectedMaterialId = this.selectedMaterial !== null ? Number(this.selectedMaterial) : null;
    const selectedMaterial = this.materials.find(material => material.id == this.selectedIdMaterial);
    if (selectedMaterial) {
      this.materialForm.priceUnit = Number((selectedMaterial.price / selectedMaterial.quantity).toFixed(2));
      this.materialForm.name = selectedMaterial.name;
    } else {
      console.log("Material no encontrado");
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
}


