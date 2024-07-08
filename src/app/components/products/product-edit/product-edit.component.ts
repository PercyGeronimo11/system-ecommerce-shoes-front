import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { CategoriaService } from '../../categories/service/categories.service';
import { CategoryModel } from '../../../models/category.model';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-product-edit',
  standalone:true,
  imports: [RouterModule,SharedModule],
  templateUrl: './product-edit.component.html',
  styleUrl: './product-edit.component.scss'
})
export class ProductEditComponent{
  isLoading = false;
  error: string | null = null;
  selectedFile: File | null = null;
  categories: CategoryModel[] = [];
  imageToShow: any;
  formGroupProduct: FormGroup;
  productId: string;

  constructor(
    private productService: ProductService,
    private categoryService: CategoriaService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.formGroupProduct = this.formBuilder.group({
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
    this.productId = '';
  }

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id') || '';
    this.categoryService.list().subscribe((categories: any) => {
      this.categories = categories.data;
    });

    this.productService.getProductById(this.productId).subscribe(product => {
      this.formGroupProduct.patchValue(product);
      if (product.proUrlImage) {
        this.imageToShow = product.proUrlImage;
      }
    });
  }

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
    }

    this.productService.updateProduct(this.productId, formData).subscribe(
      () => {
        this.isLoading = false;
        this.router.navigate(['/products/list']);
      },
      error => {
        this.isLoading = false;
        this.error = error.message;
      }
    );
  }
}
