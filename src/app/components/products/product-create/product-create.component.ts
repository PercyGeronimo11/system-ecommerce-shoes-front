import { Component, OnInit } from '@angular/core';
import { ProductCreateReq } from '../../../models/product.model';
import { ProductService } from '../../../services/product.service';
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
  imageToShow: any;
  isWithTaco: Boolean=false;

  constructor(
    private productService: ProductService,
    private categoryService: CategoriaService,
    private router: Router,
    private formBuilder: FormBuilder,
  ) { }

  formGroupProduct: FormGroup = this.formBuilder.group({
    catId: ['', [Validators.required, Validators.nullValidator]],
    proName: ['', [Validators.required]],
    proDescription: [''],
    proUnitPrice: ['', [Validators.required, Validators.min(0)]],
    proSizePlatform: ['', [Validators.required, Validators.min(0)]],
    proSizeTaco: ['', [Validators.required, Validators.min(0)]],
    proSize: [null, [Validators.required, Validators.min(0)]],
    proColor: [null, [Validators.required]],
    proUrlImage: ['', [Validators.required]]
  });

  ngOnInit(): void {
    this.categoryService.list()
    .subscribe((categories: any) =>{
      this.categories=categories.data;
    });
  }

  onFileSelected2(event: any) {
    this.imageToShow='';
    if (event.target.files && event.target.files[0]) {
      this.selectedFile = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageToShow = e.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  onSelectedCategory(event: Event){
    const selectedCategoryId = (event.target as HTMLSelectElement).value;
    const selectedCategory = this.categories.find(category => category.id.toString() === selectedCategoryId);

    if (selectedCategory) {
      this.isWithTaco = selectedCategory.catHasTaco;
    } else {
      console.log("No hay la categoria", selectedCategory);
      this.isWithTaco = false;
    }
  
  }

  onSubmit() {
    for (const control in this.formGroupProduct.controls) {
      if (this.formGroupProduct.controls.hasOwnProperty(control)) {
        this.formGroupProduct.controls[control].markAsTouched();
      }
    }
    this.isLoading = true;
    this.error = null;
    const formData = new FormData();
    formData.append('catId', this.formGroupProduct.value.catId);
    formData.append('proName', this.formGroupProduct.value.proName);
    formData.append('proDescription', this.formGroupProduct.value.proDescription);
    formData.append('proUnitPrice', this.formGroupProduct.value.proUnitPrice);
    formData.append('proSizePlatform', this.formGroupProduct.value.proSizePlatform);
    formData.append('proSize', this.formGroupProduct.value.proSize);
    formData.append('proColor', this.formGroupProduct.value.proColor);
    formData.append('proSizeTaco', this.formGroupProduct.value.proSizeTaco);

    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
      this.productService.createProduct(formData).subscribe(
        ()=> {
          this.isLoading = false;
          this.router.navigate(['/products/list']);
        },
        error => {
          this.isLoading = false;
          this.error = error.message;
        });
    }else{
      console.log("No se a seleccionado foto");
    }
  }

}
