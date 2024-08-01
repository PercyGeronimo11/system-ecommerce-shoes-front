import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ecommerceService } from '../../../services/ecomer.service';
import { EcommercePlantilla } from '../base-layout.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { SharedDataService } from '../../../services/shared-data.service';
import { AuthService } from '../../auth/service/auth.service';
@Component({
  selector: 'app-users-eco-create',
  standalone: true,
  imports: [SharedModule, RouterModule, CommonModule, EcommercePlantilla],
  templateUrl: './users-eco-create.component.html',
  styleUrls: ['./users-eco-create.component.scss']
})
export class UsersEcoCreateComponent implements OnInit {
  customerForm: FormGroup;
  loginForm: FormGroup;
  passwordFieldType: string = 'password';
  errorMessage: string | null = null;

  constructor(
    private ecommerceService: ecommerceService,
    private fb: FormBuilder,
    private router: Router,
    private sharedServ: SharedDataService,
    private authService: AuthService
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

    this.loginForm = this.fb.group({
      email: [''],
      password: ['']
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

        // Asignar los valores a loginForm
        this.loginForm.patchValue({
          email: formValue.custEmail,
          password: formValue.custPassword
        });
        if (this.loginForm.valid) {
          this.authService.loginCustomer(this.loginForm.value).subscribe(
            (lgresp: any) => {
              localStorage.setItem('tokencustomer', lgresp.token);
              localStorage.setItem('usernamecustomer', lgresp.username);
              localStorage.setItem('rolecustomer', lgresp.rol);
              // Actualizar el servicio con el nuevo usuario
              this.sharedServ.updateUser({
                username: lgresp.username,
                role: lgresp.rol
              });
              window.location.href = '/ecommers';
            },
            (error) => {
              console.error('Error al iniciar sesión después de crear el cliente:', error);
              this.errorMessage = 'Credenciales incorrectas: ';
            }
          );
        } else {
          this.errorMessage = 'Error al logearte.';
        }
      },
      (createError: any) => {
        this.errorMessage = createError;
        console.error('Error al crear el cliente:', createError);
      }
    );
  }

}
