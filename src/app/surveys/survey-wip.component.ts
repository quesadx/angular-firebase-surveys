import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-survey-wip',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page">
      <div class="card">
        <header class="card-header">
          <p class="eyebrow">Survey</p>
          <h1>Work in progress</h1>
          <p class="subtitle">This view is under development. The created survey would go here.</p>
        </header>

        <div class="notice info">
          <p>The survey is not yet available, but we have redirected you to the survey page.</p>
        </div>
      </div>
    </section>
  `,
  styleUrl: './new-survey.component.scss'
})
export class SurveyWipComponent {}
