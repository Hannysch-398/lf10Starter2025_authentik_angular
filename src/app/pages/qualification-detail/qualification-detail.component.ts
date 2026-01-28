import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { QualificationsStore } from "../../service/qualifications-store.service";
import { EmployeeService } from "../../employee.service";
import { Employee, Skill } from "../../Employee";

@Component({
  selector: 'app-qualification-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './qualification-detail.component.html',
  styleUrl: './qualification-detail.component.css',
})
export class QualificationDetailComponent {
  skillSlug = signal<string>('');
  newEmployeeName = signal('');

  qualification = computed(() => this.store.findBySlug(this.skillSlug()));

  employeesForSkill = computed(() => {
    const q = this.qualification();
    if (!q) return [];

    const employees = this.employeeService.employees();
    return employees.filter(e => e.skillSet?.some(s => s.id === q.skillId));
  });

  constructor(
    private route: ActivatedRoute,
    private store: QualificationsStore,
    private employeeService: EmployeeService
  ) {
    this.route.paramMap.subscribe(params => {
      this.skillSlug.set(params.get('skill') ?? '');
    });
    this.employeeService.fetchData();
  }

  addEmployee() {
    const q = this.qualification();
    const fullName = this.newEmployeeName().trim();
    if (!q || !fullName) return;

    const employees = this.employeeService.employees();

    // Match über "First Last" oder "Last, First"
    const target = employees.find(e => {
      const a = `${e.firstName} ${e.lastName}`.trim().toLowerCase();
      const b = `${e.lastName}, ${e.firstName}`.trim().toLowerCase();
      const x = fullName.toLowerCase();
      return x === a || x === b;
    });

    if (!target) {
      console.error('Employee not found (kein Create Employee Endpoint vorhanden):', fullName);
      return;
    }

    const hasSkill = target.skillSet?.some(s => s.id === q.skillId) ?? false;
    if (hasSkill) {
      this.newEmployeeName.set('');
      return;
    }

    const updated: Employee = {
      ...target,
      skillSet: [
        ...(target.skillSet ?? []),
        { id: q.skillId, skill: q.name } as Skill
      ]
    };

    this.employeeService.updateEmployee(target.id, updated).subscribe({
      next: () => {
        this.employeeService.fetchData();
        this.newEmployeeName.set('');
      },
      error: (err) => console.error('Update employee error:', err)
    });
  }

  removeEmployee(employeeId: number) {
    const q = this.qualification();
    if (!q) return;

    const employees = this.employeeService.employees();
    const target = employees.find(e => e.id === employeeId);
    if (!target) return;

    const updated: Employee = {
      ...target,
      skillSet: (target.skillSet ?? []).filter(s => s.id !== q.skillId)
    };

    this.employeeService.updateEmployee(target.id, updated).subscribe({
      next: () => this.employeeService.fetchData(),
      error: (err) => console.error('Update employee error:', err)
    });
  }
}
