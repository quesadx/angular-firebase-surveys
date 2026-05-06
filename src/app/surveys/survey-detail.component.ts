import { AsyncPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SurveyService } from './survey.service';

@Component({
  selector: 'app-survey-detail',
  standalone: true,
  imports: [AsyncPipe],
  template: `
    <section class="page">
      <div class="card">
        <header class="card-header">
          <p class="eyebrow">Survey</p>
          <h1>Survey Details</h1>
        </header>

        @if (isLoadingError()) {
          <p class="notice error">Survey not found or invalid ID.</p>
        } @else {
          @let survey = (survey$ | async);
          @if (survey) {
            <div class="survey-detail">
              <h2>{{ survey.title }}</h2>
              <p class="subtitle">{{ survey.description || 'No description' }}</p>

              <div class="options-list">
                <h3>Options</h3>
                <ul>
                  @for (option of survey.options; track option) {
                    <li>{{ option }}</li>
                  }
                </ul>
              </div>
            </div>
          } @else {
            <p>Loading survey...</p>
          }
        }
      </div>
    </section>
  `,
  styleUrl: './new-survey.component.scss'
})
export class SurveyDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly surveyService = inject(SurveyService);

  protected readonly isLoadingError = signal(false);
  protected readonly survey$;

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id || id.trim() === '') {
      this.isLoadingError.set(true);
      this.survey$ = null;
    } else {
      try {
        this.survey$ = this.surveyService.getSurvey(id);
      } catch (error) {
        console.error('Error loading survey:', error);
        this.isLoadingError.set(true);
        this.survey$ = null;
      }
    }
  }
}
}
