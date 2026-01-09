import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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
  imports: [CommonModule, FormsModule],
  templateUrl: './qualifications-overview.component.html',
  styleUrl: './qualifications-overview.component.css'
})
export class QualificationsOverviewComponent {
  filterValue = 'all';
  searchValue = '';

  qualifications: Qualification[] = [
    {
      name: 'Java',
      employees: [
        { id: 1, name: 'Max Mustermann' },
        { id: 2, name: 'Max Mustermann' },
        { id: 3, name: 'Max Mustermann' }
      ]
    },
    {
      name: 'Angular',
      employees: [{ id: 4, name: 'Max Mustermann' }]
    },
    {
      name: 'Docker',
      employees: [
        { id: 5, name: 'Max Mustermann' },
        { id: 6, name: 'Max Mustermann' }
      ]
    },
    {
      name: 'SQL',
      employees: []
    }
  ];

  expandedQualification: string | null = null;

  get filteredQualifications() {
    const q = this.searchValue.trim().toLowerCase();
    return this.qualifications.filter(x =>
      x.name.toLowerCase().includes(q)
    );
  }

  toggle(name: string) {
    this.expandedQualification =
      this.expandedQualification === name ? null : name;
  }
}
