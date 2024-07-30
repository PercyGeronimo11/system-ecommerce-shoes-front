import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { SharedDataService } from '../../../services/shared-data.service';
import { EcommercePlantilla } from '../base-layout.component';
import { ecommerceService } from '../../../services/ecomer.service';
import { AuthService } from '../../auth/service/auth.service';
@Component({
  selector: 'app-ecommers-ingreso',
  standalone: true,
  imports: [SharedModule, RouterModule, CommonModule, EcommercePlantilla],
  templateUrl: './users-eco-ingreso.component.html',
  styleUrls: ['./users-eco-ingreso.component.scss']
})
export class EcommersIngresoModule implements OnInit {
  userecoForm: FormGroup;
  errorMessage: string = '';
  constructor(
    public userService: ecommerceService,
    private fb: FormBuilder,
    private router: Router,
    private sharedServ: SharedDataService,
    private authService: AuthService
  ) {
    this.userecoForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

  }

  ngOnInit(): void { }
  onSubmit(): void {
    if (this.userecoForm.valid) {
      const email = this.userecoForm.get('email')?.value;
      if (email !== 'admin@service.com') {
        this.authService.loginCustomer(this.userecoForm.value).subscribe(
          (Resp: any) => {
            const user = {
              username: Resp.username,
              role: Resp.rol,
              token: Resp.token
            };
            this.authService.setCustomer(user);
            this.authService.getCustomerObservable().subscribe(() => {
            this.router.navigate(['/ecommers']);
            });
          },
          (loginError) => {
            console.error('Error en la autenticación', loginError);
            this.errorMessage = 'Credenciales incorrectas: ' + loginError.error.message;
          }
        );
      } else {
        this.errorMessage = 'El correo electrónico proporcionado no puede ser usado.';
      }
    } else {
      this.errorMessage = 'El formulario es inválido';
    }
  }
  regresar(): void {
    this.router.navigate(['/ecommers']);
  }
}

