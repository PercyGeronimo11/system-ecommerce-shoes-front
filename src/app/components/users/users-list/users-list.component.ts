import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { UserService } from '../service/users.service';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-tbl-bootstrap',
  standalone: true,
  imports: [SharedModule, RouterModule],
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListModule implements OnInit {
  users: any = [];
  modalDeleteVisible: boolean = false;
  selectedUser: any = null;
  modalUserVisible = false;
  userForm: FormGroup;
  isEditMode = false;

  constructor(
    public userService: UserService,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.userForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', []],
      role: ['', Validators.required]
    });

    this.userForm.patchValue({
      role: 1
    });
  }

  ngOnInit(): void {
    this.listUsers();
  }

  listUsers() {
    this.userService.list().subscribe((resp: any) => {
      this.users = resp.data;
    });
  }

  deleteUserApi(id: any): void {
    this.userService.delete(id).subscribe(() => {
      console.log("Se eliminó correctamente");
      this.listUsers();
    });
  }

  // Modal de eliminar usuario
  openDeleteModal(user: any) {
    this.selectedUser = user;
    this.modalDeleteVisible = true;
  }

  closeDeleteModal() {
    this.modalDeleteVisible = false;
    this.selectedUser = null;
  }

  deleteUser() {
    if (this.selectedUser) {
      this.deleteUserApi(this.selectedUser.id);
      this.closeDeleteModal();
    }
  }

  // Modal de crear o editar usuario
  openUserModal() {
    this.isEditMode = false;
    this.userForm.reset({ role: 'USUARIO' });
    this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.userForm.get('password')?.updateValueAndValidity();
    this.userForm.reset({
      role: 1
    });
    this.modalUserVisible = true;
  }

  selectUser(user: any) {
    this.isEditMode = true;
    this.selectedUser = user;
    this.userForm.patchValue({
      username: user.name,
      email: user.username,
      role: user.role.id,
      password: '' // No llenar la contraseña en edición por seguridad
    });
    this.userForm.get('password')?.clearValidators();
    this.userForm.get('password')?.updateValueAndValidity();
    this.modalUserVisible = true;
  }

  closeUserModal() {
    this.modalUserVisible = false;
  }

  onSubmit() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const user = {
      ...this.userForm.value,
      id: this.isEditMode ? this.selectedUser?.id : undefined
    };

    if (this.isEditMode) {
      this.userService.edit(user.id, user).subscribe(() => {
        console.log('Usuario actualizado exitosamente!');
        this.listUsers();
        this.closeUserModal();
      }, error => {
        console.error('Error actualizando el usuario', error);
      });
    } else {
      this.userService.create(user).subscribe(() => {
        console.log('Usuario creado exitosamente!');
        this.listUsers();
        this.closeUserModal();
      }, error => {
        console.error('Error creando el usuario', error);
      });
    }
  }
}
