// angular import
import { Component, OnInit } from '@angular/core';

// project import
import { MaterialService } from '../service/materials.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Router, ActivatedRoute  } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-tbl-bootstrap',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './materials-edit.component.html',
  styleUrls: ['./materials-edit.component.scss']
})
export class MaterialEditModule implements OnInit{
  materialId: any;
  materialForm: FormGroup;
  constructor(
    public materialService: MaterialService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.materialForm = this.fb.group({
      name: ['', Validators.required],
      unitPrice: [0, Validators.required],
      stock: [0, Validators.required],
      unit: ['', Validators.required],
      description: [''],
      status: [true]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.materialId = +params['id'];
      this.materialService.get(this.materialId).subscribe((resp:any) => {
        console.log('Material created successfully!', resp);
        this.materialForm.patchValue(resp.data);
      }, error => {
        console.error('Error creating material', error);
      });
    });
  }

  onSubmit(): void {
    if (this.materialForm.valid) {
      this.materialService.edit(this.materialId,this.materialForm.value).subscribe((resp:any) => {
        console.log('Material updated successfully!', resp);
        this.router.navigate(['/materials']);
      }, error => {
        console.error('Error creating material', error);
      });
    } else {
      console.error('Form is invalid');
    }
  }

  

}
