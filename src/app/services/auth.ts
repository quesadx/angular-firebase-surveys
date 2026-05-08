import { Injectable, inject, signal } from '@angular/core';
import {
  Auth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  user,
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private firebaseAuth = inject(Auth);
  currentUser = signal<User | null>(null);

  constructor() {
    user(this.firebaseAuth).subscribe((user) => {
      this.currentUser.set(user);
    });
  }

  async loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(this.firebaseAuth, provider);
    } catch (error) {
      console.error('Error logging in with Google:', error);
      throw error;
    }
  }

  async loginWithEmail(email: string, password: string) {
    try {
      await signInWithEmailAndPassword(this.firebaseAuth, email, password);
    } catch (error) {
      console.error('Error logging in with email:', error);
      throw error;
    }
  }

  async registerWithEmail(name: string, email: string, password: string) {
    try {
      const credential = await createUserWithEmailAndPassword(this.firebaseAuth, email, password);

      if (credential.user) {
        await updateProfile(credential.user, { displayName: name });
      }
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }

  async recoverPassword(email: string) {
    try {
      await sendPasswordResetEmail(this.firebaseAuth, email);
    } catch (error) {
      console.error('Error sending password recovery email:', error);
      throw error;
    }
  }

  async logout() {
    try {
      await signOut(this.firebaseAuth);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }
}
