// Angular imports
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// Project imports
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { PromocionService } from '../service/promotions.service';

@Component({
  selector: 'app-tbl-bootstrap',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './promotions-edit.component.html',
  styleUrls: ['./promotions-edit.component.scss']
})
export class PromocionEditModule implements OnInit {
  promocionForm: FormGroup;
  promt_id: number | null = null;

  constructor(
    private fb: FormBuilder,
    private promocionService: PromocionService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.promocionForm = this.fb.group({
      promt_percentage: [0, Validators.required],
      promt_start_date: ['', Validators.required],
      promt_end_date: ['', Validators.required],
      promt_description: ['', Validators.required],
      promt_status: [false, Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.promt_id = parseInt(id, 10);
        this.promocionService.getById(this.promt_id).subscribe((promotion: any) => {
          this.promocionForm.patchValue(promotion.data);
        });
      }
    });
  }

  onSubmit(): void {
    if (this.promocionForm.valid) {
      if (this.promt_id !== null) {
        this.promocionService.edit(this.promt_id, this.promocionForm.value).subscribe((resp: any) => {
          console.log('Promocion updated successfully!', resp);
          this.router.navigate(['/promotions']);
        }, error => {
          console.error('Error updating promocion', error);
        });
      }
    } else {
      console.error('Form is invalid');
    }
  }
}
