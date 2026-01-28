import {HttpClient} from "@angular/common/http";
import {inject, Injectable, signal} from "@angular/core";
import {Employee, Skill} from "./Employee";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8089/employees';
  private qualUrl = 'http://localhost:8089/qualifications';

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

  getQualifications(): Observable<Skill[]> {
    return this.http.get<Skill[]>(this.qualUrl);
  }
  createNewQualification(skillName: string): Observable<Skill> {
    return this.http.post<Skill>(this.qualUrl, { skill: skillName });
  }
}


