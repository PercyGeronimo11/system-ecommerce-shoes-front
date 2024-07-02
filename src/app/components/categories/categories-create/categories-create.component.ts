// angular import
import { Component, OnInit } from '@angular/core';

// project import
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { CategoriaService } from '../service/categories.service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-tbl-bootstrap',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './categories-create.component.html',
  styleUrls: ['./categories-create.component.scss']
})
export class CategoriaCreateModule implements OnInit{
  categoriaForm: FormGroup;
  cat_name: any = null;
  cat_description: any = null;
  cat_status: any = null;
  categories:any =[];
  constructor(
    public categoriaService: CategoriaService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.categoriaForm = this.fb.group({
      cat_status: [false, Validators.required],
      cat_name: ['', Validators.required],
      cat_description: ['', Validators.required]
    });
  }


  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.categoriaForm.valid) {
      this.categoriaService.create(this.categoriaForm.value).subscribe(
        (resp: any) => {
          console.log('Categoria creada exitosamente!', resp);
          this.router.navigate(['/categories']);
        },
        error => {
          console.error('Error al crear la categoria', error);
        }
      );
    } else {
      console.error('El formulario no es válido');
    }
  }
}
