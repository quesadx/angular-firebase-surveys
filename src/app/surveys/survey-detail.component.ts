import { AsyncPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QRCodeComponent } from 'angularx-qrcode';
import { environment } from '../../environments/environment';
import { SurveyService } from './survey.service';
import { Auth, authState } from '@angular/fire/auth';
import type { Observable } from 'rxjs';

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
              <div class="detail-row">
                <p class="detail-label">Title</p>
                <h2 class="detail-title">{{ survey.title }}</h2>
              </div>
              <div class="detail-row">
                <p class="detail-label">Subtitle</p>
                <p class="subtitle">{{ survey.description || 'No description' }}</p>
              </div>

              @if (shareUrl) {
                <div class="qr-block">
                  <h3>Share this survey</h3>
                  <div class="qr-card">
                    <qrcode [qrdata]="shareUrl" [width]="196" [errorCorrectionLevel]="'M'"></qrcode>
                    <a class="share-link" [href]="shareUrl" target="_blank" rel="noreferrer">
                      {{ shareUrl }}
                    </a>
                  </div>
                </div>
              }

              <div class="options-list">
                <h3>Options</h3>
                <ul class="options-grid">
                  @for (option of survey.options; track option; let idx = $index) {
                    <li class="option-card">
                      <span class="option-index">{{ idx + 1 }}</span>
                      <span class="option-text">{{ option }}</span>
                      <button class="primary vote-btn" (click)="vote(option)" [disabled]="hasVoted() || isVoting()">
                        {{ hasVoted() ? 'Voted' : 'Vote' }}
                      </button>
                    </li>
                  }
                </ul>
                @if (hasVoted()) {
                  <div class="notice success">Tu voto ha sido registrado: {{ userVote() }}</div>
                }
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
  private readonly auth = inject(Auth);

  protected readonly isLoadingError = signal(false);
  protected readonly survey$;
  protected readonly shareUrl: string | null;
  protected readonly hasVoted = signal(false);
  protected readonly userVote = signal<string | null>(null);
  protected readonly isVoting = signal(false);
  protected readonly votes$: Observable<any> | null = null;
  private surveyId: string | null = null;

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    const trimmedId = id?.trim();
    this.shareUrl = trimmedId ? `${environment.appUrl}/surveys/${trimmedId}` : null;

    if (!trimmedId) {
      this.isLoadingError.set(true);
      this.survey$ = null;
    } else {
      try {
        this.surveyId = trimmedId;
        this.survey$ = this.surveyService.getSurvey(trimmedId);

        // Listen for votes in real-time (for future result visualization)
        // and listen for the current user's vote to disable UI when needed
        authState(this.auth).subscribe((user) => {
          if (user && this.surveyId) {
            this.surveyService.getUserVote(this.surveyId, user.uid).subscribe((vote) => {
              if (vote && (vote as any).option) {
                this.userVote.set((vote as any).option);
                this.hasVoted.set(true);
              } else {
                this.userVote.set(null);
                this.hasVoted.set(false);
              }
            });
          }
        });
      } catch (error) {
        console.error('Error loading survey:', error);
        this.isLoadingError.set(true);
        this.survey$ = null;
      }
    }
  }

  protected async vote(option: string) {
    if (!this.surveyId || this.isVoting()) return;

    this.isVoting.set(true);
    try {
      await this.surveyService.vote(this.surveyId, option);
      this.userVote.set(option);
      this.hasVoted.set(true);
    } catch (error) {
      console.error('Vote error:', error);
    } finally {
      this.isVoting.set(false);
    }
  }
}
