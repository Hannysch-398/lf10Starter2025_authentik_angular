import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../employee.service';
import { Employee } from '../Employee';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

  toggleEditView() {
    if (this.selectedEmployee()) {
      this.isEditMode.set(true);
    }
  }

  closeEditView() {
    this.isEditMode.set(false);
    this.selectedEmployee.set(null);
  }

  openDeleteDialog() {
    if (this.selectedEmployee()) {
      this.showDeleteModal.set(true);
    }
  }

  executeDelete() {
    const id = this.selectedEmployee()?.id;
    if (id) {
      this.employeeService.deleteEmployee(id).subscribe({
        next: () => {
          this.employeeService.fetchData();
          this.showDeleteModal.set(false);
          this.isEditMode.set(false);
          this.selectedEmployee.set(null);
        },
        error: (err) => console.error('Löschen fehlgeschlagen', err)
      });
    }
  }
}
