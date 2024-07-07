//import { CommonModule } from '@angular/common';
//import { RouterModule } from '@angular/router';
//  imports: [SharedModule,RouterModule,CommonModule,EcommercePlantilla],
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ecommerceService } from '../service/ecomer.service';
import { EcommercePlantilla } from '../base-layout.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-users-eco-create',
  standalone: true,
  imports: [SharedModule,RouterModule,CommonModule,EcommercePlantilla],
  templateUrl: './users-eco-create.component.html',
  styleUrls: ['./users-eco-create.component.scss']
})
export class UsersEcoCreateComponent implements OnInit {
  createAccountForm: FormGroup;
  passwordFieldType: string = 'password';
  constructor(private fb: FormBuilder) {
    this.createAccountForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dni: ['', Validators.required],
      department: ['', Validators.required],
      birthDate: ['', Validators.required],
      city: ['', Validators.required],
      province: ['', Validators.required],
      cellphone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      status: [1], // Valor por defecto para status
      use_register_date: [new Date().toISOString()], // Fecha del sistema
      rol_id: [3] // Valor por defecto para rol_id
    });
  }
  togglePasswordVisibility(): void {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }
  ngOnInit(): void { }

  onSubmit(): void {
    if (this.createAccountForm.valid) {
      console.log('Formulario enviado', this.createAccountForm.value);
      // Aquí puedes manejar el envío del formulario, como hacer una petición HTTP
    }
  }
}
