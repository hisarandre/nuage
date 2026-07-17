// guest.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../features/auth/auth.service';

export const guestGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const { data, error } = await authService.getUser();

  if (!error && data.user) {
    return router.createUrlTree(['/']);
  }

  return true;
};
