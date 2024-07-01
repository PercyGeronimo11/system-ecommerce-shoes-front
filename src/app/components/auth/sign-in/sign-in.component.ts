// angular import
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [SharedModule, RouterModule],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export default class SignInComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe(
        (resp: any) => {
          localStorage.setItem('token', resp.token);
          localStorage.setItem('username', resp.username);
          this.router.navigate(['/materials']);
        },
        (error) => {
          console.error('Error logging in', error);
          this.errorMessage = 'Credenciales incorrectas. Vuelve a intentar';
        }
      );
    } else {
      this.errorMessage = 'Por favor, completa todos los campos correctamente.';
    }
  }
}
