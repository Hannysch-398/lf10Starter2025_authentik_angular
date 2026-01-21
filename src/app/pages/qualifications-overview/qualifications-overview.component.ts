import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {RouterLink} from "@angular/router";

interface Employee {
  id: number;
  name: string;
  avatarUrl?: string;
}

interface Qualification {
  name: string;
  employees: Employee[];
}

@Component({
  selector: 'app-qualifications-overview',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './qualifications-overview.component.html',
  styleUrl: './qualifications-overview.component.css'
})
export class QualificationsOverviewComponent {
  // UI state as signals
  searchValue = signal('');

  // data as signal
  qualifications = signal<Qualification[]>([
    {
      name: 'Java',
      employees: [
        { id: 1, name: 'Max Mustermann' },
        { id: 2, name: 'Max Mustermann' },
        { id: 3, name: 'Max Mustermann' }
      ]
    },
    { name: 'Angular', employees: [{ id: 4, name: 'Max Mustermann' }] },
    {
      name: 'Docker',
      employees: [
        { id: 5, name: 'Max Mustermann' },
        { id: 6, name: 'Max Mustermann' }
      ]
    },
    { name: 'SQL', employees: [] }
  ]);

  expandedQualification = signal<string | null>(null);

  // filtered list as computed signal
  filteredQualifications = computed(() => {
    const query = this.searchValue().trim().toLowerCase();
    return this.qualifications().filter(q =>
      q.name.toLowerCase().includes(query)
    );
  });


  toggle(name: string) {
    this.expandedQualification.update(current => (current === name ? null : name));
  }
}
