import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);

  await authService.ready();

  if (authService.hasValidToken()) {
    return true;
  }

  await authService.login();
  return false;
};
