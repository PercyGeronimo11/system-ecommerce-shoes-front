import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ecommerceService } from '../service/ecomer.service';
import { SharedDataService } from '../../../services/shared-data.service';
import { EcommercePlantilla } from '../base-layout.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
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
    private sharedServ: SharedDataService
  ) {
    this.userecoForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

  }

  ngOnInit(): void { }
  onSubmit(): void {
    if (this.userecoForm.valid) {
      const { email, password } = this.userecoForm.value;
      this.userService.logIn(email, password).subscribe(
        (loginResp: any) => {
          //retorno del usuario
          this.sharedServ.setLoginResponse(loginResp);
          this.router.navigate(['/ecommers']);
        },
        loginError => {

          console.error('Error en la autenticación', loginError);
          this.errorMessage = 'Error en la autenticación: ' + loginError.error.message;
        }
      );
    } else {
      this.userecoForm.markAllAsTouched();
      this.errorMessage = 'El formulario es inválido';
    }
  }
}

