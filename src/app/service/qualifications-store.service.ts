import { Injectable, signal } from '@angular/core';

export interface Employee {
  id: number;
  name: string;
  avatarUrl?: string;
}

export interface Qualification {
  name: string;
  employees: Employee[];
}

@Injectable({ providedIn: 'root' })
export class QualificationsStore {
  private nextEmployeeId = 1000;

  qualifications = signal<Qualification[]>([
    { name: 'Java', employees: [{ id: 1, name: 'Max' }] },
    { name: 'Angular', employees: [{ id: 2, name: 'Susanne' }] },
    { name: 'Docker', employees: [] },
    { name: 'SQL', employees: [] },
  ]);

  findBySlug(slug: string): Qualification | null {
    const list = this.qualifications();
    const q = list.find(x => this.slugify(x.name) === slug);
    return q ?? null;
  }

  addEmployeeToQualification(slug: string, fullName: string) {
    const name = fullName.trim();
    if (!name) return;

    this.qualifications.update(list =>
      list.map(q => {
        if (this.slugify(q.name) !== slug) return q;

        return {
          ...q,
          employees: [
            ...q.employees,
            { id: this.nextEmployeeId++, name }
          ]
        };
      })
    );
  }

  slugify(name: string) {
    return name.trim().toLowerCase().replace(/\s+/g, '-');
  }


  removeEmployeeFromQualification(slug: string, employeeId: number) {
    this.qualifications.update(list =>
      list.map(q => {
        if (this.slugify(q.name) !== slug) return q;

        return {
          ...q,
          employees: q.employees.filter(e => e.id !== employeeId),
        };
      })
    );
  }

}
