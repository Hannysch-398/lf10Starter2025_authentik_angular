import {Component, signal} from '@angular/core';
import {Employee} from "../Employee";
import { FormField, FieldState, FieldTree, form, maxLength, min, minLength, required, schema, submit } from '@angular/forms/signals';

@Component({
  selector: 'app-employee-add',
  standalone: true,
  imports: [],
  templateUrl: './employee-add.component.html',
  styleUrl: './employee-add.component.css'
})
export class EmployeeAddComponent {

  addModel = signal({
    firstName: '',
    lastName: '',

  });

  addForm = form(this.addModel);

}
