import {Component, computed, effect, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {toSignal} from '@angular/core/rxjs-interop';

import {QualificationsStore} from '../../service/qualifications-store.service';
import {EmployeeService} from '../../employee.service';
import {Employee, Skill} from '../../Employee';

@Component({
  selector: 'app-qualification-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './qualification-detail.component.html',
  styleUrl: './qualification-detail.component.css',
})
export class QualificationDetailComponent {
  private route = inject(ActivatedRoute);
  public store = inject(QualificationsStore);
  public employeeService = inject(EmployeeService);

  newEmployeeName = signal('');

  private paramMapSig = toSignal(this.route.paramMap, { initialValue: null });
  skillSlug = computed(() => this.paramMapSig()?.get('skill') ?? '');

  qualification = computed(() => this.store.findBySlug(this.skillSlug()));

  employeesForSkill = computed(() => {
    const q = this.qualification();
    if (!q) return [];

    const employees = this.employeeService.employees(); // <- Signal-Quelle
    return employees.filter(e => e.skillSet?.some(s => s.id === q.skillId));
  });

  // constructor(
  //   private route: ActivatedRoute,
  //   public store: QualificationsStore,
  //   public employeeService: EmployeeService
  // ) {
  // }

  ngOnInit() {
    // wie in Overview
    this.employeeService.fetchData();
  }

  addEmployee() {
    const q = this.qualification();
    const fullName = this.newEmployeeName().trim();
    if (!q || !fullName) return;

    const employees = this.employeeService.employees();

    // Match: "First Last" oder "Last, First"
    const x = fullName.toLowerCase();
    const target = employees.find(e => {
      const a = `${e.firstName} ${e.lastName}`.trim().toLowerCase();
      const b = `${e.lastName}, ${e.firstName}`.trim().toLowerCase();
      return x === a || x === b;
    });

    if (!target) {
      console.error('Employee not found:', fullName);
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
        {id: q.skillId, skill: q.name} as Skill,
      ],
    };

    this.employeeService.updateEmployee(target.id, updated).subscribe({
      next: () => {
        // gleicher Datenfluss wie Overview: API -> fetch -> Signal aktualisiert -> UI updated
        this.employeeService.fetchData();
        this.newEmployeeName.set('');
      },
      error: (err) => console.error('Update employee error:', err),
    });
  }

  removeEmployee(employeeId: number) {
    const q = this.qualification();
    if (!q) return;

    this.employeeService
      .removeQualificationFromEmployee(employeeId, q.skillId)
      .subscribe({
        next: () => this.employeeService.fetchData(),
        error: (err) => console.error('Remove qualification error:', err),
      });
  }


}
