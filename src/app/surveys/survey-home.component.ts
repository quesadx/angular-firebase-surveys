import { CommonModule, AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { SurveyService, Survey } from './survey.service';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-survey-home',
  standalone: true,
  imports: [CommonModule, RouterLink, AsyncPipe],
  template: `
    <section class="page">
      <div class="card">
        <header class="card-header">
          <p class="eyebrow">Surveys</p>
          <h1>Active Surveys</h1>
        </header>

        <ng-container *ngIf="surveys$ | async as surveys; else loading">
          <div *ngIf="surveys.length === 0" class="notice info">No surveys yet.</div>

          <ul class="survey-grid" *ngIf="surveys.length > 0">
            <li *ngFor="let s of surveys" class="survey-card">
              <h3>{{ s.title }}</h3>
              <p class="subtitle">{{ s.description || 'No description' }}</p>
              <div class="card-actions">
                <a [routerLink]="['/surveys', s.id]" class="ghost">Open & Vote</a>
              </div>
            </li>
          </ul>
        </ng-container>

        <ng-template #loading>
          <div class="notice">Loading surveys...</div>
        </ng-template>
      </div>
    </section>
  `,
  styleUrl: './new-survey.component.scss'
})
export class SurveyHomeComponent {
  private readonly surveyService = inject(SurveyService);
  protected readonly surveys$: Observable<Survey[]>;

  constructor() {
    this.surveys$ = this.surveyService.getActiveSurveys();
  }
}
