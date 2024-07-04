import { Component, OnInit } from '@angular/core';
import { ProductCreateReq } from '../../../models/product/product.model';
import { ProductService } from '../../../services/products/product.service';
import { CategoriaService } from '../../categories/service/categories.service';
import { Router } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {CategoryModel} from '../../../models/category.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrl: './product-create.component.scss',
})

export class ProductCreateComponent implements OnInit {
  isLoading = false;
  error: string | null = null;
  selectedFile: File | null = null;
  categories: CategoryModel[]=[];

  constructor(
    private productService: ProductService,
    private categoryService: CategoriaService,
    private router: Router,
    private formBuilder: FormBuilder,
    //private modalService: NgbModal
  ) { }

  formGroupProduct: FormGroup = this.formBuilder.group({
    proName: ['', [Validators.required]],
    catId: 2,
    proDescription: ['', [Validators.required]],
    proUnitPrice: ['', [Validators.required]],
    proSizePlatform: ['', [Validators.required]],
    proSizeTacon: ['', [Validators.required]],
    proUrlImage: ['', [Validators.required]]
  });

  ngOnInit(): void {
    this.categoryService.list()
    .subscribe((categories: any) =>{
      this.categories=categories.data;
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onSubmit() {
    console.log("entraaaa");
    this.isLoading = true;
    this.error = null;
    const formData = new FormData();
    // formData.append('catId', this.formGroupProduct.value.catId)
    // formData.append('proName', this.formGroupProduct.value.proName);
    // formData.append('proDescription', this.formGroupProduct.value.proDescription);
    // formData.append('proUnitPrice', this.formGroupProduct.value.proUnitPrice.toString());
    // formData.append('proSizePlatform', this.formGroupProduct.value.proSizePlatform);
    // formData.append('proSizeTacon', this.formGroupProduct.value.proSizeTacon);

    formData.append('catId', this.formGroupProduct.get('catId')!.value);
    formData.append('proName', this.formGroupProduct.get('proName')!.value);
    formData.append('proDescription', this.formGroupProduct.get('proDescription')!.value);
    formData.append('proUnitPrice', this.formGroupProduct.get('proUnitPrice')!.value.toString());
    formData.append('proSizePlatform', this.formGroupProduct.get('proSizePlatform')!.value);
    formData.append('proSizeTacon', this.formGroupProduct.get('proSizeTacon')!.value);

    console.log("se lleno form-data");
    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
      console.log("seleccionado para file");
      this.productService.createProduct(formData)
        .subscribe(()=> {
          console.log("exitoso consumo api");
          this.isLoading = false;
          this.router.navigate(['/products/list']);
        }, error => {
          this.isLoading = false;
          this.error = error.message;
        });
    }
  }
}
