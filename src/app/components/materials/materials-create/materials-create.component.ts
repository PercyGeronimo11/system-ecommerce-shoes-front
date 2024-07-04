import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MaterialService } from '../service/materials.service';

@Component({
  selector: 'app-tbl-bootstrap',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './materials-create.component.html',
  styleUrls: ['./materials-create.component.scss']
})
export class MaterialCreateModule implements OnInit {
  materialForm: FormGroup;

  constructor(
    public materialService: MaterialService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.materialForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      unitPrice: [0, [Validators.required, Validators.min(0.01)]],
      stock: [0, [Validators.required, Validators.min(1)]],
      unit: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.materialForm.valid) {
      this.materialService.create(this.materialForm.value).subscribe((resp: any) => {
        console.log('Material creado exitosamente!', resp);
        this.router.navigate(['/materials']);
      }, error => {
        console.error('Error creando el material', error);
      });
    } else {
      this.materialForm.markAllAsTouched();
      console.error('El formulario es inválido');
    }
  }
}
