import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {BehaviorSubject, Observable, of} from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Employee } from "../Employee";
import { AuthService } from "../auth.service";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css'
})
export class EmployeeListComponent {
 // private employeesSubject = new BehaviorSubject<Employee[]>([]);
  employees$: Observable<Employee[]>;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.employees$ = of([]);
    this.fetchData();
  }

  fetchData() {
    this.employees$ = this.http.get<Employee[]>('http://localhost:8089/employees');
  }

 /* addEmployee(emp: Employee) {
    this.employeesSubject.next([...this.employeesSubject.value, emp]);
  }

  */

}
