// Angular imports
import { Component, OnInit } from '@angular/core';

// Project imports
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { PromocionService } from '../service/promotions.service';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-tbl-bootstrap',
  standalone: true,
  imports: [SharedModule, RouterModule],
  templateUrl: './promotions-list.component.html',
  styleUrls: ['./promotions-list.component.scss']
})
export class PromotionsListModule implements OnInit {
  PROMT_percentage: any = null;
  PROMT_start_date: any = null;
  PROMT_end_date: any = null;
  PROMT_description: any = null;
  PROMT_status: any = null;
  promotions: any = [];
  constructor(
    public promocionService: PromocionService,
  ) {

  }

  ngOnInit(): void {
    // Al inicializar el componente, se solicita la lista de promociones
    this.promocionService.list().subscribe((resp: any) => {
      this.promotions = resp.data;
      console.log(this.promotions); // Se muestra en consola las promociones recibidas
    });
  }
}
