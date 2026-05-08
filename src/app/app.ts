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
          <span class="brand-text">Angular-Surveys</span>
        </div>

        <!-- Center: Navigation Links -->
        <div class="nav-links">
          <a
            routerLink="/surveys/new"
            routerLinkActive="active-link"
            [routerLinkActiveOptions]="{ exact: true }"
            class="nav-link"
            >New Survey</a
          >
          <a
            routerLink="/surveys"
            routerLinkActive="active-link"
            [routerLinkActiveOptions]="{ exact: true }"
            class="nav-link"
          >
            Explore
          </a>
        </div>

        <!-- Desktop user controls -->
        <div class="nav-user nav-user-desktop">
          <!-- Show name or email using the logged in user Signal -->
          <span class="user-greeting">Hello, <strong>{{ getUserLabel(user) }}</strong></span>

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

        <!-- Mobile menu trigger -->
        <button
          class="mobile-menu-btn"
          (click)="toggleMobileMenu()"
          [attr.aria-expanded]="mobileMenuOpen"
          aria-label="Toggle navigation menu"
        >
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            stroke="currentColor"
            stroke-width="2"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
            *ngIf="!mobileMenuOpen"
          >
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            stroke="currentColor"
            stroke-width="2"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
            *ngIf="mobileMenuOpen"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div class="mobile-menu" *ngIf="mobileMenuOpen">
        <p class="mobile-user">Hello, <strong>{{ getUserLabel(user) }}</strong></p>

        <a
          routerLink="/surveys/new"
          routerLinkActive="active-link"
          [routerLinkActiveOptions]="{ exact: true }"
          class="mobile-link"
          (click)="closeMobileMenu()"
          >New Survey</a
        >
        <a
          routerLink="/surveys"
          routerLinkActive="active-link"
          [routerLinkActiveOptions]="{ exact: true }"
          class="mobile-link"
          (click)="closeMobileMenu()"
        >
          Explore
        </a>

        <button (click)="logoutUser()" class="logout-btn mobile-logout-btn">
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
  protected mobileMenuOpen = false;

  protected toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  protected closeMobileMenu() {
    this.mobileMenuOpen = false;
  }

  protected getUserLabel(user: any): string {
    return user?.displayName || user?.email || 'User';
  }

  async logoutUser() {
    try {
      await this.authService.logout();
      this.mobileMenuOpen = false;
      this.router.navigate(['/auth/login']);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }
}
