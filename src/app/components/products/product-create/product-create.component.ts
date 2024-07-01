import { Component, OnInit } from '@angular/core';
import { ProductCreate } from '../../../models/product/product.model';
import { ProductService } from '../../../services/products/product.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrl: './product-create.component.scss',
  standalone: true,
  imports: [SharedModule, RouterModule],
})
export default class ProductCreateComponent implements OnInit {
  product: ProductCreate = {
    id: 0,
    catId:2,
    proName: '',
    proDescription: '',
    proUnitPrice: 50,
    proSizePlatform: '',
    proSizeTacon: ''
  };
  isLoading = false;
  error: string | null = null;
  selectedFile: File | null = null;

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit() {
    // Initialize the product object with default values if needed
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }
  onSubmit() {
    this.isLoading = true;
    this.error = null;

    const formData = new FormData();
    formData.append('id', this.product.id.toString());
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
