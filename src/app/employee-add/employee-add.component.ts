import {Component, inject, signal} from '@angular/core';
import {Employee} from "../Employee";
import {Field, form, FormField, pattern, required} from "@angular/forms/signals";
import {Form, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {AuthService} from "../auth.service";
import {EmployeeListComponent} from "../employee-list/employee-list.component";



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

  empModel = signal({
    lastName: '',
    firstName:'',
    street: '',
    postcode: '',
    city:'',
    phone:'',

  })
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

  //employeeList = inject(EmployeeListComponent);

  private http = inject(HttpClient);
  private router = inject(Router);
  private authService = inject(AuthService);

  submitForm() {
    const emp: Employee = new Employee(
      undefined, // id wird vom Backend gesetzt
      this.empForm.lastName(),
      this.empForm.firstName(),
      this.empForm.street(),
      this.empForm.postcode(),
      this.empForm.city(),
      this.empForm.phone()
    );

   //this.employeeList.addEmployee(emp);

  }

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

