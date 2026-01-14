import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-callback',
  standalone: true,
  template: `<p>Logging in...</p>`,
})
export class CallbackComponent implements OnInit {
  constructor(private auth: AuthService, private router: Router) {}

  async ngOnInit() {
    const ok = await this.auth.handleCallback();

    await this.auth.tryRestoreLogin();

    if (ok) {
      const returnUrl = sessionStorage.getItem('returnUrl') ?? '/employees';
      sessionStorage.removeItem('returnUrl');
      await this.router.navigateByUrl(returnUrl);
    } else {
      await this.router.navigateByUrl('/');
    }
  }
}
