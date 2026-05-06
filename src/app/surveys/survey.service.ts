import { Injectable, inject } from '@angular/core';
import {
  addDoc,
  collection,
  doc,
  docData,
  DocumentReference,
  Firestore,
  serverTimestamp
} from '@angular/fire/firestore';
import type { Observable } from 'rxjs';

export interface Survey {
  id?: string;
  title: string;
  description: string;
  options: string[];
  createdAt?: unknown;
}

@Injectable({
  providedIn: 'root'
})
export class SurveyService {
  private readonly firestore = inject(Firestore);

  addSurvey(survey: Omit<Survey, 'id' | 'createdAt'>) {
    return addDoc(collection(this.firestore, 'encuestas'), {
      ...survey,
      createdAt: serverTimestamp()
    });
  }

  getSurvey(id: string): Observable<Survey | undefined> {
    const surveyDoc = doc(this.firestore, 'encuestas', id) as DocumentReference<Survey>;
    return docData<Survey, Survey>(surveyDoc, { idField: 'id' }) as Observable<Survey | undefined>;
  }
}
