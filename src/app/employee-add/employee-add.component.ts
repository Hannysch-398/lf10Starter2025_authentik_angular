import {Component, inject, signal} from '@angular/core';
import {Skill, initialData, EmployeeFormModel} from "../Employee";
import { form, FormField, pattern, required} from "@angular/forms/signals";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {AuthService} from "../auth.service";
import {EmployeeService} from "../employee.service";
import {MatDialog} from "@angular/material/dialog";
import {MatFormField, MatLabel} from "@angular/material/input";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatIcon} from "@angular/material/icon";
import {MatChip, MatChipSet} from "@angular/material/chips";
import { Location } from '@angular/common';



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
    MatChipSet,
    MatChip,

  ],
  templateUrl: './employee-add.component.html',
  styleUrl: './employee-add.component.css'
})
class EmployeeAddComponent {

  //empMode= signal<Skill>({ ...initialData });
  empModel = signal<EmployeeFormModel>({ ...initialData });
  private employeeService = inject(EmployeeService);
  private dialog = inject(MatDialog);
  availableSkills = signal<Skill[]>([]);

  constructor(private location: Location) {}


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
      console.log('Form invalid:', this.empForm().value());
      return;
    }

    const dto = {
      ...this.empForm().value(),
      // map Skill[] to string[] for backend
      //skillSet: this.empModel().skillSet.map(s => s.skill)
      skillSet: this.empModel().skillSet.map(s => s.id)
    };

    console.log('Submitting employee:', dto);

    this.http.post('http://localhost:8089/employees', dto).subscribe({
      next: () => this.router.navigate(['/employees']),
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
      skillSet: [],
    });

    // zusätzlich die Form-Fehler zurücksetzen
    this.empForm().reset();
  }

  ariaInvalidState(field: any) {
    return field.invalid() && field.touched();
  }

  addSkill() {
    const skills = this.empModel().skillSet;
    this.empModel.update(emp => ({ ...emp, skills: [...skills, ''] }));
  }



  onSkillsChange(event: any) {
    const selectedSkills: Skill[] = event.value; // Angular Material returns objects
    this.empModel.update(emp => ({
      ...emp,
      skillSet: selectedSkills
    }));
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



  addSkillManually(skillName: string) {
    if (!skillName.trim()) return;

    this.employeeService.createNewQualification(skillName).subscribe({
      next: (newSkill: Skill) => {
        this.availableSkills.update(list => [...list, newSkill]);
        this.empModel.update(model => ({
          ...model,
          skillSet: [...model.skillSet, newSkill]
        }));
      },
      error: (err) => console.error('Fehler beim Hinzufügen der Qualifikation', err)
    });
  }

  removeSkill(skill: Skill) {
    this.empModel.update(emp => ({
      ...emp,
      skillSet: emp.skillSet.filter(s => s.id !== skill.id)
    }));
  }
  goBack() {
    this.location.back();
  }

}

export default EmployeeAddComponent

