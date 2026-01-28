import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {RouterLink} from "@angular/router";
import {QualificationsStore} from "../../service/qualifications-store.service";


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

  deleteModalOpen = signal(false);
  deleteTargetName = signal<string | null>(null);


  constructor(public store: QualificationsStore) {}



  expandedQualification = signal<string | null>(null);

  // filtered list as computed signal
  filteredQualifications = computed(() => {
    const query = this.searchValue().trim().toLowerCase();
    return this.store.qualifications().filter(q =>
      q.name.toLowerCase().includes(query)
    );
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

    this.store.qualifications.update(list => [
      ...list,
      { name, employees: [] }
    ]);

    this.newSkill.set('');
    this.showAdd.set(false);
  }



  slugify(name: string) {
    return this.store.slugify(name);
  }


  startEdit(qName: string) {
    const slug = this.slugify(qName);
    this.editingSlug.set(slug);
    this.editValue.set(qName);
  }

  cancelEdit() {
    this.editingSlug.set(null);
    this.editValue.set('');
  }

  saveEdit(oldName: string) {
    const slug = this.slugify(oldName);
    this.store.renameQualification(slug, this.editValue());
    this.cancelEdit();
  }

  deleteQualification(qName: string) {
    const slug = this.slugify(qName);

    const ok = confirm(`Delete "${qName}"?`);
    if (!ok) return;

    this.store.removeQualification(slug);

    // close dorpdown
    if (this.expandedQualification() === qName) {
      this.expandedQualification.set(null);
    }
  }




  // window
  openDeleteModal(qName: string) {
    this.deleteTargetName.set(qName);
    this.deleteModalOpen.set(true);
  }

  closeDeleteModal() {
    this.deleteModalOpen.set(false);
    this.deleteTargetName.set(null);
  }

  confirmDelete() {
    const qName = this.deleteTargetName();
    if (!qName) return;

    const slug = this.slugify(qName);
    this.store.removeQualification(slug);

    // close dropdown
    if (this.expandedQualification() === qName) {
      this.expandedQualification.set(null);
    }

    this.closeDeleteModal();
  }


}
