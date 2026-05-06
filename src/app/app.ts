import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { AuthService } from './services/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div style="padding: 20px;">
      <h1>{{ title() }}</h1>

      <div style="margin: 20px 0; padding: 15px; border: 1px solid #ccc; border-radius: 8px;">
        <h2>Estado de autenticación</h2>
        @if (currentUser(); as user) {
          <p><strong>UID:</strong> {{ user.uid }}</p>
          <p><strong>Email:</strong> {{ user.email }}</p>
          <p><strong>Nombre:</strong> {{ user.displayName }}</p>
          <button (click)="logout()" style="padding: 10px 20px; cursor: pointer;">Cerrar sesión</button>
        } @else {
          <p>No autenticado</p>
        }
      </div>

      <router-outlet />
    </div>
  `,
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('angular-firebase-surveys');
  protected readonly currentUser = signal<any>(null);

  private authService = inject(AuthService);
  private auth = inject(Auth);

  constructor() {
    onAuthStateChanged(this.auth, (user) => {
      this.currentUser.set(user);
    });
  }

  async logout() {
    try {
      await this.authService.logout();
      console.log('Logout exitoso');
    } catch (error) {
      console.error('Error en logout:', error);
    }
  }
}
