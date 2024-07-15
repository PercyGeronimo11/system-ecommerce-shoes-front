import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ecommerceService } from '../service/ecomer.service';
import { EcommercePlantilla } from '../base-layout.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { SharedDataService } from '../../../services/shared-data.service';
@Component({
  selector: 'app-users-eco-create',
  standalone: true,
  imports: [SharedModule, RouterModule, CommonModule, EcommercePlantilla],
  templateUrl: './users-eco-create.component.html',
  styleUrls: ['./users-eco-create.component.scss']
})
export class UsersEcoCreateComponent implements OnInit {
  customerForm: FormGroup;
  passwordFieldType: string = 'password';

  constructor(
    private ecommerceService: ecommerceService,
    private fb: FormBuilder,
    private router: Router,
    private sharedServ: SharedDataService
  ) {
    this.customerForm = this.fb.group({
      custFirstName: ['', Validators.required],
      custLastName: ['', Validators.required],
      custDni: ['', [
        Validators.required,
        Validators.pattern(/^\d{8}$/) // Exactamente 8 dígitos
      ]],
      custEmail: ['', [Validators.required, Validators.email]],
      custDepartment: ['', Validators.required],
      custCity: ['', Validators.required],
      custProvince: ['', Validators.required],
      custPassword: ['', [Validators.required]],
      custCellphone: ['', [
        Validators.required,
        Validators.pattern(/^\d{9}$/)
      ]],
      custBirthDate: ['']
    });
  }

  togglePasswordVisibility(): void {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  ngOnInit(): void { }

  onSubmit(): void {
    if (this.customerForm.invalid) {
      this.customerForm.markAllAsTouched();
      console.error('El formulario es inválido');
      return;
    }

    const formValue = this.customerForm.value;


    if (!formValue.custBirthDate) {
      formValue.custBirthDate = new Date().toISOString().split('T')[0];
    }

    this.ecommerceService.create(formValue).subscribe(
      (resp: any) => {

        console.log('Cliente creado:', resp);


        this.ecommerceService.logIn(formValue.custEmail, formValue.custPassword).subscribe(
          (loginResp: any) => {
            console.log('Inicio de sesión exitoso:', loginResp);
            this.sharedServ.setLoginResponse(loginResp);
              this.router.navigate(['/ecommers']);
          },
          (loginError: any) => {
            console.error('Error al iniciar sesión después de crear el cliente:', loginError);
          }
        );
      },
      (createError: any) => {
        console.error('Error al crear el cliente:', createError);
      }
    );
  }
}

