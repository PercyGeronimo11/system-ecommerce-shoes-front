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
            product: orderDetail.product.proName,
            odt_amount: orderDetail.odt_amount,
            odt_price: orderDetail.odt_price,
            total: orderDetail.odt_amount * orderDetail.odt_price
          }));
  
          const doc = new jsPDF({
            format: [100, 160] 
          });
  
          // Título del comprobante
          doc.setFontSize(14);
          doc.setFont("helvetica", "bold");
          doc.text('Comprobante de Venta', 40, 10, { align: 'center' });
  
          // Detalles del cliente
          doc.setFontSize(10);
          doc.setFont("helvetica", "normal");
          doc.text(`Cliente: ${order.customer.custFirstName} ${order.customer.custLastName}`, 5, 20);
          doc.text(`Fecha: ${order.ord_date}`, 5, 26);
          doc.text(`Total: S/${order.ord_total}`, 5, 32);
  
          // Espacio antes de la tabla
          doc.text('Detalles de la compra:', 5, 40);
  
          // Crear tabla
          const tableData = detailOrders.map((detail: any) => [
            detail.product,
            detail.odt_amount,
            `S/${detail.odt_price.toFixed(2)}`,
            `S/${detail.total.toFixed(2)}`
          ]);
  
          (doc as any).autoTable({
            head: [['Producto', 'Cant.', 'Precio', 'Total']],
            body: tableData,
            startY: 45,
            theme: 'striped',
            styles: {
              fontSize: 8,
              cellPadding: 2
            },
            columnStyles: {
              0: { cellWidth: 40 }, // Producto
              1: { cellWidth: 10 }, // Cantidad
              2: { cellWidth: 15 }, // Precio Unitario
              3: { cellWidth: 15 }  // Total
            }
          });
  
          // Mostrar total final
          const finalY = (doc as any).lastAutoTable.finalY; // Posición final de la tabla
          doc.setFontSize(10);
          doc.text(`Monto Total: S/${order.ord_total.toFixed(2)}`, 5, finalY + 10);
  
          // Guardar PDF
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
