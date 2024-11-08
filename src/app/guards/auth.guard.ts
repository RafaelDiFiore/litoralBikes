import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = new AuthService(); // Crea una instancia del servicio (puedes usar inyección de dependencias si estás en un entorno adecuado)
  const isAuthenticated = !!authService.getUser(); // Verifica si hay un usuario autenticado

  if (!isAuthenticated) {
    // Si no está autenticado, redirigir a la página de login
    const router = new Router(); // Crea una instancia del router
    router.navigate(['/login']);
  }

  return isAuthenticated; // Devuelve true si está autenticado, false de lo contrario
}