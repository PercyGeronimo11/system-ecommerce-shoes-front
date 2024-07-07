import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Lot } from '../../../models/lot.model';
import { LotService } from '../../../services/lot.service';
import { RouterModule, Router } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import {LotCreateComponent} from '../lot-create/lot-create.component';
import { LotEditComponent } from '../lot-edit/lot-edit.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-lot-list',
  standalone: true,
  imports: [RouterModule,SharedModule],
  templateUrl: './lot-list.component.html',
  styleUrl: './lot-list.component.scss'
})

export class LotListComponent {
  lots: Lot[] = [];
  isLoading = false;
  error: string | null = null;
  modalRef: NgbModal | null=null;

  constructor( 
    private lotService: LotService,
    private modalService: NgbModal,
    private router: Router
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.lotService.getLots()
      .subscribe((lots: any )=> {
        this.lots = lots.data.content;
        this.isLoading = false;
        console.log("data:", lots);
      }, error => {
        this.error = error.message;
        this.isLoading = false;
        console.log("error:", error);
      });
  }

  deleteLot(id: number): void {
    this.lotService.deleteLot(id).subscribe(
      () => {
        //this.getLots(); // Refresh the list after deletion
      },
      (error) => {
        console.error('Error deleting lot', error);
      }
    );
  }
}