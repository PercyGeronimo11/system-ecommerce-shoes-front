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
      catName: ['', Validators.required],
      catDescription: [''],
      catStatus: [true, Validators.required],
      catHastaco: [true, Validators.required]
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
      catName: category?.catName || '',
      catDescription: category?.catDescription || '',
      catStatus: true,
      catHastaco: category?.catHastaco ?? true
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
      this.categories = this.categories.filter((cat: any) => cat.id !== id);
      this.closeModal();
    });
  }

  updateCategory(): void {
    if (this.categoryForm.valid) {
      this.categoriaService.edit(this.selectedCategory.id, this.categoryForm.value).subscribe((resp: any) => {
        const index = this.categories.findIndex((cat: any) => cat.id === this.selectedCategory.id);
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
      this.categoriaService.create(this.categoryForm.value).subscribe(
        (resp: any) => {
          if (resp.data.catDescription==''){
            resp.data.catDescription='No aplica'
          }
          this.categories.push(resp.data);
          this.closeModal();
        },
        error => {
          console.error('Error creating category', error);
        });
    } else {
      console.error('Form is invalid');
    }
  }
}
