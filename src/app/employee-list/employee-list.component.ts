import {Component, computed, inject, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Employee } from "../Employee";
import { RouterModule } from '@angular/router';
import {EmployeeService} from "../employee.service";
import {MatDialogModule, MatDialog} from '@angular/material/dialog';



@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css'
})
export class EmployeeListComponent {
  private employeeService = inject(EmployeeService);
  private dialog = inject(MatDialog);

  private service = inject(EmployeeService);


  // Computed Signal für die Liste
  employees = computed(() => this.service.employees());

  constructor() {
    // Liste beim Start laden
    this.service.fetchData();
  }

  delete(emp: Employee) {
    if (confirm(`Mitarbeiter ${emp.firstName} ${emp.lastName} wirklich löschen?`)) {
      this.service.deleteEmployee(emp.id!);
    }
  }




}
