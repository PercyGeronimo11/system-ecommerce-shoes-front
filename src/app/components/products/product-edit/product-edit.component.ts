import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { CategoriaService } from '../../categories/service/categories.service';
import { CategoryModel } from '../../../models/category.model';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ProductModel } from 'src/app/models/product.model';

@Component({
  selector: 'app-product-edit',
  standalone: true,
  imports: [RouterModule, SharedModule],
  templateUrl: './product-edit.component.html',
  styleUrl: './product-edit.component.scss'
})
export class ProductEditComponent {
  isLoading = false;
  error: string | null = null;
  selectedFile: File | null = null;
  categories: CategoryModel[] = [];
  imageToShow: any;
  formGroupProduct: FormGroup;
  productId: string;
  isWithTaco: Boolean = false;

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
      proDescription: [''],
      proUnitPrice: ['', [Validators.required, Validators.min(0)]],
      proUnitCost: [''],
      proSizePlatform: ['', [Validators.required]],
      proSizeTaco: ['', [Validators.required, Validators.min(0)]],
      proSize: [null, [Validators.required, Validators.min(0)]],
      proColor: [null, [Validators.required]],
      proStock: [null],
      proUrlImage: ['', [Validators.required]]
    });
    this.productId = '';
  }

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id') || '';
    this.categoryService.list().subscribe((categories: any) => {
      this.categories = categories.data;
    });

    this.productService.getProductById(this.productId).subscribe(
      product => {
        if (product.data) {
          this.formGroupProduct.patchValue({
            catId: product.data.category?.id, 
            proName: product.data.proName,
            proDescription: product.data.proDescription,
            proUnitPrice: product.data.proUnitPrice,
            proUnitCost: product.data.proUnitCost,
            proSizePlatform: product.data.proSizePlatform,
            proSizeTaco: product.data.proSizeTaco,
            proSize: product.data.proSize,
            proColor: product.data.proColor,
            proStock: product.data.proStock,
            proUrlImage: product.data.proUrlImage
          });
          if (product.data.proUrlImage) {
            this.imageToShow = product.data.proUrlImage;
          }
          this.isWithTaco = product.data.category.catHasTaco;
        } else {
          console.error("El objeto de producto es undefined");
        }
      },
      (error) => {
        console.log("Error al obtener el producto:", error);
      });
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
