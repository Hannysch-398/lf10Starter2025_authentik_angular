import {Component, inject} from '@angular/core';
import {AuthService} from "../auth.service";

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css'
})
export class OverviewComponent {

  readonly auth = inject(AuthService);

}
