import { Component, OnInit, } from '@angular/core';
import { NgbModal, NgbModalRef, } from '@ng-bootstrap/ng-bootstrap'; // Importa las clases necesarias para el modal
import { CategoriaService, } from '../service/categories.service';
import { Router,RouterModule } from '@angular/router'; // Asegúrate de importar el Router si no lo has hecho
// Project imports
import { SharedModule } from 'src/app/theme/shared/shared.module';
@Component({
  selector: 'app-tbl-bootstrap',
  standalone: true,
  imports: [SharedModule, RouterModule],
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss']
})
export class CategoriesListComponent implements OnInit {
  categories: any = [];
  selectedCategory: any = null; // Para almacenar la categoria seleccionada
  modalRef: NgbModalRef | null = null; // Para gestionar el modal

  constructor(
    public categoriaService: CategoriaService,
    private modalService: NgbModal, // Inyecta el servicio de modales
    private router: Router // Inyecta el Router
  ) {}

  ngOnInit(): void {
    this.categoriaService.list().subscribe((resp: any) => {
      this.categories = resp.data;
      console.log(this.categories);
    });
  }

  openModal(content: any, category: any): void {
    this.selectedCategory = category;
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
}
