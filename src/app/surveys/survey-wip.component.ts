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
          <p class="eyebrow">Encuesta</p>
          <h1>Work in progress</h1>
          <p class="subtitle">Esta vista está en desarrollo. Aquí iría la encuesta creada.</p>
        </header>

        <div class="notice info">
          <p>La encuesta aún no está disponible, pero te hemos redirigido a la página de encuesta.</p>
        </div>
      </div>
    </section>
  `,
  styleUrl: './new-survey.component.scss'
})
export class SurveyWipComponent {}
