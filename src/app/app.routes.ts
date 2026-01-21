import {Routes} from '@angular/router';
// import { HomeComponent } from './home/home.component';
// import { EmployeeListComponent } from './employee-list/employee-list.component';
// import { CallbackComponent } from './callback/callback.component';
// import { authGuard } from './auth.guard';
import {AccountComponent} from "./account/account.component";
import {Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {EmployeeListComponent} from './employee-list/employee-list.component';
import {CallbackComponent} from './callback/callback.component';
import {authGuard} from './auth.guard';
import {OverviewComponent} from "./overview/overview.component";


export const routes: Routes = [

  {path: 'callback', component: CallbackComponent}, // public

  {
    path: '',
    canActivateChild: [authGuard],
    children: [
      {path: '', redirectTo: 'home', pathMatch: 'full'},
      {path: 'employees', component: EmployeeListComponent, title: 'Mitarbeiter'},
      // {path: 'home', component: HomeComponent, title: 'Home'},
      {path: "account", component: AccountComponent, title: "Account"},
      {path: 'employees', component: EmployeeListComponent, title: 'Mitarbeiter'},
      {path: 'home', component: OverviewComponent, title: 'Home'},
      // {path: "qualifications", component:QualificationComponent, title: "Qualifikationen"},
      // {path: "qualifications", component:QualificationComponent, title: "Qualifikationen"},
      // {path:"account", component: accountComponent, title: "Account"}
    ],
  }]
