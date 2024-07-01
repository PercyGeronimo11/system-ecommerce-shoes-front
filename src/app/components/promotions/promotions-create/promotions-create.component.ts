// angular import
import { Component, OnInit } from '@angular/core';

// project import
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors  } from '@angular/forms';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { PromocionService } from '../service/promotions.service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-tbl-bootstrap',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './promotions-create.component.html',
  styleUrls: ['./promotions-create.component.scss']
})
export class PromocionCreateModule implements OnInit{
  promocionForm: FormGroup;
  promt_percentage: any = null;
  promt_start_date: any = null;
  promt_end_date: any = null;
  promt_description: any = null;
  promt_status: any = null;
  promotions:any =[];
  constructor(
    public promocionService: PromocionService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.promocionForm = this.fb.group({
      promt_status: [false, Validators.required],
      promt_end_date: ['', Validators.required],
      promt_start_date: ['',Validators.required],
      promt_description: ['', Validators.required],
      promt_percentage: [0, Validators.required]
    });
  }


  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.promocionForm.valid) {
      this.promocionService.create(this.promocionForm.value).subscribe(
        (resp: any) => {
          console.log('Promoción creada exitosamente!', resp);
          this.router.navigate(['/promotions']);
        },
        error => {
          console.error('Error al crear la promoción', error);
        }
      );
    } else {
      console.error('El formulario no es válido');
    }
  }
}
