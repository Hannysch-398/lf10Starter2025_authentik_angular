import {Component, inject, signal} from '@angular/core';
import {Employee} from "../Employee";
import {Field, form, FormField, pattern, required} from "@angular/forms/signals";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {AuthService} from "../auth.service";
import {EmployeeService} from "../employee.service";
import {EmployeeCreateDto, initialData} from "../EmployeeCreateDTO";

export interface EmployeeFormModel {
  firstName: string;
  lastName: string;
  street: string;
  postcode: string;
  city: string;
  phone: string;
}

@Component({
  selector: 'app-employee-add',
  standalone: true,
  imports: [
    FormField
  ],
  templateUrl: './employee-add.component.html',
  styleUrl: './employee-add.component.css'
})
export class EmployeeAddComponent {

  empModel = signal<EmployeeCreateDto>(initialData);


  empForm = form(this.empModel, (schemaPath) => {
      required(schemaPath.firstName, {
        message: 'Vornamen eingeben'
      });
      required(schemaPath.lastName, {
        message: 'Nachname eingeben'
      });
    required(schemaPath.street, {
      message: 'Strasse eingeben'
    });
    required(schemaPath.postcode, {
      message: 'Postleitzahl eingeben'
    });
    pattern(schemaPath.postcode, /[0-9]/, {
      message: 'Nur Zahlen erlaubt'
    });
    required(schemaPath.city, {
      message: 'Stadt eingeben'
    });
    required(schemaPath.phone, {
      message: 'Telefonnummer eingeben'
    });
    pattern(schemaPath.phone, /[0-9]/, {
      message: 'Nur Zahlen erlaubt'
    });
    }

  );


  private service = inject(EmployeeService);
  private http = inject(HttpClient);
  private router = inject(Router);
  private authService = inject(AuthService);

  //constructor(private store: EmployeeStoreService) {}->auf service warten

  submitForm() {
    if (!this.empForm().valid) {
      alert('Bitte alle Pflichtfelder ausfüllen!');
      return;
    }

    const dto = this.empForm().value();
    console.log(this.empForm().value);
    console.log('POST payload:', dto);
    this.http.post('http://localhost:8089/employees', dto).subscribe({
      next: () => {

        this.router.navigate(['/employees']);
      },
      error: err => {
        console.error('Add employee error:', err);
        console.error('Status:', err.status);
        console.error('Error body:', err.error);
        alert('Speichern fehlgeschlagen');
      }
    });
  }

   // const dto: EmployeeCreateDto = this.empForm().value;

   /* this.http.post('http://localhost:8089/employees', dto).subscribe({
      next: () => this.router.navigate(['/employees']),
      error: err => console.error('Add employee error:', err),
    });

    */
    //const v = this.empForm().value;
    /*
    const emp: Employee = new Employee(
      3,
      this.empForm.lastName,
      this.empForm.firstName,
      this.empForm.street,
      this.empForm.postcode,
      this.empForm.city,
      this.empForm.phone
    );


    //this.service.addEmployee(emp);
    console.log('Adding employee:', emp);
    //this.router.navigate(['/employees']);



    this.http.post('http://localhost:8089/employees', emp)
      .subscribe({
        next: () => this.router.navigate(['/employees']),
        error: err => console.error('Add employee error:', err)
      });
    console.log('Adding employee:', emp);
    console.log('POST payload:', emp);

     */
    /*const v = this.empForm(); // ⚡ gibt FieldNodes zurück

    const emp: Employee = new Employee (

      firstName: value.firstName,
      this.empForm.lastName().value,
      this.empForm.street().value,
      this.empForm.postcode().value,
      this.empForm.city().value,
      this.empForm.phone().value,
  );

     */







  resetForm() {
    // alle Felder auf den ursprünglichen empModel-Wert zurücksetzen
    this.empModel.set({
      firstName: '',
      lastName: '',
      street: '',
      postcode: '',
      city: '',
      phone: ''
    });

    // zusätzlich die Form-Fehler zurücksetzen
    this.empForm().reset();
  }

  ariaInvalidState(field: any) {
    return field.invalid() && field.touched();
  }


}

