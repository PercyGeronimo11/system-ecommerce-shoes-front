import { Component, OnInit, } from '@angular/core';
import { NgbModal, NgbModalRef, } from '@ng-bootstrap/ng-bootstrap'; // Importa las clases necesarias para el modal
import { PromocionService, } from '../service/promotions.service';
import { Router,RouterModule } from '@angular/router'; // Asegúrate de importar el Router si no lo has hecho
// Project imports
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
  selectedPromotion: any = null; // Para almacenar la promoción seleccionada
  modalRef: NgbModalRef | null = null; // Para gestionar el modal

  constructor(
    public promocionService: PromocionService,
    private modalService: NgbModal, // Inyecta el servicio de modales
    private router: Router // Inyecta el Router
  ) {}

  ngOnInit(): void {
    this.promocionService.list().subscribe((resp: any) => {
      this.promotions = resp.data;
      console.log(this.promotions);
    });
  }

  openModal(content: any, promotion: any): void {
    this.selectedPromotion = promotion;
    this.modalRef = this.modalService.open(content, { centered: true });
  }

  closeModal(): void {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }

  deletePromotion(id: number): void {
    this.promocionService.delete(id).subscribe(() => {
      this.promotions = this.promotions.filter((promo: any) => promo.promt_id !== id);
      this.closeModal();
    });
  }
}
