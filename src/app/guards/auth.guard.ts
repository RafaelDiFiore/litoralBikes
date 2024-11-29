import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class authGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(): boolean {
    if (this.authService.getUser()) {
      return true; // Permitir la navegación si el usuario está autenticado
    } else {
      this.router.navigate(['/login']); // Redirigir al login si no está autenticado
      return false;
    }
  }
}
