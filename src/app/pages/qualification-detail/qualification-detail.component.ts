import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

import { QualificationsStore } from '../../service/qualifications-store.service';
import { EmployeeService } from '../../employee.service';
import { Employee, Skill } from '../../Employee';

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

  // Input-Wert
  newEmployeeName = signal('');

  private paramMapSig = toSignal(this.route.paramMap, { initialValue: null });
  skillSlug = computed(() => this.paramMapSig()?.get('skill') ?? '');

  qualification = computed(() => this.store.findBySlug(this.skillSlug()));

  employeesForSkill = computed(() => {
    const q = this.qualification();
    if (!q) return [];
    const employees = this.employeeService.employees();
    return employees.filter(e => e.skillSet?.some(s => s.id === q.skillId));
  });

  // ---------- AUTOCOMPLETE / SUGGESTIONS ----------

  private normalize(v: string | null | undefined) {
    return (v ?? '').trim().toLowerCase();
  }

  private fullName(e: Employee) {
    return `${e.firstName ?? ''} ${e.lastName ?? ''}`.trim();
  }

  private fullNameRev(e: Employee) {
    return `${e.lastName ?? ''}, ${e.firstName ?? ''}`.trim();
  }

  // Mitarbeitende, die diese Qualifikation noch NICHT haben
  availableEmployees = computed(() => {
    const q = this.qualification();
    if (!q) return [];
    const employees = this.employeeService.employees();
    return employees.filter(e => !(e.skillSet?.some(s => s.id === q.skillId) ?? false));
  });

  // Vorschläge basierend auf Eingabe (Start-Match priorisiert)
  employeeSuggestions = computed(() => {
    const q = this.qualification();
    if (!q) return [];

    const query = this.normalize(this.newEmployeeName());
    if (!query) return [];

    const list: Employee[] = this.availableEmployees();

    const starts = list.filter((e: Employee, _i: number, _arr: Employee[]) => {
      const query = this.normalize(this.newEmployeeName());
      const fn = this.normalize(e.firstName);
      const ln = this.normalize(e.lastName);
      const a = this.normalize(this.fullName(e));
      const b = this.normalize(this.fullNameRev(e));

      return fn.startsWith(query) || ln.startsWith(query) || a.startsWith(query) || b.startsWith(query);
    });

    const contains = list.filter(e => {
      const a = this.normalize(this.fullName(e));
      const b = this.normalize(this.fullNameRev(e));
      return a.includes(query) || b.includes(query);
    });

    // Duplikate entfernen, Reihenfolge: starts dann contains
    const seen = new Set<number>();
    const merged = [...starts, ...contains].filter(e => {
      if (seen.has(e.id)) return false;
      seen.add(e.id);
      return true;
    });

    return merged.slice(0, 8);
  });

  // Klick auf Vorschlag: übernimmt den Namen (oder direkt hinzufügen)
  selectSuggestion(e: Employee) {
    // nur ins Input übernehmen:
    // this.newEmployeeName.set(this.fullName(e));

    // Wenn du lieber "direkt hinzufügen" willst, kommentiere die Zeile oben aus
    // und nutze stattdessen:
    this.addEmployeeByExactEmployee(e);
  }

  // Optional: direkt hinzufügen ohne erneute Suche (nutzt deinen bisherigen Update-Flow)
  addEmployeeByExactEmployee(target: Employee) {
    const q = this.qualification();
    if (!q) return;

    const hasSkill = target.skillSet?.some(s => s.id === q.skillId) ?? false;
    if (hasSkill) {
      this.newEmployeeName.set('');
      return;
    }

    const updated: Employee = {
      ...target,
      skillSet: [
        ...(target.skillSet ?? []),
        { id: q.skillId, skill: q.name } as Skill,
      ],
    };

    this.employeeService.updateEmployee(target.id, updated).subscribe({
      next: () => {
        this.employeeService.fetchData();
        this.newEmployeeName.set('');
      },
      error: (err) => console.error('Update employee error:', err),
    });
  }

  // ---------- LIFECYCLE ----------

  ngOnInit() {
    this.employeeService.fetchData();
  }

  // ---------- EXISTING FLOWS ----------
  addEmployee() {
    const q = this.qualification();
    const fullName = this.newEmployeeName().trim();
    if (!q || !fullName) return;

    const employees = this.employeeService.employees();

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

    this.employeeService.addQualificationToEmployee(target.id, q.name).subscribe({
      next: () => {
        this.employeeService.fetchData();
        this.newEmployeeName.set('');
      },
      error: (err) => console.error('Add qualification error:', err),
    });
  }

  addEmployeeBySuggestion(e: Employee) {
    const q = this.qualification();
    if (!q) return;

    this.employeeService.addQualificationToEmployee(e.id, q.name).subscribe({
      next: () => {
        this.employeeService.fetchData();
        this.newEmployeeName.set('');
      },
      error: (err) => console.error('Add qualification error:', err),
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
