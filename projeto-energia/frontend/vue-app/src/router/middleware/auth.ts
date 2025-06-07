import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { AuthService } from '../../services/AuthService';

export function authGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
): void {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isAuthenticated = AuthService.isAuthenticated();

  if (requiresAuth && !isAuthenticated) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    });
  } else if (to.path === '/login' && isAuthenticated) {
    next({ path: '/' });
  } else {
    next();
  }
}

export function roleGuard(allowedRoles: string[]) {
  return (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
  ): void => {
    const user = AuthService.getUser();
    
    if (!user) {
      next({ path: '/login' });
      return;
    }

    if (allowedRoles.includes(user.role)) {
      next();
    } else {
      next({ path: '/unauthorized' });
    }
  };
} 