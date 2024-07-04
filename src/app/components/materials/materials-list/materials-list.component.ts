// angular import
import { Component, OnInit } from '@angular/core';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MaterialService } from '../service/materials.service';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

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
  constructor(
    public materialService: MaterialService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.listMaterials();
  }

  selectMaterial(material:any):void{
    this.router.navigate(['/materialEdit', material.id]);
  }

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

}
