// Angular imports
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// Project imports
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { CategoriaService } from '../service/categories.service';

@Component({
  selector: 'app-tbl-bootstrap',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './categories-edit.component.html',
  styleUrls: ['./categories-edit.component.scss']
})
export class CategoriaEditModule implements OnInit {
  categoriaForm: FormGroup;
  cat_id: number | null = null;

  constructor(
    private fb: FormBuilder,
    private categoriaService: CategoriaService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.categoriaForm = this.fb.group({
      cat_name: ['', Validators.required],
      cat_description: ['', Validators.required],
      cat_status: [false, Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.cat_id = parseInt(id, 10);
        this.categoriaService.getById(this.cat_id).subscribe((category: any) => {
          this.categoriaForm.patchValue(category.data);
        });
      }
    });
  }

  onSubmit(): void {
    if (this.categoriaForm.valid) {
      if (this.cat_id !== null) {
        this.categoriaService.edit(this.cat_id, this.categoriaForm.value).subscribe((resp: any) => {
          console.log('categoria updated successfully!', resp);
          this.router.navigate(['/categories']);
        }, error => {
          console.error('Error updating categoria', error);
        });
      }
    } else {
      console.error('Form is invalid');
    }
  }
}
