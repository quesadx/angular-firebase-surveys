import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';

const minOptionsValidator = (min: number): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const array = control as FormArray;
    if (!array || typeof array.length !== 'number') {
      return { minOptions: { required: min, actual: 0 } };
    }

    return array.length >= min ? null : { minOptions: { required: min, actual: array.length } };
  };
};

@Component({
  selector: 'app-new-survey',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="page">
      <div class="card">
        <header class="card-header">
          <p class="eyebrow">Formulario</p>
          <h1>Nueva encuesta</h1>
          <p class="subtitle">Crea una encuesta con al menos 2 opciones.</p>
        </header>

        <form class="survey-form" [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="field">
            <label for="title">Titulo</label>
            <input
              id="title"
              type="text"
              formControlName="title"
              maxlength="120"
              placeholder="Ej: Sabor favorito"
            />
            <div class="field-meta">
              <span class="hint">Obligatorio</span>
              <span class="counter">{{ titleLength() }}/120</span>
            </div>
            @if (isTitleInvalid()) {
              <p class="error">El titulo es requerido.</p>
            }
          </div>

          <div class="field">
            <label for="description">Descripcion (opcional)</label>
            <textarea
              id="description"
              rows="4"
              formControlName="description"
              placeholder="Comparte un poco mas de contexto"
            ></textarea>
          </div>

          <div class="field">
            <div class="field-heading">
              <div>
                <label>Opciones</label>
                <p class="hint">Minimo {{ minOptions }} opciones. Actual: {{ optionsCount() }}.</p>
              </div>
            </div>

            <div class="options">
              @for (optionCtrl of options.controls; track $index) {
                <div class="option-row">
                  <input
                    type="text"
                    [formControl]="optionCtrl"
                    placeholder="Opcion {{ $index + 1 }}"
                  />
                  <button
                    class="remove"
                    type="button"
                    (click)="removeOption($index)"
                    [disabled]="options.length <= minOptions"
                    title="Eliminar opción"
                  >
                    ✕
                  </button>
                </div>
                @if (showOptionError(optionCtrl)) {
                  <p class="error">La opcion es requerida.</p>
                }
              }
            </div>

            <div class="add-option-row">
              <button class="ghost" type="button" (click)="addOption()">Agregar opcion</button>
            </div>

            @if (isOptionsInvalid()) {
              <p class="error">Agrega al menos {{ minOptions }} opciones.</p>
            }
          </div>

          <div class="actions">
            <button class="primary" type="submit">Guardar</button>
            <p class="hint">Se guardara cuando conectes Firestore.</p>
          </div>

          @if (saveState() === 'saved') {
            <div class="notice success">Encuesta lista para guardar (sin backend).</div>
          }
        </form>
      </div>
    </section>
  `,
  styleUrl: './new-survey.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewSurveyComponent {
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly minOptions = 2;
  protected readonly optionsCount = signal(this.minOptions);
  protected readonly saveState = signal<'idle' | 'invalid' | 'saved'>('idle');

  protected readonly form = this.fb.group({
    title: this.fb.control('', [Validators.required, Validators.maxLength(120)]),
    description: this.fb.control(''),
    options: this.fb.array<FormControl<string>>([], {
      validators: [minOptionsValidator(this.minOptions)]
    })
  });

  constructor() {
    for (let i = 0; i < this.minOptions; i += 1) {
      this.addOption();
    }
  }

  get options(): FormArray<FormControl<string>> {
    return this.form.controls.options;
  }

  protected titleLength(): number {
    return this.form.controls.title.value.length;
  }

  protected addOption(): void {
    this.options.push(this.fb.control('', [Validators.required, Validators.maxLength(80)]));
    this.optionsCount.set(this.options.length);
  }

  protected removeOption(index: number): void {
    if (this.options.length <= this.minOptions) {
      return;
    }

    this.options.removeAt(index);
    this.optionsCount.set(this.options.length);
  }

  protected showOptionError(control: AbstractControl): boolean {
    return (control.touched || this.saveState() === 'invalid') && control.invalid;
  }

  protected isOptionsInvalid(): boolean {
    return this.saveState() === 'invalid' && Boolean(this.options.errors?.['minOptions']);
  }

  protected isTitleInvalid(): boolean {
    const control = this.form.controls.title;
    return (control.touched || this.saveState() === 'invalid') && control.invalid;
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.saveState.set('invalid');
      this.form.markAllAsTouched();
      return;
    }

    const payload = {
      title: this.form.controls.title.value.trim(),
      description: this.form.controls.description.value.trim(),
      options: this.options.controls.map((control) => control.value.trim()).filter(Boolean)
    };

    console.log('Survey draft:', payload);
    this.saveState.set('saved');
  }
}
