// angular import
import { Component, OnInit } from '@angular/core';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MaterialService } from '../service/materials.service';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-tbl-bootstrap',
  standalone: true,
  imports: [SharedModule, RouterModule],
  templateUrl: './materials-list.component.html',
  styleUrls: ['./materials-list.component.scss']
})
export class MaterialsListModule implements OnInit {
  materials: any = [];
  modalDeleteVisible: boolean = false;
  selectedMaterial: any = null;
  isEditMode = false;
  materialForm: FormGroup;
  modalMaterialVisible = false;
  constructor(
    public materialService: MaterialService,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.materialForm = this.fb.group({
      name: ['', [Validators.required]],
      stock: ['', [Validators.required]],
      unitPrice: ['', [Validators.required]],
      unit: ['', [Validators.required]],
      description: ['', []],
    });
  }

  ngOnInit(): void {
    this.listMaterials();
  }

  /* selectMaterial(material:any):void{
    this.router.navigate(['/materialEdit', material.id]);
  } */

  listMaterials() {
    this.materialService.list().subscribe((resp:any) => {
      this.materials=resp.data;
    })
  }

  deleteMaterialApi(id:any):void{
    this.materialService.delete(id).subscribe((resp:any) => {
      this.listMaterials();
    })
  }

  // Modal de eliminar usuario
  openDeleteModal(material: any) {
    this.selectedMaterial = material;
    this.modalDeleteVisible = true;
  }

  closeDeleteModal() {
    this.modalDeleteVisible = false;
    this.selectedMaterial = null;
  }

  deleteMaterial() {
    if (this.selectedMaterial) {
      this.deleteMaterialApi(this.selectedMaterial.id);
      this.closeDeleteModal();
    }
  }

  selectMaterial(material: any) {
    this.isEditMode = true;
    this.selectedMaterial = material;
    this.materialForm.patchValue({
      name: material.name,
      stock: material.stock,
      unitPrice: material.unitPrice,
      unit: material.unit,
      description: material.descripcion
    });
    this.modalMaterialVisible = true;
  }

  openMaterialModal() {
    this.isEditMode = false;
    this.materialForm.reset({
      unit: 'm'
    });
    this.modalMaterialVisible = true;
  }

  closeMaterialModal() {
    this.modalMaterialVisible = false;
  }

  onSubmitMaterial() {
    if (this.materialForm.invalid) {
      this.materialForm.markAllAsTouched();
      return;
    }

    const user = {
      ...this.materialForm.value,
      id: this.isEditMode ? this.selectedMaterial?.id : undefined
    };

    if (this.isEditMode) {
      this.materialService.edit(user.id, user).subscribe(() => {
        console.log('Material actualizado exitosamente!');
        this.listMaterials();
        this.closeMaterialModal();
      }, error => {
        console.error('Error actualizando el material', error);
      });
    } else {
      this.materialService.create(user).subscribe(() => {
        console.log('Material creado exitosamente!');
        this.listMaterials();
        this.closeMaterialModal();
      }, error => {
        console.error('Error creando el material', error);
      });
    }
  }
}
