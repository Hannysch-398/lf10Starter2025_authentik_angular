import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";
import { QualificationsStore } from "../../service/qualifications-store.service";
import { EmployeeService } from "../../employee.service";

@Component({
  selector: 'app-qualifications-overview',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './qualifications-overview.component.html',
  styleUrl: './qualifications-overview.component.css'
})
export class QualificationsOverviewComponent {

  showAdd = signal(false);
  newSkill = signal('');

  // UI state as signals
  searchValue = signal('');

  editingSlug = signal<string | null>(null);
  editValue = signal('');

  editingSkillId = signal<number | null>(null);

  deleteModalOpen = signal(false);
  deleteTargetName = signal<string | null>(null);
  deleteTargetId = signal<number | null>(null);

  expandedQualification = signal<string | null>(null);

  constructor(
    public store: QualificationsStore,
    public employeeService: EmployeeService
  ) {}

  ngOnInit() {
    this.employeeService.fetchData();
  }

// ...deine imports bleiben, nur Skill/Employee nicht nötig extra

  filteredQualifications = computed(() => {
    const query = this.searchValue().trim().toLowerCase();
    const employees = this.employeeService.employees();

    return this.store.qualifications()
      .filter(q => q.name.toLowerCase().includes(query))
      .map(q => ({
        ...q,
        employees: employees.filter(e =>
          e.skillSet?.some(s => s.id === q.skillId)
        )
      }));
  });


  toggle(name: string) {
    this.expandedQualification.update(current => (current === name ? null : name));
  }

  toggleAdd() {
    this.showAdd.update(v => !v);
  }

  addSkill() {
    const name = this.newSkill().trim();
    if (!name) return;

    this.store.createNewQualification(name);

    this.newSkill.set('');
    this.showAdd.set(false);
  }

  slugify(name: string) {
    return this.store.slugify(name);
  }

  startEdit(qName: string) {
    const q = this.store.qualifications().find(x => x.name === qName);
    if (!q) return;

    const slug = this.slugify(q.name);
    this.editingSlug.set(slug);
    this.editValue.set(q.name);
    this.editingSkillId.set(q.skillId);
  }

  cancelEdit() {
    this.editingSlug.set(null);
    this.editValue.set('');
    this.editingSkillId.set(null);
  }

  saveEdit(oldName: string) {
    const id = this.editingSkillId();
    if (id == null) return;

    this.store.renameQualificationById(id, this.editValue());
    this.cancelEdit();
  }

  deleteQualification(qName: string) {
    const q = this.store.qualifications().find(x => x.name === qName);
    if (!q) return;

    const ok = confirm(`Delete "${qName}"?`);
    if (!ok) return;

    this.store.removeQualificationById(q.skillId);

    if (this.expandedQualification() === qName) {
      this.expandedQualification.set(null);
    }
  }

  openDeleteModal(qName: string) {
    const q = this.store.qualifications().find(x => x.name === qName);
    if (!q) return;

    this.deleteTargetName.set(qName);
    this.deleteTargetId.set(q.skillId);
    this.deleteModalOpen.set(true);
  }

  closeDeleteModal() {
    this.deleteModalOpen.set(false);
    this.deleteTargetName.set(null);
    this.deleteTargetId.set(null);
  }

  confirmDelete() {
    const id = this.deleteTargetId();
    const qName = this.deleteTargetName();
    if (id == null || !qName) return;

    this.store.removeQualificationById(id);

    if (this.expandedQualification() === qName) {
      this.expandedQualification.set(null);
    }

    this.closeDeleteModal();
  }
}
