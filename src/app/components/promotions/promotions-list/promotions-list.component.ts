import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PromocionService } from '../service/promotions.service';
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
  promocionForm: FormGroup;
  promotions: any = [];
  selectedPromotion: any = null;
  modalRef: NgbModalRef | null = null;
  isCreating: boolean = false;
  selectedFile: File | null = null;
  imageToShow: any;
  constructor(
    public promocionService: PromocionService,
    private modalService: NgbModal,
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.promocionForm = this.fb.group({
      promPercentage: [0, [Validators.required, Validators.min(1), Validators.max(100)]],
      promStartdate: ['', Validators.required],
      promEnddate: ['', Validators.required],
      promDescription: ['', Validators.required],
    //  promUrlImage: ['', Validators.required],
      promStatus: [false, Validators.required]
    }, {
      validators: this.dateLessThan('promStartdate', 'promEnddate')
    });
  }

  // Validador personalizado para las fechas
  dateLessThan(startDate: string, endDate: string) {
    return (formGroup: FormGroup) => {
      const start = formGroup.controls[startDate];
      const end = formGroup.controls[endDate];

      if (start.value && end.value && new Date(start.value) >= new Date(end.value)) {
        end.setErrors({ dateLessThan: true });
      } else {
        end.setErrors(null);
      }
    };
  }

  ngOnInit(): void {
    this.promocionService.list().subscribe((resp: any) => {
      this.promotions = resp.data;
      console.log(this.promotions);
    });
  }

  openModal(content: any, promotion: any = null, action: string): void {
    this.isCreating = action === 'create';
    this.selectedPromotion = promotion ? { ...promotion } : null;
    this.selectedFile = null; // Reset the selected file
    this.promocionForm.reset({
      promPercentage: promotion?.promPercentage || 0,
      promStartdate: promotion?.promStartdate || '',
      promEnddate: promotion?.promEnddate || '',
      promDescription: promotion?.promDescription || '',
    //  promUrlImage: promotion?.promUrlImage || '',
      promStatus: promotion?.promStatus || false
    });
    this.modalRef = this.modalService.open(content, { centered: true });
  }

  closeModal(): void {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }

  onFileSelected(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.selectedFile = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageToShow = e.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  deletePromotion(id: number): void {
    this.promocionService.delete(id).subscribe(() => {
      this.promotions = this.promotions.filter((promo: any) => promo.id !== id);
      this.closeModal();
    });
  }

  updatePromotion(): void {
    if (this.promocionForm.valid) {
      const formData = new FormData();
      formData.append('promotion', new Blob([JSON.stringify(this.promocionForm.value)], { type: 'application/json' }));
      if (this.selectedFile) {
        formData.append('file', this.selectedFile);
      }

      this.promocionService.edit(this.selectedPromotion.id, formData).subscribe((resp: any) => {
        const index = this.promotions.findIndex((promo: any) => promo.id === this.selectedPromotion.id);
        if (index !== -1) {
          this.promotions[index] = { ...this.promotions[index], ...this.promocionForm.value };
        }
        this.closeModal();
      }, error => {
        console.error('Error updating promotion', error);
      });
    } else {
      console.error('Form is invalid');
    }
  }

  createPromotion(): void {
    if (this.promocionForm.valid) {
      const formData = new FormData();
      formData.append('promotion', new Blob([JSON.stringify(this.promocionForm.value)], { type: 'application/json' }));
      if (this.selectedFile) {
        formData.append('file', this.selectedFile);
      }

      this.promocionService.create(formData).subscribe((resp: any) => {
        this.promotions.push(resp.data);
        this.closeModal();
      }, error => {
        console.error('Error creating promotion', error);
      });
    } else {
      console.error('Form is invalid');
    }
  }
}
