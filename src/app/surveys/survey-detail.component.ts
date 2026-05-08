import { CommonModule } from '@angular/common';
import { Component, inject, signal, computed, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QRCodeComponent } from 'angularx-qrcode';
import { environment } from '../../environments/environment';
import { SurveyService } from './survey.service';
import { Auth, authState } from '@angular/fire/auth';
import type { Observable, Subscription } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-survey-detail',
  standalone: true,
  imports: [QRCodeComponent, BaseChartDirective, CommonModule],
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
          @let survey = survey$();
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

              <div class="chart-block">
                <h3>Results</h3>
                <div class="chart-container" *ngIf="totalVotes() > 0">
                  <canvas
                    #pieChart
                    baseChart
                    [type]="'pie'"
                    [data]="chartData()"
                    [options]="chartOptions"
                  ></canvas>
                </div>
                <div *ngIf="totalVotes() === 0" class="notice info">No votes yet. Be the first to vote!</div>
              </div>

              <div class="options-list">
                <h3>Options</h3>
                <p class="vote-count">{{ totalVotes() }} vote{{ totalVotes() !== 1 ? 's' : '' }}</p>
                <ul class="options-grid">
                  @for (option of survey.options; track option; let idx = $index) {
                    <li class="option-card">
                      <span class="option-index">{{ idx + 1 }}</span>
                      <span class="option-text">{{ option }}</span>
                      <span class="vote-percentage">{{ getVotePercentage(option) }}%</span>
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
export class SurveyDetailComponent implements OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly surveyService = inject(SurveyService);
  private readonly auth = inject(Auth);

  @ViewChild('pieChart') pieChart?: BaseChartDirective;

  protected readonly isLoadingError = signal(false);
  protected readonly survey$ = signal<any>(null);
  protected readonly shareUrl: string | null;
  protected readonly hasVoted = signal(false);
  protected readonly userVote = signal<string | null>(null);
  protected readonly isVoting = signal(false);
  private surveyId: string | null = null;
  private subscriptions: Subscription[] = [];

  // Signal that listens to real-time votes
  protected readonly allVotes = signal<any[]>([]);

  // Computed signal: total vote count
  protected readonly totalVotes = computed(() => this.allVotes().length);

  // Computed signal: chart data derived from votes
  protected readonly chartData = computed(() => {
    const survey = this.survey$();
    const votes = this.allVotes();

    if (!survey) {
      return { labels: [], datasets: [{ data: [] }] };
    }

    const options = (survey.options || []) as string[];
    const colors = [
      '#6b46ff',
      '#ec4899',
      '#f59e0b',
      '#10b981',
      '#06b6d4',
      '#8b5cf6'
    ];

    const counts = options.map((option) =>
      votes.filter((v) => (v as any).option === option).length
    );

    const data = {
      labels: options,
      datasets: [
        {
          data: counts,
          backgroundColor: colors.slice(0, options.length),
          borderColor: '#ffffff',
          borderWidth: 2
        }
      ]
    };

    // Trigger chart update if it exists
    if (this.pieChart) {
      setTimeout(() => this.pieChart?.chart?.update('none'), 0);
    }

    return data;
  });

  // Chart configuration
  protected readonly chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: { size: 13, weight: 'bold' },
          color: '#1d152d',
          padding: 12,
          usePointStyle: true
        }
      },
      tooltip: {
        backgroundColor: 'rgba(29, 21, 45, 0.9)',
        padding: 12,
        titleFont: { size: 13, weight: 'bold' },
        bodyFont: { size: 12 },
        borderColor: '#7a5ad6',
        borderWidth: 1,
        displayColors: true,
        callbacks: {
          label: (ctx) => {
            const label = ctx.label || '';
            const value = ctx.parsed || 0;
            const total = (ctx.dataset.data as number[]).reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    const trimmedId = id?.trim();
    this.shareUrl = trimmedId ? `${environment.appUrl}/surveys/${trimmedId}` : null;

    if (!trimmedId) {
      this.isLoadingError.set(true);
      this.survey$.set(null);
    } else {
      try {
        this.surveyId = trimmedId;
        
        // Subscribe to survey data and update signal
        const surveySubscription = this.surveyService.getSurvey(trimmedId).subscribe((survey) => {
          this.survey$.set(survey || null);
        });
        this.subscriptions.push(surveySubscription);

        // Listen for all votes in real-time and update the signal
        const votesSubscription = this.surveyService.getSurveyVotes(trimmedId).subscribe((votes) => {
          this.allVotes.set(votes || []);
        });
        this.subscriptions.push(votesSubscription);

        // Listen for the current user's vote to disable UI when needed
        const authSubscription = authState(this.auth).subscribe((user) => {
          if (user && this.surveyId) {
            const userVoteSubscription = this.surveyService.getUserVote(this.surveyId, user.uid).subscribe((vote) => {
              if (vote && (vote as any).option) {
                this.userVote.set((vote as any).option);
                this.hasVoted.set(true);
              } else {
                this.userVote.set(null);
                this.hasVoted.set(false);
              }
            });
            this.subscriptions.push(userVoteSubscription);
          }
        });
        this.subscriptions.push(authSubscription);
      } catch (error) {
        console.error('Error loading survey:', error);
        this.isLoadingError.set(true);
        this.survey$.set(null);
      }
    }
  }

  protected getVotePercentage(option: string): number {
    const total = this.totalVotes();
    if (total === 0) return 0;

    const count = this.allVotes().filter((v) => (v as any).option === option).length;
    return Math.round((count / total) * 100);
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

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
