import { Injectable, signal, inject, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { Employee, Skill } from '../Employee';

export interface Qualification {
  skillId: number;
  name: string;
  employees: Employee[];
}

@Injectable({ providedIn: 'root' })
export class QualificationsStore {
  private http = inject(HttpClient);
  private qualUrl = 'http://localhost:8089/qualifications';

  private nextSkillId = 1;

  qualifications = signal<Qualification[]>([]);

  private qualificationsApi = toSignal(
    this.http.get<Skill[]>(this.qualUrl),
    { initialValue: [] as Skill[] }
  );

  constructor() {
    effect(() => {
      const list = this.qualificationsApi() ?? [];

      const maxId = list.reduce((m, s) => Math.max(m, s.id ?? 0), 0);
      this.nextSkillId = maxId + 1;

      this.qualifications.set(
        list
          .filter(s => typeof s.id === 'number')
          .map(s => ({
            skillId: s.id,
            name: s.skill,
            employees: []
          }))
      );
    });
  }

  reload(): void {
    this.http.get<Skill[]>(this.qualUrl).subscribe({
      next: (list) => {
        const maxId = list.reduce((m, s) => Math.max(m, s.id ?? 0), 0);
        this.nextSkillId = maxId + 1;

        this.qualifications.set(
          list
            .filter(s => typeof s.id === 'number')
            .map(s => ({
              skillId: s.id,
              name: s.skill,
              employees: []
            }))
        );
      },
      error: (err) => {
        console.error('Fetch error:', err);
        this.qualifications.set([]);
      }
    });
  }

  createNewQualification(skillName: string): Observable<Skill> {
    const name = skillName.trim();
    if (!name) return throwError(() => new Error('skillName is empty'));

    const req$ = this.http.post<Skill>(this.qualUrl, { skill: name });

    req$.subscribe({
      next: (created) => {
        const ensured: Skill = {
          ...created,
          skill: created?.skill ?? name,
          id: created?.id ?? this.nextSkillId++
        };

        this.qualifications.update(list => [
          ...list,
          { skillId: ensured.id, name: ensured.skill, employees: [] }
        ]);
      },
      error: (err) => console.error('Create error:', err)
    });

    return req$;
  }

  removeQualificationById(skillId: number) {
    this.http.delete(`${this.qualUrl}/${skillId}`).subscribe({
      next: () => {
        this.qualifications.update(list => list.filter(q => q.skillId !== skillId));
      },
      error: (err) => {
        console.error('Delete error:', err);
        alert('Kann nicht gelöscht werden: Qualifikation ist noch Mitarbeitenden zugewiesen.');
      }
    });
  }


  renameQualificationById(skillId: number, newName: string) {
    const name = newName.trim();
    if (!name) return;

    this.http.put<Skill>(`${this.qualUrl}/${skillId}`, { skill: name }).subscribe({
      next: (updated) => {
        const finalName = updated?.skill ?? name;
        this.qualifications.update(list =>
          list.map(q => (q.skillId !== skillId ? q : { ...q, name: finalName }))
        );
      },
      error: (err) => console.error('Update error:', err)
    });
  }

  findBySlug(slug: string): Qualification | null {
    const list = this.qualifications();
    const q = list.find(x => this.slugify(x.name) === slug);
    return q ?? null;
  }

  slugify(name: string) {
    return name.trim().toLowerCase().replace(/\s+/g, '-');
  }
}
