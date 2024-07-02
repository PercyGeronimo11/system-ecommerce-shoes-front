import { Component, OnInit } from '@angular/core';
import { ProductCreate } from '../../../models/product/product.model';
import { ProductService } from '../../../services/products/product.service';
import { Router} from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrl: './product-create.component.scss',
})

export default class ProductCreateComponent implements OnInit {
  isLoading = false;
  error: string | null = null;
  selectedFile: File | null = null;

  constructor(
    private productService: ProductService,
    private router: Router,
    private formBuilder: FormBuilder,
  ) { }

  productForm: FormGroup = this.formBuilder.group({
    proName: ['',[Validators.required]],
    catId:2,
    proDescription: ['',[Validators.required]],
    proUnitPrice: ['',[Validators.required]],
    proSizePlatform: ['',[Validators.required]],
    proSizeTacon: ['',[Validators.required]],
    proUrlImage: ['',[Validators.required]]
  });
    product: ProductCreate = {
    id: 0,
    catId: 2,
    proName: '',
    proDescription: '',
    proUnitPrice: 50,
    proSizePlatform: '',
    proSizeTacon: ''
  };


  ngOnInit(): void {

  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }
  onSubmit() {

    this.isLoading = true;
    this.error = null;

    const formData = new FormData();
    formData.append('catId', this.product.catId.toString());
    formData.append('proName', this.product.proName);
    formData.append('proDescription', this.product.proDescription);
    formData.append('proUnitPrice', this.product.proUnitPrice.toString());
    formData.append('proSizePlatform', this.product.proSizePlatform);
    formData.append('proSizeTacon', this.product.proSizeTacon);
    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    this.productService.createProduct(formData)
      .subscribe(product => {
        this.isLoading = false;
        this.router.navigate(['products/list']);
      }, error => {
        this.isLoading = false;
        this.error = error.message;
      });
  }
}
