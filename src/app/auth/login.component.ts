import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgIf, FormsModule],
  template: `
    <div class="page-wrapper">
      <div class="form-container slide-in">
        <div class="header-titles">
          <span class="eyebrow">Authentication</span>
          <h1>{{ activeTab === 'login' ? 'Welcome back' : 'Create your account' }}</h1>
          <p>
            {{
              activeTab === 'login'
                ? 'Log in to continue with your surveys'
                : 'Sign up and start creating surveys instantly'
            }}
          </p>
        </div>

        <div class="card">
          <div class="tabs-container">
            <button
              class="tab-btn"
              [class.active]="activeTab === 'login'"
              [class.inactive]="activeTab !== 'login'"
              (click)="switchTab('login')"
            >
              Log in
            </button>
            <button
              class="tab-btn"
              [class.active]="activeTab === 'register'"
              [class.inactive]="activeTab !== 'register'"
              (click)="switchTab('register')"
            >
              Sign up
            </button>
          </div>

          <div class="error-message" *ngIf="errorMessage">
            <span>{{ errorMessage }}</span>
          </div>
          <div class="success-message" *ngIf="successMessage">
            <span>{{ successMessage }}</span>
          </div>

          <button (click)="loginWithGoogle()" [disabled]="isLoading" class="google-btn">
            <div class="btn-content" [class.hidden]="isLoadingGoogle">
              <svg viewBox="0 0 48 48" width="20px" height="20px">
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                />
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                />
              </svg>
              <span>Continue with Google</span>
            </div>
            <div class="loader" *ngIf="isLoadingGoogle"></div>
          </button>

          <div class="divider"><span>Or log in with your email</span></div>

          <form (ngSubmit)="processForm()" class="form-wrapper">
            <div class="input-group slide-down" *ngIf="activeTab === 'register'">
              <svg
                class="input-icon"
                viewBox="0 0 24 24"
                width="18"
                height="18"
                stroke="currentColor"
                fill="none"
                stroke-width="2"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <input type="text" [(ngModel)]="name" name="name" placeholder="Full name" required />
            </div>

            <div class="input-group">
              <svg
                class="input-icon"
                viewBox="0 0 24 24"
                width="18"
                height="18"
                stroke="currentColor"
                fill="none"
                stroke-width="2"
              >
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <polyline points="3 7 12 13 21 7" />
              </svg>
              <input
                type="email"
                [(ngModel)]="email"
                name="email"
                placeholder="email@example.com"
                required
              />
            </div>

            <div class="input-group">
              <svg
                class="input-icon"
                viewBox="0 0 24 24"
                width="18"
                height="18"
                stroke="currentColor"
                fill="none"
                stroke-width="2"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                type="password"
                [(ngModel)]="password"
                name="password"
                placeholder="Password"
                required
              />
            </div>

            <div class="forgot-password" *ngIf="activeTab === 'login'">
              <a href="javascript:void(0)" (click)="recoverPassword()">Forgot your password?</a>
            </div>

            <button type="submit" [disabled]="isLoadingEmail" class="primary-btn">
              <span *ngIf="!isLoadingEmail">{{
                activeTab === 'login' ? 'Log in' : 'Create Account'
              }}</span>
              <span *ngIf="isLoadingEmail">Processing...</span>
              <svg
                *ngIf="activeTab === 'login' && !isLoadingEmail"
                viewBox="0 0 24 24"
                width="18"
                height="18"
                stroke="currentColor"
                fill="none"
                stroke-width="2"
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>

            <p class="switch-mode-text">
              <span *ngIf="activeTab === 'login'"
                >Don't have an account?
                <a href="javascript:void(0)" (click)="switchTab('register')">Sign up</a></span
              >
              <span *ngIf="activeTab === 'register'"
                >Already have an account?
                <a href="javascript:void(0)" (click)="switchTab('login')">Log in</a></span
              >
            </p>
          </form>
        </div>

        <p class="secure-footer">🔒 Secure Firebase Authentication</p>
      </div>
    </div>
  `,
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  activeTab: 'login' | 'register' = 'login';
  name = '';
  email = '';
  password = '';

  isLoading = false;
  isLoadingGoogle = false;
  isLoadingEmail = false;
  errorMessage = '';
  successMessage = '';

  switchTab(tab: 'login' | 'register') {
    this.activeTab = tab;
    this.clearMessages();
  }

  clearMessages() {
    this.errorMessage = '';
    this.successMessage = '';
  }

  async loginWithGoogle() {
    if (this.isLoading) return;
    this.isLoading = this.isLoadingGoogle = true;
    this.clearMessages();

    try {
      await this.authService.loginWithGoogle();
      this.router.navigate(['/surveys/new']);
    } catch (error) {
      this.errorMessage = 'Could not authenticate with Google.';
    } finally {
      this.isLoading = this.isLoadingGoogle = false;
    }
  }

  async processForm() {
    if (this.isLoading) return;

    if (!this.email || !this.password) {
      this.errorMessage = 'Please fill out all required fields.';
      return;
    }
    if (this.activeTab === 'register' && !this.name) {
      this.errorMessage = 'Please enter your name.';
      return;
    }

    this.isLoading = this.isLoadingEmail = true;
    this.clearMessages();

    try {
      if (this.activeTab === 'login') {
        await this.authService.loginWithEmail(this.email, this.password);
      } else {
        await this.authService.registerWithEmail(this.name, this.email, this.password);
      }
      this.router.navigate(['/surveys/new']);
    } catch (error: any) {
      console.error('Full Firebase error:', error);
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
        this.errorMessage = 'Incorrect email or password.';
      } else if (error.code === 'auth/email-already-in-use') {
        this.errorMessage = 'That email is already registered.';
      } else if (error.code === 'auth/weak-password') {
        this.errorMessage = 'Password must be at least 6 characters.';
      } else if (error.code === 'auth/operation-not-allowed') {
        this.errorMessage =
          'Email login is not enabled in Firebase. Ask an administrator to enable it.';
      } else {
        this.errorMessage = 'An unexpected error occurred processing your request.';
      }
    } finally {
      this.isLoading = this.isLoadingEmail = false;
    }
  }

  async recoverPassword() {
    if (!this.email) {
      this.errorMessage = 'Enter your email above and click "Forgot your password?" again.';
      return;
    }

    this.isLoading = true;
    this.clearMessages();

    try {
      await this.authService.recoverPassword(this.email);
      this.successMessage = 'Recovery email sent! Please check your inbox.';
      this.password = '';
    } catch (error: any) {
      this.errorMessage = 'No account found with that email address.';
    } finally {
      this.isLoading = false;
    }
  }
}
