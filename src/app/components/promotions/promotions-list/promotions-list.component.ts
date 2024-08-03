import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PromocionService } from '../../../services/promotions.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-tbl-bootstrap',
  standalone: true,
  imports: [SharedModule, RouterModule],
  templateUrl: './promotions-list.component.html',
  styleUrls: ['./promotions-list.component.scss']
})
export class PromotionsListComponent implements OnInit {
  promotions: any = [];
  modalRef: NgbModalRef | null = null;
  selectedPromotion: any = null;
  isCreating: boolean = false;
  modalDeleteVisible: boolean = false;
  constructor(
    public promocionService: PromocionService,
  ) {
  }

  ngOnInit(): void {
    this.listMaterials();
  }

  listMaterials() {
    this.promocionService.list().subscribe((resp: any) => {
      this.promotions = resp.data;
      console.log(this.promotions);
    });
  }
  // Modal de eliminar usuario
  openDeleteModal(promotion: any) {
    this.selectedPromotion = promotion;
    this.modalDeleteVisible = true;
  }
  deletePromocion() {
    if (this.selectedPromotion) {
      this.deletepromotionid(this.selectedPromotion.id);
      this.closeDeleteModal();
    }
  }
  closeDeleteModal() {
    this.modalDeleteVisible = false;
    this.selectedPromotion = null;
  }

  deletepromotionid(id:any):void{
    this.promocionService.delete(id).subscribe((resp:any) => {
      this.listMaterials();
    })
  }
}
