import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { UserService } from '../service/users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tbl-bootstrap',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './users-create.component.html',
  styleUrls: ['./users-create.component.scss']
})
export class UsersCreateModule implements OnInit {
  userForm: FormGroup;

  constructor(
    public userService: UserService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required]
    });

    this.userForm.patchValue({
      role: 1
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.userForm.valid) {
      this.userService.create(this.userForm.value).subscribe((resp: any) => {
        console.log('Usuario creado exitosamente!', resp);
        this.router.navigate(['/users']);
      }, error => {
        console.error('Error creando el usuario', error);
      });
    } else {
      this.userForm.markAllAsTouched();
      console.error('El formulario es inválido');
    }
  }
}
