import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ecommerceService } from '../service/ecomer.service';
import { EcommercePlantilla } from '../base-layout.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
@Component({
  selector: 'app-users-eco-create',
  standalone: true,
  imports: [SharedModule,CommonModule, RouterModule,EcommercePlantilla],
  templateUrl: './users-eco-create.component.html',
  styleUrls: ['./users-eco-create.component.scss']
})
export class UsersEcoCreateComponent implements OnInit {
  customerForm: FormGroup;
  passwordFieldType: string = 'password';

  constructor(
    private ecommerceService: ecommerceService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.customerForm = this.fb.group({
      custFirstName: ['', Validators.required],
      custLastName: ['', Validators.required],
      custDni: ['', Validators.required],
      custEmail: ['', Validators.required],
      custDepartment: ['', Validators.required],
      custCity: ['', Validators.required],
      custProvince: ['', Validators.required],
      custPassword: ['', Validators.required],
      custCellphone:  ['', Validators.required],
    });
  }

  togglePasswordVisibility(): void {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.customerForm.valid) {
      this.ecommerceService.create(this.customerForm.value).subscribe((resp: any) =>  {
          console.log('Cliente creado exitosamente', resp);
          this.router.navigate(['/ecommers']);
        },
        error => {
          console.error('Error al crear el cliente', error);
        });
    }else {
      this.customerForm.markAllAsTouched();
      console.error('El formulario es inválido');
    }
  }
}
