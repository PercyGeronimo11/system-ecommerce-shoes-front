import { Component, OnInit } from '@angular/core';
import { MaterialService } from '../service/materials.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-tbl-bootstrap',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './materials-edit.component.html',
  styleUrls: ['./materials-edit.component.scss']
})
export class MaterialEditModule implements OnInit {
  materialId: any;
  materialForm: FormGroup;

  constructor(
    public materialService: MaterialService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.materialForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      unitPrice: [0, [Validators.required, Validators.min(0.01)]],
      stock: [0, [Validators.required, Validators.min(1)]],
      unit: ['', Validators.required],
      description: [''],
      status: [true]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.materialId = +params['id'];
      
      this.materialService.get(this.materialId)
      .subscribe((resp: any) => {
        this.materialForm.patchValue(resp.data);
      }, error => {
        console.error('Error fetching material', error);
      });
    });
  }

  onSubmit(): void {
    if (this.materialForm.valid) {
      this.materialService.edit(this.materialId, this.materialForm.value).subscribe((resp: any) => {
        console.log('Material updated successfully!', resp);
        this.router.navigate(['/materials']);
      }, error => {
        console.error('Error updating material', error);
      });
    } else {
      this.materialForm.markAllAsTouched();
      console.error('Form is invalid');
    }
  }
}
