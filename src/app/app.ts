import { Component, inject } from '@angular/core';
import { RouterOutlet, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from './services/auth';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgIf],
  template: `
    <!-- The Navbar is only visible if a user is logged in -->
    <nav class="modern-navbar" *ngIf="authService.currentUser() as user">
      <div class="navbar-container">
        <!-- Left side: Brand -->
        <div class="nav-brand">
          <span class="logo-icon">📊</span>
          <span class="brand-text">SurVot</span>
        </div>

        <!-- Center: Navigation Links -->
        <div class="nav-links">
          <a routerLink="/surveys/new" routerLinkActive="active-link" class="nav-link"
            >New Survey</a
          >
          <a routerLink="/surveys/wip" routerLinkActive="active-link" class="nav-link">Explore</a>
        </div>

        <!-- Right side: User Options -->
        <div class="nav-user">
          <!-- Show name or email using the logged in user Signal -->
          <span class="user-greeting"
            >Hello, <strong>{{ user.displayName || user.email }}</strong></span
          >

          <button (click)="logoutUser()" class="logout-btn">
            Log Out
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              stroke="currentColor"
              stroke-width="2"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        </div>
      </div>
    </nav>

    <!-- Aquí debajo de la navbar se dibujarán las demás pantallas de la app -->
    <main class="app-content">
      <router-outlet />
    </main>
  `,
  styleUrl: './app.scss',
})
export class App {
  public authService = inject(AuthService);
  private router = inject(Router);

  async logoutUser() {
    try {
      await this.authService.logout();
      this.router.navigate(['/auth/login']);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }
}
