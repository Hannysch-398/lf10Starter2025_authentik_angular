import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { CallbackComponent } from './callback/callback.component';
import { authGuard } from './auth.guard';
import EmployeeAddComponent from "./employee-add/employee-add.component";
import {AccountComponent} from "./account/account.component";

export const routes: Routes = [
  { path: 'callback', component: CallbackComponent }, // public

  {
    path: '',
    canActivateChild: [authGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'employees', component: EmployeeListComponent,title: 'Mitarbeiter' },
      { path: 'employees/add', component: EmployeeAddComponent, title:'Mitarbeiter hinzufuegen'},
      { path: 'home', component: HomeComponent, title: 'Home' },
     // {path: "qualifications", component:QualificationComponent, title: "Qualifikationen"},
     {path:"account", component: AccountComponent , title: "Account"}
    ],
  },

  { path: '**', redirectTo: '' }
];
