// angular import
import { Component, OnInit } from '@angular/core';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { UserService } from '../service/users.service';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tbl-bootstrap',
  standalone: true,
  imports: [SharedModule, RouterModule],
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListModule implements OnInit{
  users:any =[];
  constructor(
    public userService: UserService,
    private router: Router
  ) {
    
  }

  ngOnInit(): void {
    this.userService.list().subscribe((resp:any) => {
      this.users=resp.data;
      console.log(this.users);
    })
  }

  /* selectMaterial(material:any):void{
    this.router.navigate(['/materialEdit', material.id]);
  }

  deleteMaterial(id:any):void{
    this.materialService.delete(id).subscribe((resp:any) => {
      this.materialService.list().subscribe((resp:any) => {
        this.materials=resp.data;
        console.log(this.materials);
      })
    })
  } */

}
