// angular import
import { Component, OnInit } from '@angular/core';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MaterialService } from '../service/materials.service';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tbl-bootstrap',
  standalone: true,
  imports: [SharedModule, RouterModule],
  templateUrl: './materials-list.component.html',
  styleUrls: ['./materials-list.component.scss']
})
export class MaterialsListModule implements OnInit{
  name: any = null;
  unitPrice: any = null;
  stock: any = null;
  unit: any = null;
  description: any = null;
  materials:any =[];
  constructor(
    public materialService: MaterialService,
    private router: Router
  ) {
    
  }

  ngOnInit(): void {

    this.materialService.list().subscribe((resp:any) => {
      this.materials=resp.data;
      console.log(this.materials);
    })
  }

  selectMaterial(material:any):void{
    this.router.navigate(['/materialEdit', material.id]);
  }

}
