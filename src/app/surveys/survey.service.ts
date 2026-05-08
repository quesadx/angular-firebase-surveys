import { Injectable, inject } from '@angular/core';
import {
  addDoc,
  collection,
  doc,
  docData,
  DocumentReference,
  Firestore,
  serverTimestamp,
  Timestamp,
  collectionData,
  query,
  orderBy,
  setDoc
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

export interface Vote {
  id?: string;
  userId: string;
  option: string;
  createdAt?: Timestamp;
}

@Injectable({
  providedIn: 'root'
})
export class SurveyService {
  private readonly firestore = inject(Firestore);
  private readonly auth = inject(Auth);

  async addSurvey(survey: Omit<Survey, 'id' | 'createdAt' | 'createdBy'>) {
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

  // Real-time list of surveys ordered by creation
  getActiveSurveys(): Observable<Survey[]> {
    const surveysCol = collection(this.firestore, 'surveys');
    const q = query(surveysCol, orderBy('createdAt', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<Survey[]>;
  }

  // Listen to votes for a survey
  getSurveyVotes(surveyId: string): Observable<Vote[]> {
    const votesCol = collection(this.firestore, 'surveys', surveyId, 'votes');
    const q = query(votesCol, orderBy('createdAt', 'asc'));
    return collectionData(q, { idField: 'id' }) as Observable<Vote[]>;
  }

  // Get a single user's vote (real-time)
  getUserVote(surveyId: string, userId: string): Observable<Vote | undefined> {
    const voteDoc = doc(this.firestore, 'surveys', surveyId, 'votes', userId) as DocumentReference<Vote>;
    return docData(voteDoc, { idField: 'id' });
  }

  // Register a vote. If the document already exists the write will be denied by security rules.
  async vote(surveyId: string, option: string) {
    const currentUser = await firstValueFrom(authState(this.auth));
    if (!currentUser) {
      throw new Error('User must be authenticated to vote');
    }

    const voteDoc = doc(this.firestore, 'surveys', surveyId, 'votes', currentUser.uid) as DocumentReference<Vote>;
    await setDoc(voteDoc, {
      userId: currentUser.uid,
      option,
      createdAt: serverTimestamp()
    });
  }
}
