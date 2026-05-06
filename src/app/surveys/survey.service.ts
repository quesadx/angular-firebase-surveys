import { Injectable, inject } from '@angular/core';
import {
  addDoc,
  collection,
  doc,
  docData,
  DocumentReference,
  Firestore,
  serverTimestamp,
  Timestamp
} from '@angular/fire/firestore';
import { Auth, authState } from '@angular/fire/auth';
import type { Observable } from 'rxjs';
import { firstValueFrom } from 'rxjs';

export interface Survey {
  id?: string;
  title: string;
  description: string;
  options: string[];
  createdAt?: Timestamp;
  createdBy?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SurveyService {
  private readonly firestore = inject(Firestore);
  private readonly auth = inject(Auth);

  async addSurvey(survey: Omit<Survey, 'id' | 'createdAt' | 'createdBy'>) {
    // Get current authenticated user
    const currentUser = await firstValueFrom(authState(this.auth));
    if (!currentUser) {
      throw new Error('User must be authenticated to create a survey');
    }

    return addDoc(collection(this.firestore, 'surveys'), {
      ...survey,
      createdBy: currentUser.uid,
      createdAt: serverTimestamp()
    });
  }

  getSurvey(id: string): Observable<Survey | undefined> {
    if (!id || id.trim() === '') {
      throw new Error('Survey ID cannot be empty');
    }

    const surveyDoc = doc(this.firestore, 'surveys', id) as DocumentReference<Survey>;
    return docData(surveyDoc, { idField: 'id' });
  }
}
