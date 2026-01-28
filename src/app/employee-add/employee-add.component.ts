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
    pattern(schemaPath.phone, /^[0-9]{5}$/, {
      message: 'Nur Zahlen erlaubt und die Postleitzahl muss 5-stellig sein'
    });

    required(schemaPath.skills, { message: 'Bitte mindestens einen Skill auswählen' });
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

  resetForm() {
    // alle Felder auf den ursprünglichen empModel-Wert zurücksetzen
    this.empModel.set({
      firstName: '',
      lastName: '',
      street: '',
      postcode: '',
      city: '',
      phone: '',
      skills: [],
    });

    // zusätzlich die Form-Fehler zurücksetzen
    this.empForm().reset();
  }

  ariaInvalidState(field: any) {
    return field.invalid() && field.touched();
  }

  addSkill() {
    const skills = this.empModel().skills;
    this.empModel.update(emp => ({ ...emp, skills: [...skills, ''] }));
  }

  removeSkill(index: number) {
    const skills = this.empModel().skills.filter((_, i) => i !== index);
    this.empModel.update(emp => ({ ...emp, skills }));
  }

  updateSkill(index: number, value: string) {
    const skills = [...this.empModel().skills];
    skills[index] = value;
    this.empModel.update(emp => ({ ...emp, skills }));
  }
  availableSkills = ['Angular', 'TypeScript', 'Java', 'Spring Boot', 'HTML/CSS', 'React'];

  onSkillsChange(event: Event) {
    console.log('Available skills:', this.availableSkills);

    const select = event.target as HTMLSelectElement;
    const selected = Array.from(select.selectedOptions).map(option => option.value);
    console.log('Selected skills:', selected); // ⚡ log here
    // update signal
    this.empModel.update(emp => ({ ...emp, skills: selected }));
  }
  onSkillInput(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    this.updateSkill(index, input.value);
  }

  toggleSkill(skill: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    const skills = [...this.empModel().skills];

    if (checked) {
      // Add skill if checked
      skills.push(skill);
    } else {
      // Remove skill if unchecked
      const index = skills.indexOf(skill);
      if (index > -1) skills.splice(index, 1);
    }

    // Update the signal
    this.empModel.update(emp => ({ ...emp, skills }));
  }

  dropdownOpen = signal(false);

  toggleDropdown() {
    this.dropdownOpen.update(open => !open);
  }


  toggleSkill2(skill: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    const skills = [...this.empModel().skills];

    if (checked) {
      skills.push(skill);
    } else {
      const index = skills.indexOf(skill);
      if (index > -1) skills.splice(index, 1);
    }

    this.empModel.update(emp => ({ ...emp, skills }));
  }
}

