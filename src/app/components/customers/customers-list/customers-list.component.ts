import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { CustomerService } from '../service/customers.service';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-tbl-bootstrap',
  standalone: true,
  imports: [SharedModule, RouterModule],
  templateUrl: './customers-list.component.html',
  styleUrls: ['./customers-list.component.scss']
})
export class CustomerListModule implements OnInit {
  customers: any = [];
  filteredCustomers: any = [];
  searchForm: FormGroup;
  modalDeleteVisible: boolean = false;
  selectedCustomer: any = null;
  isEditMode = false;
  modalCustomerVisible = false;

  constructor(
    public customerService: CustomerService,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.searchForm = this.fb.group({
      lastName: ['']
    });
  }

  ngOnInit(): void {
    this.listCustomers();
    this.onChanges();
  }

  listCustomers() {
    this.customerService.list().subscribe((resp:any) => {
      this.customers = resp.data;
      this.filteredCustomers = resp.data;
    });
  }

  onChanges(): void {
    this.searchForm.get('lastName')?.valueChanges.subscribe(val => {
      this.filterCustomers(val);
    });
  }

  filterCustomers(lastName: string) {
    if (lastName) {
      this.filteredCustomers = this.customers.filter((customer: any) =>
        customer.custLastName.toLowerCase().includes(lastName.toLowerCase())
      );
    } else {
      this.filteredCustomers = this.customers;
    }
  }

  clearFilter() {
    this.searchForm.reset();
    this.filteredCustomers = this.customers;
  }
}
