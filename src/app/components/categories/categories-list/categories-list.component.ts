import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CategoriaService } from '../service/categories.service';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-tbl-bootstrap',
  standalone: true,
  imports: [SharedModule, RouterModule],
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss']
})
export class CategoriesListComponent implements OnInit {
  categoryForm: FormGroup;
  categories: any = [];
  selectedCategory: any = null;
  modalRef: NgbModalRef | null = null;
  isCreating: boolean = false;

  constructor(
    public categoriaService: CategoriaService,
    private modalService: NgbModal,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.categoryForm = this.fb.group({
      cat_name: ['', Validators.required],
      cat_description: ['', Validators.required],
      cat_status: [false, Validators.required]
    });
  }

  ngOnInit(): void {
    this.categoriaService.list().subscribe((resp: any) => {
      this.categories = resp.data;
      console.log(this.categories);
    });
  }

  openModal(content: any, category: any = null, action: string): void {
    this.isCreating = action === 'create';
    this.selectedCategory = category ? { ...category } : null;
    this.categoryForm.reset({
      cat_name: category?.cat_name || '',
      cat_description: category?.cat_description || '',
      cat_status: true
    });
    this.modalRef = this.modalService.open(content, { centered: true });
  }

  closeModal(): void {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }

  deleteCategory(id: number): void {
    this.categoriaService.delete(id).subscribe(() => {
      this.categories = this.categories.filter((cat: any) => cat.cat_id !== id);
      this.closeModal();
    });
  }

  updateCategory(): void {
    if (this.categoryForm.valid) {
      this.categoriaService.edit(this.selectedCategory.cat_id, this.categoryForm.value).subscribe((resp: any) => {
        const index = this.categories.findIndex((cat: any) => cat.cat_id === this.selectedCategory.cat_id);
        if (index !== -1) {
          this.categories[index] = { ...this.categories[index], ...this.categoryForm.value };
        }
        this.closeModal();
      }, error => {
        console.error('Error updating category', error);
      });
    } else {
      console.error('Form is invalid');
    }
  }

  createCategory(): void {
    if (this.categoryForm.valid) {
      this.categoriaService.create(this.categoryForm.value).subscribe((resp: any) => {
        this.categories.push(resp.data);
        this.closeModal();
      }, error => {
        console.error('Error creating category', error);
      });
    } else {
      console.error('Form is invalid');
    }
  }
}
