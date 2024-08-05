// angular import
import { Component, OnInit } from '@angular/core';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { OrderService } from '../../services/order.service';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-tbl-bootstrap',
  standalone: true,
  imports: [SharedModule, RouterModule],
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.scss']
})
export class OrdersListModule implements OnInit {
  orders: any = [];
  modalDeleteVisible: boolean = false;
  selectedOrder: any = null;
  modalOrderDetail = false;
  detailOrders: any [] = [];
  modalMaterialVisible = false;
  constructor(
    private orderService: OrderService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.listOrders();
  }

  listOrders() {
    this.orderService.list().subscribe((resp:any) => {
      this.orders=resp.data;
    })
  }

  selectOrder(order: any) {
    console.log(order.ord_id);
    this.orderService.detail(order.ord_id).subscribe((resp: any) => {
      if (resp && resp.data && resp.data.length > 0) {
        this.detailOrders = resp.data.map((orderDetail: any) => ({
          customer: orderDetail.order.customer.usuario.name,
          producto: orderDetail.product.proName,
          quantity: orderDetail.odt_amount,
          price: orderDetail.odt_price,
          description: orderDetail.odt_description
        }));
        
        this.modalOrderDetail = true;
      } else {
        console.error("No se encontraron detalles de pedido para el pedido seleccionado.");
      }
    }, (error: any) => {
      console.error("Error al obtener los detalles de pedido:", error);
    });
  }

  openMaterialModal() {
    this.modalOrderDetail = true;
  }

  closeMaterialModal() {
    this.modalOrderDetail = false;
  }
}
