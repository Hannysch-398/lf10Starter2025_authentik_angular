import {Component, inject, signal, computed, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EmployeeService} from '../employee.service';
import {Employee, Skill} from '../Employee';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDialogModule, MatDialog} from '@angular/material/dialog';
import {MatChip, MatChipSet, MatChipRemove} from "@angular/material/chips";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatOption, MatSelectModule} from "@angular/material/select";


@Component({
  selector: 'delete-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <div style="padding: 10px;">
      <h2 mat-dialog-title style="color: #d93025;">Löschen bestätigen</h2>
      <mat-dialog-content>
        Soll der Mitarbeiter <b>wirklich</b> gelöscht werden?
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button mat-dialog-close="cancel">Abbrechen</button>
        <button mat-raised-button color="warn" mat-dialog-close="confirm">Bestätigen</button>
      </mat-dialog-actions>
    </div>
  `
})
export class DeleteConfirmDialog {
}


@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatChipSet,
    MatChip,
    MatChipRemove,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOption
  ],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css'
})
export class EmployeeListComponent implements OnInit {
  private employeeService = inject(EmployeeService);
  private dialog = inject(MatDialog);

  searchTerm = signal('');
  selectedEmployee = signal<Employee | null>(null);
  isEditMode = signal<boolean>(false);
  allAvailableSkills = signal<Skill[]>([]);

  filteredEmployees = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.employeeService.employees().filter(e =>
      e.firstName?.toLowerCase().includes(term) ||
      e.lastName?.toLowerCase().includes(term)
    );
  });

  ngOnInit() {
    this.employeeService.fetchData();
    this.loadAllSkills();
  }

  loadAllSkills() {
    this.employeeService.getQualifications().subscribe({
      next: (skills) => this.allAvailableSkills.set(skills),
      error: (err) => console.error('Fehler beim Laden der Skills', err)
    });
  }

  selectEmployee(emp: Employee) {

    this.selectedEmployee.set(JSON.parse(JSON.stringify(emp)));
    this.isEditMode.set(false);
  }

  protected deleteEmployee() {
    const empToDelete = this.selectedEmployee();
    if (!empToDelete) return;

    const dialogRef = this.dialog.open(DeleteConfirmDialog);
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirm') {
        this.employeeService.deleteEmployee(empToDelete.id!).subscribe({
          next: () => {
            this.employeeService.fetchData();
            this.selectedEmployee.set(null);
          },
          error: (err) => console.error('Fehler beim Löschen', err)
        });
      }
    });
  }

  protected addEmployee() {
    const newEmp: Employee = {
      id: undefined,
      firstName: '',
      lastName: '',
      street: '',
      postcode: '',
      city: '',
      phone: '',
      skillSet: []
    };
    this.selectedEmployee.set(newEmp);
    this.isEditMode.set(true);
  }

  protected editEmployee() {
    if (this.selectedEmployee()) {
      this.isEditMode.set(true);
    }
  }

  closeEdit() {
    this.isEditMode.set(false);
  }

  addSkillFromDropdown(skill: Skill) {
    const emp = this.selectedEmployee();
    if (emp && !emp.skillSet.some(s => s.id === skill.id)) {
      emp.skillSet = [...emp.skillSet, skill];
    }
  }

  addSkillManually(skillName: string) {
    if (!skillName.trim()) return;
    this.employeeService.createNewQualification(skillName).subscribe({
      next: (newSkill) => {
        const emp = this.selectedEmployee();
        if (emp) emp.skillSet = [...emp.skillSet, newSkill];
        this.allAvailableSkills.set([...this.allAvailableSkills(), newSkill]);
      },
      error: (err) => alert('Fehler beim Erstellen der Qualifikation')
    });
  }

  removeSkill(skill: Skill) {
    const emp = this.selectedEmployee();
    if (emp) {

      emp.skillSet = emp.skillSet.filter(s => s.id !== skill.id);
    }
  }

  saveChanges() {
    const emp = this.selectedEmployee();
    if (!emp) return;
    const isFirstNameInvalid = !emp.firstName || emp.firstName.trim() === '';
    const isLastNameInvalid = !emp.lastName || emp.lastName.trim() === '';
    const isStreetInvalid = !emp.street || emp.street.toString().trim() === '';
    const isPostcodeInvalid = !emp.postcode || emp.postcode.toString().trim() === '';
    const isCity = !emp.city || emp.city.toString().trim() === '';
    const isSkillsInvalid = !emp.skillSet || emp.skillSet.length === 0;

    if (isFirstNameInvalid || isLastNameInvalid || isStreetInvalid || isPostcodeInvalid || isCity ||isSkillsInvalid) {

      alert('Bitte füllen Sie alle Pflichtfelder aus (Vorname, Nachname, Straße, PLZ, Stadt und mindestens ).');
      return;
    }

    const payload = {
      ...emp,
      skillSet: emp.skillSet.map((s: any) => s.id)
    };

    if (emp.id) {
      this.employeeService.updateEmployee(emp.id, payload as any).subscribe({
        next: (response) => {
          console.log('Update success:', response);
          this.isEditMode.set(false);
          this.employeeService.fetchData();
          this.selectedEmployee.set(null);
        },
        error: (err) => {
          console.error('Update error:', err);
          alert('Ein Fehler ist beim Speichern aufgetreten.');

        }
      });
    }
  }
}
