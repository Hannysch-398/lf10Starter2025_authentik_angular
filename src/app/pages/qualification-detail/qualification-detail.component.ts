import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {QualificationsStore} from "../../service/qualifications-store.service";

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

  constructor(private route: ActivatedRoute, private store: QualificationsStore) {
    this.route.paramMap.subscribe(params => {
      this.skillSlug.set(params.get('skill') ?? '');
    });
  }

  addEmployee() {
    this.store.addEmployeeToQualification(this.skillSlug(), this.newEmployeeName());
    this.newEmployeeName.set('');
  }

  removeEmployee(employeeId: number) {
    this.store.removeEmployeeFromQualification(this.skillSlug(), employeeId);
  }

}
