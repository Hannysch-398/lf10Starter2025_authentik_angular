import { Injectable, signal } from '@angular/core';


// Employee model
export interface Employee {
  id: number;
  name: string;
  avatarUrl?: string;
}

// Qualification model
//  skill name  example java
// employees =>>> list of employees who have this skill

export interface Qualification {
  name: string;
  employees: Employee[];
}


/*
QualificationsStore = "Single Source of Truth" for qualifications data.

Why we created it?
1- So multiple pages can share the same data (overview + detail page)
2- So UI components stay clean (no data logic duplicated everywhere)
3- Later we can replace in-memory data with API calls, without changing UI logic much
*/

@Injectable({ providedIn: 'root' })
export class QualificationsStore {


  // Wird verwendet, um neue IDs für Mitarbeiter zu generieren, die über die Benutzeroberfläche hinzugefügt werden (temporary for in memory)
  private nextEmployeeId = 1000;


  /*
   * Main shared data (Signal):
   * - Holds the entire list of qualifications
   * - Any update here automatically updates all UI components using it (Reactive UI)
   */

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


  // * ConvertsExample: "My Skill" -> "my-skill"
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


  removeQualification(slug: string) {
    this.qualifications.update(list =>
      list.filter(q => this.slugify(q.name) !== slug)
    );
  }

  renameQualification(slug: string, newName: string) {
    const name = newName.trim();
    if (!name) return;

    this.qualifications.update(list =>
      list.map(q => {
        if (this.slugify(q.name) !== slug) return q;
        return { ...q, name };
      })
    );
  }


}
