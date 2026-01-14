import {Component, computed} from '@angular/core';
import {NgClass} from "@angular/common";
import {AuthService} from "../auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isOpen = false;

  constructor(public auth: AuthService, private router: Router) {}

  login() {
    this.auth.login(this.router.url);
  }

  logout() {
    this.auth.logout();
  }
  toggleMobileMenu(){
    this.isOpen = !this.isOpen;
  }

  closeMenu() {
    this.isOpen = false;
  }

  protected readonly Highlight = Highlight;
}
