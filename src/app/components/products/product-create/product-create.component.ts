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
  constructor(
    private productService: ProductService,
    private categoryService: CategoriaService,
    private router: Router,
    private formBuilder: FormBuilder,
    //private modalService: NgbModal
  ) { }

  formGroupProduct: FormGroup = this.formBuilder.group({
    catId: ['', [Validators.required, Validators.nullValidator]],
    proName: ['', [Validators.required]],
    proDescription: ['', [Validators.required]],
    proUnitPrice: ['', [Validators.required]],
    proUnitCost: ['', [Validators.required]],
    proSizePlatform: ['', [Validators.required]],
    proSizeTaco: ['', [Validators.required]],
    proSize: [null, [Validators.required]],
    proColor: [null, [Validators.required]],
    proStock: [null, [Validators.required]],
    proUrlImage: ['', [Validators.required]]
  });

  ngOnInit(): void {
    this.categoryService.list()
    .subscribe((categories: any) =>{
      this.categories=categories.data;
    });
  }

  // onFileSelected(event: any) {

  // }

  onFileSelected2(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.selectedFile = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageToShow = e.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }
  onSubmit() {
    console.log("entraaaa");
    this.isLoading = true;
    this.error = null;
    const formData = new FormData();
    //const catIdValue = parseInt(this.formGroupProduct.value.catId, 10);
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
    }else{
      console.log("No se a seleccionado foto");
    }
  }

}
