import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  template: `<div style="padding: 20px; text-align: center;"><p>Signing in...</p></div>`
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    this.triggerLogin();
  }

  private async triggerLogin() {
    try {
      const user = await this.authService.loginWithGoogle();
      this.router.navigate(['/'], { queryParams: { uid: user.uid } });
    } catch (error) {
      console.error('Login failed:', error);
      this.router.navigate(['/']);
    }
  }
}
