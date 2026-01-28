import {Component, computed, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import {BehaviorSubject, Observable, of} from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Employee } from "../Employee";
import { AuthService } from "../auth.service";
import { RouterModule } from '@angular/router';
import {EmployeeService} from "../employee.service";


@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css'
})
export class EmployeeListComponent {

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
  /*
 //private employeesSubject = new BehaviorSubject<Employee[]>([]);
  employees$: Observable<Employee[]>;
  //employees$: Observable<Employee[]> = employeesStore.asObservable();

  //private store = inject(EmployeeStoreService);-> warten auf Service
  // Computed Signal für die Liste
  //employees = computed(() => this.store.employees());-> warten auf Service

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.employees$ = of([]);
    this.fetchData();
  }

  fetchData() {
   this.employees$ = this.http.get<Employee[]>('http://localhost:8089/employees')

  ;


    this.http
      .get<Employee[]>('http://localhost:8089/employees')
      .subscribe(list => employeesStore.next(list));



  }


*/

}
