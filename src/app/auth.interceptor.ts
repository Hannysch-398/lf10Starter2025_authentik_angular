import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { OAuthStorage } from 'angular-oauth2-oidc';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const storage = inject(OAuthStorage);

  const token = storage.getItem('access_token'); // <- kommt aus session_storage
console.log(token);
  if (req.url.startsWith('http://localhost:8089') && token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  return next(req);
};

