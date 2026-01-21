import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {HeaderComponent} from './header/header.component';
import {EmployeeListComponent} from "./employee-list/employee-list.component";
import {QualificationsOverviewComponent} from "./pages/qualifications-overview/qualifications-overview.component";


@Component({
  selector: 'app-root',
  standalone: true,

  imports: [CommonModule, EmployeeListComponent, RouterOutlet, HeaderComponent,QualificationsOverviewComponent],

  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'lf10StarterNew';
}


