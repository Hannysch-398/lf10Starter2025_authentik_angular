import {Component, inject, signal, computed, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EmployeeService} from '../employee.service';
import {Employee} from '../Employee';
import {FormsModule} from '@angular/forms';
import {MatIcon} from "@angular/material/icon";
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIcon, MatIconModule, MatButtonModule],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css'
})
export class EmployeeListComponent implements OnInit {
  private employeeService = inject(EmployeeService);

  searchTerm = signal('');
  selectedEmployee = signal<Employee | null>(null);
  isEditMode = signal<boolean>(false);
  showDeleteModal = signal<boolean>(false);


  filteredEmployees = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.employeeService.employees().filter(e =>
      e.firstName?.toLowerCase().includes(term) ||
      e.lastName?.toLowerCase().includes(term)
    );
  });

  ngOnInit() {
    this.employeeService.fetchData();
  }

  selectEmployee(emp: Employee) {
    this.selectedEmployee.set(emp);
  }


  protected addEmployee() {

  }

  protected editEmployee() {

  }

  protected deleteEmployee() {

  }
}
