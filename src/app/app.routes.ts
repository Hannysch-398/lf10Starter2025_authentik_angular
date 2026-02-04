import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { CallbackComponent } from './callback/callback.component';
import { authGuard } from './auth.guard';

import EmployeeAddComponent from './employee-add/employee-add.component';
import { QualificationsOverviewComponent } from './pages/qualifications-overview/qualifications-overview.component';
import { QualificationDetailComponent } from './pages/qualification-detail/qualification-detail.component';
import { AccountComponent } from './account/account.component';

export const routes: Routes = [
  { path: 'callback', component: CallbackComponent },

  {
    path: '',
    canActivateChild: [authGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent, title: 'Home' },

      { path: 'employees', component: EmployeeListComponent, title: 'Mitarbeiter' },
      { path: 'employees/add', component: EmployeeAddComponent, title: 'Mitarbeiter hinzufuegen' },

      { path: 'qualifications', component: QualificationsOverviewComponent, title: 'Qualifikationen' },
      { path: 'qualifications/:skill', component: QualificationDetailComponent, title: 'Qualifikation' },

      { path: 'account', component: AccountComponent, title: 'Account' },
    ],
  },

  { path: '**', redirectTo: '' },
];
