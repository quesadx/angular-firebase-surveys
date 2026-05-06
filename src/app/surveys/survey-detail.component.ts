import { AsyncPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QRCodeComponent } from 'angularx-qrcode';
import { environment } from '../../environments/environment';
import { SurveyService } from './survey.service';

@Component({
  selector: 'app-survey-detail',
  standalone: true,
  imports: [AsyncPipe, QRCodeComponent],
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

              @if (shareUrl) {
                <div class="qr-card">
                  <h3>Share this survey</h3>
                  <qrcode [qrdata]="shareUrl" [width]="196" [errorCorrectionLevel]="'M'"></qrcode>
                  <a class="share-link" [href]="shareUrl" target="_blank" rel="noreferrer">
                    {{ shareUrl }}
                  </a>
                </div>
              }

              <div class="options-list">
                <h3>Options</h3>
                <ul class="options-grid">
                  @for (option of survey.options; track option; let idx = $index) {
                    <li class="option-card">
                      <span class="option-index">{{ idx + 1 }}</span>
                      <span class="option-text">{{ option }}</span>
                    </li>
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
  private readonly surveyService = inject(SurveyService);

  protected readonly isLoadingError = signal(false);
  protected readonly survey$;
  protected readonly shareUrl: string | null;

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    const trimmedId = id?.trim();

    this.shareUrl = trimmedId ? `${environment.appUrl}/surveys/${trimmedId}` : null;

    if (!trimmedId) {
      this.isLoadingError.set(true);
      this.survey$ = null;
    } else {
      try {
        this.survey$ = this.surveyService.getSurvey(trimmedId);
      } catch (error) {
        console.error('Error loading survey:', error);
        this.isLoadingError.set(true);
        this.survey$ = null;
      }
    }
  }
}
