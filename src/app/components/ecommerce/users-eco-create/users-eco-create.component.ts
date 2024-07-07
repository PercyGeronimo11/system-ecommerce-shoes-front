import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ecommerceService } from '../service/ecomer.service';
@Component({
  selector: 'app-tbl-bootstrap',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './users-eco-create.component.html',
  styleUrls: ['./users-eco-create.component.scss']
})
export class EcommersCreateModule implements OnInit {
  userecoForm: FormGroup;

  constructor(
    public userService: ecommerceService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.userecoForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required]
    });

    this.userecoForm.patchValue({
      role: 3
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.userecoForm.valid) {
      this.userService.create(this.userecoForm.value).subscribe((resp: any) => {
        console.log('Usuario creado exitosamente!', resp);
        this.router.navigate(['/users']);
      }, error => {
        console.error('Error creando el usuario', error);
      });
    } else {
      this.userecoForm.markAllAsTouched();
      console.error('El formulario es inválido');
    }
  }
}
