import {HttpClient} from "@angular/common/http";
import {inject, Injectable, signal} from "@angular/core";
import {Employee} from "./Employee";

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8089/employees';

  employees = signal<Employee[]>([]);

  fetchData() {
    this.http.get<Employee[]>(this.baseUrl).subscribe({
      next: (data) => {
        this.employees.set(data);
      },
      error: (err) => {
        console.error('Fetch error:', err);
        this.employees.set([]);
      }
    });
  }

  deleteEmployee(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  addQualificationToEmployee(empId: number, qualId: number) {
    return this.http.post(`${this.baseUrl}/${empId}/qualifications`, {qualificationId: qualId});
  }


  addEmployee(emp: Employee) {
    console.log('Service addEmployee called:', emp);
    this.http.post<Employee>(this.baseUrl, emp).subscribe({
      next: (newEmp) => {
        this.employees.update(list => [...list, newEmp]);
      },
      error: (err) => console.error('Add employee error:', err)
    });
  }
}


