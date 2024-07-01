// angular import
import { Component, OnInit } from '@angular/core';

// project import
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MaterialService } from '../service/materials.service';

@Component({
  selector: 'app-tbl-bootstrap',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './materials-create.component.html',
  styleUrls: ['./materials-create.component.scss']
})
export class MaterialCreateModule implements OnInit{
  materialForm: FormGroup;
  name: any = null;
  unitPrice: any = null;
  stock: any = null;
  unit: any = null;
  description: any = null;
  materials:any =[];
  constructor(
    public materialService: MaterialService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.materialForm = this.fb.group({
      name: ['', Validators.required],
      unitPrice: [0, Validators.required],
      stock: [0, Validators.required],
      unit: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.materialForm.valid) {
      this.materialService.create(this.materialForm.value).subscribe((resp:any) => {
        console.log('Material created successfully!', resp);
        this.router.navigate(['/materials']);
      }, error => {
        console.error('Error creating material', error);
      });
    } else {
      console.error('Form is invalid');
    }
  }

}
