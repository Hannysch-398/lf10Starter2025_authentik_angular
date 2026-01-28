import {Component, inject, signal} from '@angular/core';
import {Employee, Skill, initialData} from "../Employee";
import {Field, form, FormField, pattern, required} from "@angular/forms/signals";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {AuthService} from "../auth.service";
import {EmployeeService} from "../employee.service";
//import {EmployeeSkill, initialData, Skills} from "../EmployeeSkill";
import {MatDialog} from "@angular/material/dialog";
import {MatFormField, MatLabel} from "@angular/material/input";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatIcon} from "@angular/material/icon";
import {MatChip, MatChipSet} from "@angular/material/chips";

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
    FormField,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatIcon,

  ],
  templateUrl: './employee-add.component.html',
  styleUrl: './employee-add.component.css'
})
class EmployeeAddComponent {

  empModel= signal<Skill>({ ...initialData });
  private employeeService = inject(EmployeeService);
  private dialog = inject(MatDialog);
  availableSkills = signal<Skill[]>([]);

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

    required(schemaPath.city, {
      message: 'Stadt eingeben'
    });
    required(schemaPath.phone, {
      message: 'Telefonnummer eingeben'
    });
    pattern(schemaPath.postcode, /^[0-9]{5}$/, {
      message: 'Nur Zahlen erlaubt und die Postleitzahl muss 5-stellig sein'
    });

    required(schemaPath.skill, { message: 'Bitte mindestens einen Skill auswählen' });
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
      id: null,
      firstName: '',
      lastName: '',
      street: '',
      postcode: '',
      city: '',
      phone: '',
      skill: '',
    });

    // zusätzlich die Form-Fehler zurücksetzen
    this.empForm().reset();
  }

  ariaInvalidState(field: any) {
    return field.invalid() && field.touched();
  }

  addSkill() {
    const skills = this.empModel().skill;
    this.empModel.update(emp => ({ ...emp, skills: [...skills, ''] }));
  }


  updateSkill(index: number, value: string) {
    const skills = [...this.empModel().skill];
    skills[index] = value;
    this.empModel.update(emp => ({ ...emp, skills }));
  }


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






  ngOnInit() {
    this.employeeService.fetchData();
    this.loadAllSkills();
  }

  loadAllSkills() {
    this.employeeService.getQualifications().subscribe({
      next: (skills: Skill[]) => this.availableSkills.set(skills),
      error: err => console.error('Fehler beim Laden der Skills', err)
    });
  }

  addSkillFromDropdown(skill: Skill) {
    this.empModel.update(model => {
      if (model.skill.includes(skill.skill)) {
        return model;
      }

      return {
        ...model,
        skills: [...model.skill, skill.skill],
      };
    });
  }

  addSkillManually(skillName: string) {
    if (!skillName.trim()) return;

    this.employeeService.createNewQualification(skillName).subscribe({
      next: (newSkill) => {

        // 1️⃣ add to available skills
        this.availableSkills.update(skills => [...skills, newSkill]);

        // 2️⃣ add to the employee being created
        this.empModel.update(emp => ({
          ...emp,
          skills: [...emp.skill, newSkill.skill]
        }));
      },
      error: () => alert('Fehler beim Erstellen der Qualifikation')
    });
  }
}

export default EmployeeAddComponent

