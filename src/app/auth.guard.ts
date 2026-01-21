import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  await auth.ready();

  await auth.tryRestoreLogin();

  if (auth.hasValidToken()) return true;

  auth.login(state.url); // startet Redirect
  return router.createUrlTree(['/callback'], {
    queryParams: { returnUrl: state.url },
  });
};
