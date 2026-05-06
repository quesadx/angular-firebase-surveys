import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SurveyService } from './survey.service';

@Component({
  selector: 'app-survey-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page">
      <div class="card">
        <header class="card-header">
          <p class="eyebrow">Encuesta</p>
          <h1>Detalle de la encuesta</h1>
        </header>

        <div *ngIf="survey$ | async as survey; else loading">
          <ng-container *ngIf="survey; else notFound">
            <div class="survey-detail">
              <h2>{{ survey.title }}</h2>
              <p class="subtitle">{{ survey.description || 'Sin descripción' }}</p>

              <div class="options-list">
                <h3>Opciones</h3>
                <ul>
                  <li *ngFor="let option of survey.options">{{ option }}</li>
                </ul>
              </div>
            </div>
          </ng-container>
        </div>

        <ng-template #loading>
          <p>Cargando encuesta...</p>
        </ng-template>

        <ng-template #notFound>
          <p class="notice warning">Encuesta no encontrada.</p>
        </ng-template>
      </div>
    </section>
  `,
  styleUrl: './new-survey.component.scss'
})
export class SurveyDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly surveyService = inject(SurveyService);

  protected readonly survey$ = this.surveyService.getSurvey(this.route.snapshot.paramMap.get('id') ?? '');
}
