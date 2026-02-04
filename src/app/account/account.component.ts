import {Component, inject} from '@angular/core';
import {AuthService} from "../auth.service";

@Component({
  selector: 'app-account',
  imports: [],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css',
})
export class AccountComponent {
  readonly auth = inject(AuthService);
}
