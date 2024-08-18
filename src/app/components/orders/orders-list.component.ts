// angular import
import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { OrderService } from '../../services/order.service';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

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
  detailOrders: any[] = [];
  modalReviewVisible = false;
  modalCompletedVisible = false;
  orderSelected: any;
  modalObservedVisible = false;
  urlReviewVisible: string | null = null;
  constructor(
    private orderService: OrderService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.listOrders();
  }

  listOrders() {
    this.orderService.list().subscribe((resp: any) => {
      this.orders = resp.data;
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

  closeOrderModal() {
    this.modalOrderDetail = false;
  }

  openReviewModal(order: any) {
    this.orderSelected = order;
    this.orderService.getimage(this.orderSelected.ord_id).subscribe((resp: Blob) => {
      this.urlReviewVisible = URL.createObjectURL(resp);
    }, (error: any) => {
      console.error("Error al obtener la imagen:", error);
    });
    this.modalReviewVisible = true;
  }

  closeReviewModal() {
    this.modalReviewVisible = false;
  }

  ChangeStatusOrder(status: any) {
    var data = {
      status: status
    }
    this.orderService.changeStatus(this.orderSelected.ord_id, data).subscribe((resp: any) => {
      switch (status) {
        case 2:
          this.modalReviewVisible = false;
          break;
        case 4:
          this.modalCompletedVisible = false;
          break;
      }

      this.listOrders();
    }, (error: any) => {
      console.error("Error al obtener los detalles de pedido:", error);
    });
  }

  openCompletedModal(order: any) {
    this.orderSelected = order;
    this.modalCompletedVisible = true;
  }

  closeCompletedModal() {
    this.modalCompletedVisible = false;
  }

  openObservedModal() {
    this.modalReviewVisible = false;
    this.ChangeStatusOrder(3);
    this.modalObservedVisible = true;
  }

  closeObservedModal() {
    this.modalObservedVisible = false;
  }

  generateVoucherPDF(order: any) {
    if (order) {
      this.orderService.detail(order.ord_id).subscribe((response: any) => {
        if (response.status === 200) {
          const detailOrders = response.data.map((orderDetail: any) => ({
            product: orderDetail.product,
            odt_amount: orderDetail.odt_amount,
            odt_price: orderDetail.odt_price
          }));

          const doc = new jsPDF();

          // Add title
          doc.setFontSize(18);
          doc.text('Comprobante de Venta', 14, 22);

          // Add customer details
          doc.setFontSize(12);
          doc.text(`Cliente: ${order.customer.custFirstName} ${order.customer.custLastName}`, 14, 40);
          doc.text(`Fecha: ${order.ord_date}`, 14, 50);
          doc.text(`Total: S/${order.ord_total}`, 14, 60);

          // Add table
          const tableData = detailOrders.map((detail: any) => [
            detail.product.proName,
            detail.odt_amount,
            detail.odt_price,
            detail.odt_amount * detail.odt_price
          ]);

          (doc as any).autoTable({
            head: [['Producto', 'Cantidad', 'Precio', 'Total']],
            body: tableData,
            startY: 70
          });

          // Save the PDF
          doc.save(`voucher-${order.ord_id}.pdf`);
        } else {
          console.error('Error al obtener los detalles de la orden.');
        }
      }, (error: any) => {
        console.error('Error al obtener los detalles de la orden:', error);
      });
    } else {
      console.error('No hay una orden proporcionada.');
    }
  }
}
